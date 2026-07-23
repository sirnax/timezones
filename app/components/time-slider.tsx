'use client';

import { Clock, Calendar, Globe } from 'lucide-react';
import { commonTimezones, formatUtcOffset, getUtcOffsetMinutes, getTimezoneAbbreviation } from '@/lib/timezone-utils';

interface TimeSliderProps {
  sliderMinutes: number;
  onSliderChange: (minutes: number) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  referenceTimezone: string;
  onTimezoneChange: (tz: string) => void;
}

export default function TimeSlider({
  sliderMinutes,
  onSliderChange,
  selectedDate,
  onDateChange,
  referenceTimezone,
  onTimezoneChange,
}: TimeSliderProps) {
  const hours = Math.floor((sliderMinutes ?? 0) / 60);
  const mins = (sliderMinutes ?? 0) % 60;
  const timeStr = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;

  const dateStr = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    : '';

  const refOffset = getUtcOffsetMinutes(referenceTimezone ?? 'UTC', selectedDate ?? new Date());

  return (
    <div className="bg-gray-900/80 backdrop-blur-md border-t border-gray-700/50 px-3 py-2 sm:px-4 sm:py-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] sm:pb-3">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          {/* Time display + slider share a row on mobile; sm:contents restores the desktop layout */}
          <div className="flex items-center gap-3 sm:contents">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" aria-hidden="true" />
              <span className="font-mono text-xl font-bold text-white">{timeStr}</span>
            </div>

            <div className="flex-1 min-w-0 sm:min-w-[200px]">
              <input
                type="range"
                min={0}
                max={1439}
                value={sliderMinutes ?? 0}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSliderChange(parseInt(e?.target?.value ?? '0', 10))}
                aria-label="Time of day"
                aria-valuetext={timeStr}
                className="w-full h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                  sm:[&::-webkit-slider-thumb]:w-4 sm:[&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400
                  [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(0,212,255,0.6)]
                  [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
                  sm:[&::-moz-range-thumb]:w-4 sm:[&::-moz-range-thumb]:h-4
                  [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-cyan-400 [&::-moz-range-thumb]:border-none"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-0.5 font-mono" aria-hidden="true">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>23:59</span>
              </div>
            </div>
          </div>

          {/* Date + timezone share a row on mobile */}
          <div className="flex items-center gap-3 sm:contents">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" aria-hidden="true" />
              <input
                type="date"
                value={dateStr}
                aria-label="Date"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const val = e?.target?.value ?? '';
                  if (val) {
                    const parts = val.split('-');
                    onDateChange(new Date(
                      parseInt(parts?.[0] ?? '2026', 10),
                      parseInt(parts?.[1] ?? '1', 10) - 1,
                      parseInt(parts?.[2] ?? '1', 10)
                    ));
                  }
                }}
                className="bg-gray-800 border border-gray-700 text-white text-xs rounded px-2 py-1.5 font-mono focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2 min-w-0 flex-1 sm:flex-none">
              <Globe className="w-4 h-4 text-cyan-400 shrink-0" aria-hidden="true" />
              <select
                value={referenceTimezone ?? 'UTC'}
                aria-label="Reference time zone"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onTimezoneChange(e?.target?.value ?? 'UTC')}
                className="bg-gray-800 border border-gray-700 text-white text-xs rounded px-2 py-1.5 focus:border-cyan-500 min-w-0 flex-1 sm:flex-none max-w-[180px]"
              >
                {(commonTimezones ?? []).map((tz: string) => {
                  const d = selectedDate ?? new Date();
                  const abbr = getTimezoneAbbreviation(tz, d);
                  return (
                    <option key={tz} value={tz}>
                      {abbr} — {tz?.replace?.(/_/g, ' ') ?? tz} ({formatUtcOffset(getUtcOffsetMinutes(tz, d))})
                    </option>
                  );
                })}
              </select>
              <span className="text-xs text-gray-400 font-mono hidden sm:inline">
                {getTimezoneAbbreviation(referenceTimezone ?? 'UTC', selectedDate ?? new Date())} · {formatUtcOffset(refOffset)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
