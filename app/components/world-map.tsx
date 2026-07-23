'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { Capital } from '@/lib/capitals-data';
import {
  getUtcOffsetMinutes,
  formatUtcOffset,
  getTimeInTimezone,
  getTimezoneAbbreviation,
  computeNightPolygon,
} from '@/lib/timezone-utils';

interface WorldMapProps {
  capitals: Capital[];
  favourites: string[];
  onToggleFavourite: (cityKey: string) => void;
  utcDate: Date;
}

const TOPO_URL = '/data/countries-110m.json';

// Color scale for UTC offsets: -12 to +14
function offsetToColor(offset: number): string {
  // Map offset from [-12, 14] to [0, 1]
  const t = (offset + 12) / 26;
  const colors = [
    '#1a1a5e', '#1b3a8a', '#1e6bb0', '#2196c4',
    '#26b0a0', '#4caf50', '#8bc34a', '#cddc39',
    '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
    '#e91e63', '#9c27b0',
  ];
  const idx = Math.min(Math.max(Math.floor(t * (colors.length - 1)), 0), colors.length - 2);
  const frac = t * (colors.length - 1) - idx;
  const c1 = d3.rgb(colors[idx] ?? '#1a1a5e');
  const c2 = d3.rgb(colors[idx + 1] ?? '#9c27b0');
  return d3.interpolateRgb(c1.toString(), c2.toString())(frac);
}

interface Dimensions {
  width: number;
  height: number;
}

