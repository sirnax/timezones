'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, MapPin, Star } from 'lucide-react';
import { Capital } from '@/lib/capitals-data';
import { getTimezoneAbbreviation } from '@/lib/timezone-utils';

interface SearchBarProps {
  capitals: Capital[];
  favourites: string[];
  onToggleFavourite: (cityKey: string) => void;
}

const LISTBOX_ID = 'city-listbox';

export default function SearchBar({ capitals, favourites, onToggleFavourite }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = (query ?? '').toLowerCase();
    if (!q) return [];
    return (capitals ?? [])
      .filter(
        (c: Capital) =>
          (c?.city ?? '').toLowerCase().includes(q) ||
          (c?.country ?? '').toLowerCase().includes(q),
      )
      .slice(0, 10);
  }, [capitals, query]);

  const expanded = isOpen && filtered.length > 0;
  const clampedActiveIndex = Math.min(activeIndex, Math.max(filtered.length - 1, 0));

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

  const selectOption = (cap: Capital) => {
    onToggleFavourite(`${cap?.city ?? ''}-${cap?.country ?? ''}`);
    setQuery('');
    setIsOpen(false);
    setActiveIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!expanded) setIsOpen(true);
        else setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (expanded) setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Enter': {
        if (!expanded) return;
        e.preventDefault();
        const cap = filtered[clampedActiveIndex];
        if (cap) selectOption(cap);
        break;
      }
      case 'Escape':
        setIsOpen(false);
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-label="Search cities"
          aria-expanded={expanded}
          aria-controls={LISTBOX_ID}
          aria-autocomplete="list"
          aria-activedescendant={expanded ? `city-option-${clampedActiveIndex}` : undefined}
          value={query ?? ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(e?.target?.value ?? '');
            setIsOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search cities..."
          className="w-full bg-gray-800/80 border border-gray-700/50 text-white text-sm rounded-lg pl-10 pr-4 py-2
            placeholder-gray-400 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
        />
      </div>

      <div aria-live="polite" className="sr-only">
        {expanded
          ? `${filtered.length} result${filtered.length === 1 ? '' : 's'} available`
          : ''}
      </div>

      {expanded && (
        <div
          ref={dropdownRef}
          role="listbox"
          id={LISTBOX_ID}
          aria-label="Cities"
          className="absolute top-full mt-1 w-full bg-gray-900/95 border border-gray-700/50 rounded-lg shadow-xl z-50 backdrop-blur-md overflow-hidden"
        >
          {(filtered ?? []).map((cap: Capital, index: number) => {
            const key = `${cap?.city ?? ''}-${cap?.country ?? ''}`;
            const isFav = (favourites ?? []).includes(key);
            const isActive = index === clampedActiveIndex;
            return (
              <div
                key={key}
                id={`city-option-${index}`}
                role="option"
                aria-selected={isActive}
                onClick={() => selectOption(cap)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left cursor-pointer ${
                  isActive ? 'bg-gray-800/80' : ''
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate">{cap?.city ?? ''}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {cap?.country ?? ''} · {getTimezoneAbbreviation(cap?.timezone ?? 'UTC', new Date())}
                  </p>
                </div>
                {isFav && (
                  <>
                    <Star className="w-3.5 h-3.5 text-cyan-400 shrink-0 fill-cyan-400" aria-hidden="true" />
                    <span className="sr-only">favourite</span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
