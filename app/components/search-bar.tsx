'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Star } from 'lucide-react';
import { Capital } from '@/lib/capitals-data';
import { getTimezoneAbbreviation } from '@/lib/timezone-utils';

interface SearchBarProps {
  capitals: Capital[];
  favourites: string[];
  onToggleFavourite: (cityKey: string) => void;
}

export default function SearchBar({ capitals, favourites, onToggleFavourite }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered = (capitals ?? []).filter((c: Capital) => {
    const q = (query ?? '').toLowerCase();
    if (!q) return false;
    return (
      (c?.city ?? '').toLowerCase().includes(q) ||
      (c?.country ?? '').toLowerCase().includes(q)
    );
  }).slice(0, 10);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef?.current &&
        !dropdownRef.current.contains(e?.target as Node) &&
        inputRef?.current &&
        !inputRef.current.contains(e?.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query ?? ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(e?.target?.value ?? '');
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search cities..."
          className="w-full bg-gray-800/80 border border-gray-700/50 text-white text-sm rounded-lg pl-10 pr-4 py-2
            placeholder-gray-500 focus:outline-hidden focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
        />
      </div>

      {isOpen && (query ?? '').length > 0 && (filtered ?? []).length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-1 w-full bg-gray-900/95 border border-gray-700/50 rounded-lg shadow-xl z-50 backdrop-blur-md overflow-hidden"
        >
          {(filtered ?? []).map((cap: Capital) => {
            const key = `${cap?.city ?? ''}-${cap?.country ?? ''}`;
            const isFav = (favourites ?? []).includes(key);
            return (
              <button
                key={key}
                onClick={() => {
                  onToggleFavourite(key);
                  setQuery('');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800/80 transition-colors text-left"
              >
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate">{cap?.city ?? ''}</p>
                  <p className="text-xs text-gray-400 truncate">{cap?.country ?? ''} · {getTimezoneAbbreviation(cap?.timezone ?? 'UTC', new Date())}</p>
                </div>
                {isFav && <Star className="w-3.5 h-3.5 text-cyan-400 shrink-0 fill-cyan-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
