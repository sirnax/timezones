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
    <div className="bg-gray-900/80 backdrop-blur-md border-t border-gray-700/50 px-4 py-3">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-wrap items-center gap-4">
          {/* Time Display */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-xl font-bold text-white">{timeStr}</span>
          </div>

          {/* Slider */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="range"
              min={0}
              max={1439}
              value={sliderMinutes ?? 0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSliderChange(parseInt(e?.target?.value ?? '0', 10))}
              className="w-full h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400
                [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(0,212,255,0.6)]
                [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-cyan-400 [&::-moz-range-thumb]:border-none"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-0.5 font-mono">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>23:59</span>
            </div>
          </div>

          {/* Date Picker */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <input
              type="date"
              value={dateStr}
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
              className="bg-gray-800 border border-gray-700 text-white text-xs rounded px-2 py-1.5 font-mono focus:outline-hidden focus:border-cyan-500"
            />
          </div>

          {/* Reference Timezone */}
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <select
              value={referenceTimezone ?? 'UTC'}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onTimezoneChange(e?.target?.value ?? 'UTC')}
              className="bg-gray-800 border border-gray-700 text-white text-xs rounded px-2 py-1.5 focus:outline-hidden focus:border-cyan-500 max-w-[180px]"
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
  );
}
