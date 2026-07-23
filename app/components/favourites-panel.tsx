'use client';

import { X, Star, Sun, Moon, Clock } from 'lucide-react';
import { Capital } from '@/lib/capitals-data';
import {
  getUtcOffsetMinutes,
  formatUtcOffset,
  getTimeInTimezone,
  getTimezoneAbbreviation,
  isDST,
} from '@/lib/timezone-utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FavouritesPanelProps {
  capitals: Capital[];
  favourites: string[];
  onToggleFavourite: (cityKey: string) => void;
  utcDate: Date;
}

export default function FavouritesPanel({
  capitals,
  favourites,
  onToggleFavourite,
  utcDate,
}: FavouritesPanelProps) {
  // Build a lookup, then sort by each city's local time (chronological order)
  const capitalsByKey = new Map<string, Capital>();
  (capitals ?? []).forEach((c: Capital) => {
    capitalsByKey.set(`${c?.city ?? ''}-${c?.country ?? ''}`, c);
  });
  const favCapitals = ((favourites ?? [])
    .map((key: string) => capitalsByKey.get(key))
    .filter(Boolean) as Capital[])
    .sort(
      (a: Capital, b: Capital) =>
        getUtcOffsetMinutes(a?.timezone ?? 'UTC', utcDate) -
        getUtcOffsetMinutes(b?.timezone ?? 'UTC', utcDate)
    );

  if ((favourites ?? []).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
        <Star className="w-10 h-10 text-cyan-500/40 mb-4" />
        <p className="text-sm text-gray-400">No favourites yet</p>
        <p className="text-xs text-gray-500 mt-1">Click on a city marker on the map to add it here</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-2 p-3">
        {(favCapitals ?? []).map((cap: Capital) => {
          const key = `${cap?.city ?? ''}-${cap?.country ?? ''}`;
          const tz = cap?.timezone ?? 'UTC';
          const offset = getUtcOffsetMinutes(tz, utcDate);
          const timeInfo = getTimeInTimezone(utcDate, tz);
          const dst = isDST(tz, utcDate);
          const abbr = getTimezoneAbbreviation(tz, utcDate);
          const hourNum = parseInt(timeInfo?.time?.split?.(':')?.[ 0] ?? '12', 10);
          const isDay = hourNum >= 6 && hourNum < 18;

          return (
            <div
              key={key}
              className="bg-gray-800/60 border border-gray-700/50 rounded-lg p-3 hover:border-cyan-500/30 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  {isDay ? (
                    <Sun className="w-4 h-4 text-yellow-400 shrink-0" />
                  ) : (
                    <Moon className="w-4 h-4 text-blue-300 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{cap?.city ?? ''}</p>
                    <p className="text-xs text-gray-400 truncate">{cap?.country ?? ''}</p>
                  </div>
                </div>
                <button
                  onClick={() => onToggleFavourite(key)}
                  className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all p-1"
                  aria-label={`Remove ${cap?.city ?? ''}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="mt-2 flex items-end justify-between">
                <div>
                  <p className="text-xl font-mono font-bold text-cyan-300">{timeInfo?.time ?? '00:00'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{timeInfo?.date ?? ''}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-cyan-400">{abbr}</p>
                  <p className="text-[11px] text-gray-500 font-mono">{formatUtcOffset(offset)}</p>
                  {dst && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-medium">
                      DST
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
