'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { capitals } from '@/lib/capitals-data';
import { buildUtcFromSlider, getUserTimezone } from '@/lib/timezone-utils';
import FavouritesPanel from './favourites-panel';
import TimeSlider from './time-slider';
import SearchBar from './search-bar';
import { Globe, Star, ChevronRight } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

const WorldMap = dynamic(() => import('./world-map'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex flex-col items-center gap-3">
        <Globe className="w-10 h-10 text-cyan-500 animate-pulse" aria-hidden="true" />
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
  // Start open on desktop only — on mobile the drawer would cover the map on load
  const [favouritesOpen, setFavouritesOpen] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches,
  );
  const [isLive, setIsLive] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const isDesktop = useMediaQuery('(min-width: 768px)');
  const favouritesToggleRef = useRef<HTMLButtonElement>(null);

  // Client-only init
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-time client-only init after mount
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
      const isRemoving = safePrev.includes(cityKey);
      const next = isRemoving
        ? safePrev.filter((k: string) => k !== cityKey)
        : [...safePrev, cityKey];
      saveFavourites(next);
      const city = (capitals ?? []).find((c) => `${c.city}-${c.country}` === cityKey)?.city ?? cityKey;
      setAnnouncement(`${city} ${isRemoving ? 'removed from' : 'added to'} favourites`);
      return next;
    });
  }, []);

  const closeFavourites = useCallback(() => {
    setFavouritesOpen(false);
    favouritesToggleRef.current?.focus();
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

  const favouritesPanel = (
    <FavouritesPanel
      capitals={capitals ?? []}
      favourites={favourites ?? []}
      onToggleFavourite={toggleFavourite}
      utcDate={utcDate}
    />
  );

  return (
    <div className="relative flex flex-col h-dvh bg-[#070b1a] text-white overflow-hidden">
      <a
        href="#map"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-gray-900 focus:px-3 focus:py-2 focus:text-sm"
      >
        Skip to map
      </a>
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 px-3 sm:px-4 py-2.5 z-10">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Globe className="w-6 h-6 text-cyan-400" aria-hidden="true" />
            <h1 className="font-display text-lg font-bold tracking-tight hidden sm:block">
              Time<span className="text-cyan-400">Zones</span>
            </h1>
          </div>

          <div className="flex-1 min-w-0 max-w-sm">
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
              aria-label="Live time updates"
              aria-pressed={isLive}
              className={`flex items-center gap-1.5 px-2.5 py-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium transition-all ${
                isLive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
              }`}
            >
              <span
                aria-hidden="true"
                className={`w-2 h-2 rounded-full ${isLive ? 'bg-cyan-400 animate-pulse' : 'bg-gray-600'}`}
              />
              LIVE
            </button>

            <button
              ref={favouritesToggleRef}
              onClick={() => setFavouritesOpen((p: boolean) => !p)}
              aria-label="Favourites"
              aria-expanded={favouritesOpen}
              aria-controls={isDesktop ? 'favourites-sidebar' : undefined}
              className="flex items-center gap-1.5 px-2.5 py-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700 hover:border-cyan-500/30 transition-all"
            >
              <Star className="w-3.5 h-3.5" aria-hidden="true" />
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
        <main id="map" tabIndex={-1} className="flex-1 overflow-hidden relative">
          <WorldMap
            capitals={capitals ?? []}
            favourites={favourites ?? []}
            onToggleFavourite={toggleFavourite}
            utcDate={utcDate}
          />
          {/* Offset legend */}
          <div className="absolute bottom-2 left-2 p-2 md:bottom-4 md:left-4 md:p-3 mb-[env(safe-area-inset-bottom)] bg-gray-900/80 backdrop-blur-xs border border-gray-700/50 rounded-lg z-10">
            <p className="text-[10px] text-gray-400 mb-1.5 font-medium">UTC Offset</p>
            <div
              className="flex items-center gap-0"
              role="img"
              aria-label="Map colour legend: UTC offsets from minus 12 to plus 14"
            >
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
                  <div key={i} className="flex flex-col items-center" aria-hidden="true">
                    <div className="w-3 h-2" style={{ backgroundColor: color }} />
                    {i % 2 === 0 && (
                      <span className="text-[10px] text-gray-400 mt-0.5">
                        {offset >= 0 ? `+${offset}` : `${offset}`}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* Favourites: sidebar on desktop, bottom drawer on mobile */}
        {isDesktop ? (
          favouritesOpen && (
            <aside
              id="favourites-sidebar"
              aria-label="Favourites"
              className="w-72 bg-gray-900/60 backdrop-blur-md border-l border-gray-700/50 flex flex-col overflow-hidden"
            >
              <div className="px-3 py-3 border-b border-gray-700/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                  <h2 className="text-sm font-semibold">Favourites</h2>
                </div>
                <button
                  onClick={closeFavourites}
                  aria-label="Close favourites panel"
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">{favouritesPanel}</div>
            </aside>
          )
        ) : (
          <Drawer open={favouritesOpen} onOpenChange={setFavouritesOpen}>
            <DrawerContent>
              <DrawerHeader className="border-b border-gray-700/50 py-3">
                <DrawerTitle className="flex items-center justify-center gap-2 sm:justify-start">
                  <Star className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                  Favourites
                </DrawerTitle>
                <DrawerDescription className="sr-only">
                  Your favourite cities with their local times
                </DrawerDescription>
              </DrawerHeader>
              <div className="h-[65dvh] pb-[env(safe-area-inset-bottom)]">{favouritesPanel}</div>
            </DrawerContent>
          </Drawer>
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
