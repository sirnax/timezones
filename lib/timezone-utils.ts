/**
 * Get the UTC offset in minutes for a given IANA timezone at a specific date.
 */
export function getUtcOffsetMinutes(timezone: string, date: Date): number {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    });
    const parts = formatter?.formatToParts?.(date) ?? [];
    const tzPart = parts?.find?.((p: any) => p?.type === 'timeZoneName');
    const tzStr = tzPart?.value ?? 'GMT';
    // Parse "GMT+5:30" or "GMT-8" or "GMT"
    if (tzStr === 'GMT' || tzStr === 'UTC') return 0;
    const match = tzStr?.match?.(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
    if (!match) return 0;
    const sign = match[1] === '+' ? 1 : -1;
    const hours = parseInt(match[2] ?? '0', 10);
    const minutes = parseInt(match[3] ?? '0', 10);
    return sign * (hours * 60 + minutes);
  } catch {
    return 0;
  }
}

/**
 * Format the UTC offset as a string like "UTC+5:30" or "UTC-8".
 */
export function formatUtcOffset(offsetMinutes: number): string {
  if (offsetMinutes === 0) return 'UTC±0';
  const sign = offsetMinutes > 0 ? '+' : '-';
  const abs = Math.abs(offsetMinutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return m > 0 ? `UTC${sign}${h}:${String(m).padStart(2, '0')}` : `UTC${sign}${h}`;
}

/**
 * Get the local time in a given timezone for a specific UTC date.
 */
export function getTimeInTimezone(utcDate: Date, timezone: string): { time: string; date: string; dateObj: Date } {
  try {
    const timeStr = utcDate.toLocaleString('en-GB', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const dateStr = utcDate.toLocaleString('en-GB', {
      timeZone: timezone,
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      weekday: 'short',
    });
    return { time: timeStr ?? '00:00', date: dateStr ?? '', dateObj: utcDate };
  } catch {
    return { time: '00:00', date: '', dateObj: utcDate };
  }
}

/**
 * Check if DST is active for a timezone at a given date.
 */
export function isDST(timezone: string, date: Date): boolean {
  try {
    const jan = new Date(date.getFullYear(), 0, 1);
    const jul = new Date(date.getFullYear(), 6, 1);
    const janOffset = getUtcOffsetMinutes(timezone, jan);
    const julOffset = getUtcOffsetMinutes(timezone, jul);
    if (janOffset === julOffset) return false;
    const currentOffset = getUtcOffsetMinutes(timezone, date);
    const standardOffset = Math.min(janOffset, julOffset);
    return currentOffset !== standardOffset;
  } catch {
    return false;
  }
}

/**
 * Build a UTC date from slider minutes and reference timezone.
 */
export function buildUtcFromSlider(
  sliderMinutes: number,
  referenceTimezone: string,
  selectedDate: Date
): Date {
  // We want sliderMinutes to represent the time in referenceTimezone.
  // First, build a date string for the selected date at sliderMinutes in UTC,
  // then adjust by the reference timezone offset.
  const hours = Math.floor(sliderMinutes / 60);
  const mins = sliderMinutes % 60;

  // Create a date at the selected day, midnight UTC
  const base = new Date(Date.UTC(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
    hours,
    mins,
    0
  ));

  // Get offset of reference timezone at this approximate time
  const offsetMin = getUtcOffsetMinutes(referenceTimezone, base);
  // Subtract offset to get UTC
  return new Date(base.getTime() - offsetMin * 60000);
}

/**
 * Compute the solar terminator (day/night boundary) as an array of [lng, lat] points.
 * This creates a polygon covering the "night" side of the earth.
 */
export function computeNightPolygon(utcDate: Date): [number, number][] {
  const dayOfYear = getDayOfYear(utcDate);
  const hours = utcDate.getUTCHours() + utcDate.getUTCMinutes() / 60 + utcDate.getUTCSeconds() / 3600;

  // Solar declination (approximate)
  const declination = -23.44 * Math.cos((2 * Math.PI / 365) * (dayOfYear + 10));
  const decRad = (declination * Math.PI) / 180;

  // Hour angle of the sun at Greenwich
  const solarNoonLng = -(hours - 12) * 15;

  const points: [number, number][] = [];
  // Trace the terminator line
  for (let lng = -180; lng <= 180; lng += 2) {
    const hourAngle = ((lng - solarNoonLng) * Math.PI) / 180;
    const lat = Math.atan(-Math.cos(hourAngle) / Math.tan(decRad)) * (180 / Math.PI);
    points.push([lng, lat]);
  }

  // Close the polygon on the night side
  // Determine which pole is in darkness
  const nightPole = declination > 0 ? -90 : 90;

  // Add corners to close the polygon
  const closed: [number, number][] = [
    ...points,
    [180, nightPole],
    [-180, nightPole],
    [points[0]?.[0] ?? -180, points[0]?.[1] ?? 0],
  ];

  return closed;
}

function getDayOfYear(date: Date): number {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

/**
 * Get the common timezone abbreviation (e.g. "PST", "GMT", "EST", "IST") for a
 * given IANA timezone at a specific date.  Falls back to the short UTC offset
 * ("GMT+5:30") when the browser doesn't supply a named abbreviation.
 */
export function getTimezoneAbbreviation(timezone: string, date: Date): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    });
    const parts = formatter?.formatToParts?.(date) ?? [];
    const tzPart = parts?.find?.((p: any) => p?.type === 'timeZoneName');
    return tzPart?.value ?? 'UTC';
  } catch {
    return 'UTC';
  }
}

/**
 * Get user's local IANA timezone.
 */
export function getUserTimezone(): string {
  try {
    return Intl?.DateTimeFormat?.()?.resolvedOptions?.()?.timeZone ?? 'UTC';
  } catch {
    return 'UTC';
  }
}

/**
 * Get a curated list of common IANA timezones for the reference selector.
 */
export const commonTimezones: string[] = [
  'Pacific/Honolulu',
  'America/Anchorage',
  'America/Los_Angeles',
  'America/Denver',
  'America/Chicago',
  'America/New_York',
  'America/Sao_Paulo',
  'Atlantic/Reykjavik',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'Africa/Cairo',
  'Africa/Nairobi',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Dhaka',
  'Asia/Bangkok',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Australia/Sydney',
  'Pacific/Auckland',
  'Pacific/Fiji',
  'UTC',
];