export default function WorldMap({ capitals, favourites, onToggleFavourite, utcDate }: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const baseLayerRef = useRef<SVGGElement>(null);
  const nightLayerRef = useRef<SVGGElement>(null);
  const markerRefs = useRef<Map<string, SVGGElement>>(new Map());

  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);
  const [worldData, setWorldData] = useState<any>(null);
  const [loadError, setLoadError] = useState(false);
  const [dimensions, setDimensions] = useState<Dimensions | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  // Fetch world data once
  useEffect(() => {
    fetch(TOPO_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: any) => setWorldData(data))
      .catch(() => setLoadError(true));
  }, []);

  // Track container size; debounced so a settle produces exactly one redraw
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      clearTimeout(timer);
      timer = setTimeout(() => {
        setDimensions((prev) => {
          const w = Math.round(width);
          const h = Math.round(height);
          if (w === 0 || h === 0) return prev;
          return prev && prev.width === w && prev.height === h ? prev : { width: w, height: h };
        });
      }, 100);
    });
    ro.observe(el);
    return () => {
      clearTimeout(timer);
      ro.disconnect();
    };
  }, []);

  const projection = useMemo(() => {
    if (!dimensions) return null;
    return d3.geoNaturalEarth1().fitExtent(
      [[8, 8], [dimensions.width - 8, dimensions.height - 8]],
      { type: 'Sphere' } as any,
    );
  }, [dimensions]);

  const path = useMemo(() => (projection ? d3.geoPath().projection(projection) : null), [projection]);

  // Base layer: ocean, sphere, graticule, countries — redraws only on data/size change
  useEffect(() => {
    if (!worldData || !path || !dimensions || !baseLayerRef.current) return;

    const layer = d3.select(baseLayerRef.current);
    layer.selectAll('*').remove();

    const { width, height } = dimensions;
    const countries = topojson.feature(worldData, worldData?.objects?.countries) as any;

    layer.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#0a0e27');

    layer.append('path')
      .datum({ type: 'Sphere' } as any)
      .attr('d', path as any)
      .attr('fill', '#0d1330')
      .attr('stroke', '#1a2455')
      .attr('stroke-width', 0.5);

    const graticule = d3.geoGraticule();
    layer.append('path')
      .datum(graticule())
      .attr('d', path as any)
      .attr('fill', 'none')
      .attr('stroke', '#1a2455')
      .attr('stroke-width', 0.3);

    layer.append('g')
      .selectAll('path')
      .data(countries?.features ?? [])
      .enter()
      .append('path')
      .attr('d', path as any)
      .attr('fill', (d: any) => {
        const centroid = d3.geoCentroid(d);
        const approxOffset = Math.round((centroid?.[0] ?? 0) / 15);
        return offsetToColor(approxOffset);
      })
      .attr('stroke', '#1a2455')
      .attr('stroke-width', 0.4)
      .attr('opacity', 0.85);
  }, [worldData, path, dimensions]);

  // Night layer: redraws on every time tick without touching the rest of the scene
  useEffect(() => {
    if (!path || !nightLayerRef.current) return;

    const layer = d3.select(nightLayerRef.current);
    layer.selectAll('*').remove();

    const nightGeoJson: any = {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [computeNightPolygon(utcDate)] },
      properties: {},
    };

    layer.append('path')
      .datum(nightGeoJson)
      .attr('d', path as any)
      .attr('fill', 'rgba(0, 0, 0, 0.45)')
      .attr('pointer-events', 'none');
  }, [path, utcDate]);

  // Markers sorted west-to-east so arrow keys move visually across the map
  const markers = useMemo(() => {
    if (!projection) return [];
    const sorted = [...(capitals ?? [])].sort((a, b) => (a?.lng ?? 0) - (b?.lng ?? 0));
    return sorted.flatMap((cap) => {
      const coords = projection([cap?.lng ?? 0, cap?.lat ?? 0]);
      if (!coords) return [];
      const key = `${cap?.city}-${cap?.country}`;
      const tz = cap?.timezone ?? 'UTC';
      const timeInfo = getTimeInTimezone(utcDate, tz);
      const abbr = getTimezoneAbbreviation(tz, utcDate);
      const offsetStr = formatUtcOffset(getUtcOffsetMinutes(tz, utcDate));
      const isFav = (favourites ?? []).includes(key);
      return [{
        cap,
        key,
        x: coords[0],
        y: coords[1],
        isFav,
        tooltipContent: `${cap?.city ?? ''}, ${cap?.country ?? ''}\n${timeInfo?.time ?? '00:00'} ${abbr} (${offsetStr})`,
        ariaLabel: `${cap?.city ?? ''}, ${cap?.country ?? ''}, local time ${timeInfo?.time ?? '00:00'} ${abbr} (${offsetStr})${isFav ? ', favourite' : ''}`,
      }];
    });
  }, [projection, capitals, favourites, utcDate]);

  const effectiveActiveKey = useMemo(() => {
    if (activeKey && markers.some((m) => m.key === activeKey)) return activeKey;
    return markers[0]?.key ?? null;
  }, [activeKey, markers]);

  const showTooltipFor = useCallback((marker: { x: number; y: number; tooltipContent: string }) => {
    setTooltip({ x: marker.x, y: marker.y - 10, content: marker.tooltipContent });
  }, []);

  const focusMarker = useCallback((key: string) => {
    setActiveKey(key);
    markerRefs.current.get(key)?.focus();
  }, []);

  const handleGroupKeyDown = useCallback((event: React.KeyboardEvent<SVGGElement>) => {
    if (markers.length === 0) return;
    const currentIndex = Math.max(0, markers.findIndex((m) => m.key === effectiveActiveKey));

    let nextIndex: number | null = null;
    switch (event.key) {
      case 'ArrowRight':
        nextIndex = Math.min(currentIndex + 1, markers.length - 1);
        break;
      case 'ArrowLeft':
        nextIndex = Math.max(currentIndex - 1, 0);
        break;
      case 'ArrowDown':
        nextIndex = Math.min(currentIndex + 10, markers.length - 1);
        break;
      case 'ArrowUp':
        nextIndex = Math.max(currentIndex - 10, 0);
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = markers.length - 1;
        break;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const marker = markers[currentIndex];
        if (marker) onToggleFavourite(marker.key);
        return;
      }
      case 'Escape':
        setTooltip(null);
        return;
      default:
        return;
    }

    event.preventDefault();
    const next = markers[nextIndex];
    if (next) focusMarker(next.key);
  }, [markers, effectiveActiveKey, onToggleFavourite, focusMarker]);

  const clearTooltipOnBackground = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (event.target === event.currentTarget) setTooltip(null);
  }, []);

  if (loadError) {
    return (
      <div ref={containerRef} className="relative flex h-full min-h-0 w-full items-center justify-center">
        <p role="status" className="text-sm text-gray-400">
          Map data unavailable. Check your connection and reload.
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-full min-h-0 w-full">
      {dimensions && (
        <svg
          role="group"
          aria-label="World map showing time zones and capital cities"
          width={dimensions.width}
          height={dimensions.height}
          className="block h-full w-full"
          onClick={clearTooltipOnBackground}
        >
          <title>World map showing time zones and capital cities</title>
          <g ref={baseLayerRef} onClick={() => setTooltip(null)} />
          <g ref={nightLayerRef} />
          <g role="group" aria-label="Capital cities" onKeyDown={handleGroupKeyDown}>
            {markers.map((marker) => {
              const isHighlighted = hoveredKey === marker.key || focusedKey === marker.key;
              const dotRadius = marker.isFav ? (isHighlighted ? 5 : 3.5) : isHighlighted ? 3.5 : 2;
              return (
                <g
                  key={marker.key}
                  ref={(node) => {
                    if (node) markerRefs.current.set(marker.key, node);
                    else markerRefs.current.delete(marker.key);
                  }}
                  role="button"
                  tabIndex={marker.key === effectiveActiveKey ? 0 : -1}
                  aria-pressed={marker.isFav}
                  aria-label={marker.ariaLabel}
                  transform={`translate(${marker.x},${marker.y})`}
                  className="map-marker cursor-pointer"
                  onMouseEnter={() => {
                    setHoveredKey(marker.key);
                    showTooltipFor(marker);
                  }}
                  onMouseLeave={() => {
                    setHoveredKey(null);
                    setTooltip(null);
                  }}
                  onFocus={() => {
                    setFocusedKey(marker.key);
                    setActiveKey(marker.key);
                    showTooltipFor(marker);
                  }}
                  onBlur={() => {
                    setFocusedKey(null);
                    setTooltip(null);
                  }}
                  onClick={() => {
                    onToggleFavourite(marker.key);
                    setTooltip(null);
                  }}
                >
                  {marker.isFav && (
                    <circle r={6} fill="none" stroke="#00d4ff" strokeWidth={1.5} opacity={0.7} />
                  )}
                  <circle
                    r={dotRadius}
                    fill={marker.isFav ? '#00d4ff' : '#ffffff'}
                    opacity={marker.isFav ? 1 : 0.7}
                    stroke={marker.isFav ? '#00d4ff' : 'none'}
                    strokeWidth={0.5}
                  />
                  {focusedKey === marker.key && (
                    <circle r={8} fill="none" stroke="#22d3ee" strokeWidth={2} aria-hidden="true" />
                  )}
                  {/* Invisible hit area so small dots stay tappable on touch screens */}
                  <circle r={12} fill="transparent" stroke="none" />
                </g>
              );
            })}
          </g>
        </svg>
      )}
      {tooltip && (
        <div
          className="absolute pointer-events-none z-50 bg-gray-900/95 border border-cyan-500/30 text-white text-xs px-3 py-2 rounded-lg shadow-lg backdrop-blur-xs"
          style={{
            left: `${tooltip?.x ?? 0}px`,
            top: `${tooltip?.y ?? 0}px`,
            transform: 'translate(-50%, -100%)',
            whiteSpace: 'pre-line',
          }}
        >
          {tooltip?.content ?? ''}
        </div>
      )}
    </div>
  );
}
