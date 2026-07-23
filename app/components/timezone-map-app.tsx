'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { capitals } from '@/lib/capitals-data';
import { buildUtcFromSlider, getUserTimezone } from '@/lib/timezone-utils';
import FavouritesPanel from './favourites-panel';
import TimeSlider from './time-slider';
import SearchBar from './search-bar';
import { Globe, Star, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const WorldMap = dynamic(() => import('./world-map'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full" style={{ minHeight: 400 }}>
      <div className="flex flex-col items-center gap-3">
        <Globe className="w-10 h-10 text-cyan-500 animate-pulse" />
        <p className="text-sm text-gray-400">Loading world map...</p>
      </div>
    </div>
  ),
});

const STORAGE_KEY = 'timezone-map-favourites';

function loadFavourites(): string[] {
  try {
    if (typeof window === 'undefined') return [];
    const stored = localStorage?.getItem?.(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveFavourites(favs: string[]) {
  try {
    localStorage?.setItem?.(STORAGE_KEY, JSON.stringify(favs ?? []));
  } catch {}
}

export default function TimezoneMapApp() {
  const [favourites, setFavourites] = useState<string[]>([]);
  const [sliderMinutes, setSliderMinutes] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 6, 23)); // deterministic SSR
  const [referenceTimezone, setReferenceTimezone] = useState('UTC');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Client-only init
  useEffect(() => {
    setMounted(true);
    setFavourites(loadFavourites());
    const tz = getUserTimezone();
    setReferenceTimezone(tz);
    // Set current time
    const now = new Date();
    setSelectedDate(now);
    const localMinutes = now.getHours() * 60 + now.getMinutes();
    setSliderMinutes(localMinutes);
  }, []);

  // Live clock update
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const now = new Date();
      setSelectedDate(now);
      const localMinutes = now.getHours() * 60 + now.getMinutes();
      setSliderMinutes(localMinutes);
    }, 30000); // update every 30s
    return () => clearInterval(interval);
  }, [isLive]);

  const toggleFavourite = useCallback((cityKey: string) => {
    setFavourites((prev: string[]) => {
      const safePrev = prev ?? [];
      const next = safePrev.includes(cityKey)
        ? safePrev.filter((k: string) => k !== cityKey)
        : [...safePrev, cityKey];
      saveFavourites(next);
      return next;
    });
  }, []);

  const handleSliderChange = useCallback((minutes: number) => {
    setIsLive(false);
    setSliderMinutes(minutes);
  }, []);

  const handleDateChange = useCallback((date: Date) => {
    setIsLive(false);
    setSelectedDate(date);
  }, []);

  // Compute the UTC date from slider + reference timezone
  const utcDate = mounted
    ? buildUtcFromSlider(sliderMinutes, referenceTimezone, selectedDate)
    : new Date(Date.UTC(2026, 6, 23, 12, 0, 0));

  return (
    <div className="flex flex-col h-screen bg-[#070b1a] text-white overflow-hidden">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 px-4 py-2.5 z-10">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-cyan-400" />
            <h1 className="font-display text-lg font-bold tracking-tight">
              World<span className="text-cyan-400">Clock</span>
            </h1>
          </div>

          <div className="flex-1 max-w-sm">
            <SearchBar
              capitals={capitals ?? []}
              favourites={favourites ?? []}
              onToggleFavourite={toggleFavourite}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsLive(true);
                const now = new Date();
                setSelectedDate(now);
                setSliderMinutes(now.getHours() * 60 + now.getMinutes());
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isLive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-cyan-400 animate-pulse' : 'bg-gray-600'}`} />
              LIVE
            </button>

            <button
              onClick={() => setSidebarOpen((p: boolean) => !p)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700 hover:border-cyan-500/30 transition-all"
            >
              <Star className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Favourites</span>
              {(favourites ?? []).length > 0 && (
                <span className="bg-cyan-500/30 text-cyan-300 text-[10px] px-1.5 py-0.5 rounded-full font-mono">
                  {(favourites ?? []).length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map area */}
        <main className="flex-1 overflow-hidden relative">
          <WorldMap
            capitals={capitals ?? []}
            favourites={favourites ?? []}
            onToggleFavourite={toggleFavourite}
            utcDate={utcDate}
          />
          {/* Offset legend */}
          <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-xs border border-gray-700/50 rounded-lg p-3 z-10">
            <p className="text-[10px] text-gray-400 mb-1.5 font-medium">UTC Offset</p>
            <div className="flex items-center gap-0">
              {Array.from({ length: 14 }, (_, i: number) => {
                const offset = -12 + i * 2;
                const t = (offset + 12) / 26;
                const colors = [
                  '#1a1a5e', '#1b3a8a', '#1e6bb0', '#2196c4',
                  '#26b0a0', '#4caf50', '#8bc34a', '#cddc39',
                  '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
                  '#e91e63', '#9c27b0',
                ];
                const idx = Math.min(Math.max(Math.floor(t * (colors.length - 1)), 0), colors.length - 2);
                const color = colors[idx] ?? '#1a1a5e';
                return (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-3 h-2" style={{ backgroundColor: color }} />
                    {i % 2 === 0 && (
                      <span className="text-[8px] text-gray-500 mt-0.5">
                        {offset >= 0 ? `+${offset}` : `${offset}`}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-72 bg-gray-900/60 backdrop-blur-md border-l border-gray-700/50 flex flex-col overflow-hidden">
            <div className="px-3 py-3 border-b border-gray-700/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-semibold">Favourites</h2>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 hover:text-white transition-colors p-1"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <FavouritesPanel
                capitals={capitals ?? []}
                favourites={favourites ?? []}
                onToggleFavourite={toggleFavourite}
                utcDate={utcDate}
              />
            </div>
          </aside>
        )}
      </div>

      {/* Time Slider */}
      <TimeSlider
        sliderMinutes={sliderMinutes}
        onSliderChange={handleSliderChange}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        referenceTimezone={referenceTimezone}
        onTimezoneChange={setReferenceTimezone}
      />
    </div>
  );
}
