'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
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

const TOPO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

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

export default function WorldMap({ capitals, favourites, onToggleFavourite, utcDate }: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);
  const [worldData, setWorldData] = useState<any>(null);
  const [dimensions, setDimensions] = useState({ width: 960, height: 500 });

  // Fetch world data once
  useEffect(() => {
    fetch(TOPO_URL)
      .then((res) => res?.json?.())
      .then((data: any) => setWorldData(data))
      .catch(() => {});
  }, []);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect?.width ?? 960, height: Math.max((rect?.width ?? 960) * 0.5, 400) });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Render map
  useEffect(() => {
    if (!worldData || !svgRef?.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;

    const projection = d3.geoNaturalEarth1()
      .scale(width / 5.8)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const countries = topojson.feature(worldData, worldData?.objects?.countries) as any;

    // Ocean background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#0a0e27');

    // Globe outline
    svg.append('path')
      .datum({ type: 'Sphere' } as any)
      .attr('d', path as any)
      .attr('fill', '#0d1330')
      .attr('stroke', '#1a2455')
      .attr('stroke-width', 0.5);

    // Graticule
    const graticule = d3.geoGraticule();
    svg.append('path')
      .datum(graticule())
      .attr('d', path as any)
      .attr('fill', 'none')
      .attr('stroke', '#1a2455')
      .attr('stroke-width', 0.3);

    // Countries colored by timezone offset
    const countriesGroup = svg.append('g');
    const features = countries?.features ?? [];
    countriesGroup.selectAll('path')
      .data(features)
      .enter()
      .append('path')
      .attr('d', path as any)
      .attr('fill', (d: any) => {
        // Get centroid to determine approximate offset
        const centroid = d3.geoCentroid(d);
        const approxOffset = Math.round((centroid?.[0] ?? 0) / 15);
        return offsetToColor(approxOffset);
      })
      .attr('stroke', '#1a2455')
      .attr('stroke-width', 0.4)
      .attr('opacity', 0.85);

    // Night overlay
    const nightPoints = computeNightPolygon(utcDate);
    const nightGeoJson: any = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [nightPoints],
      },
      properties: {},
    };

    svg.append('path')
      .datum(nightGeoJson)
      .attr('d', path as any)
      .attr('fill', 'rgba(0, 0, 0, 0.45)')
      .attr('pointer-events', 'none');

    // Capital city markers
    const markersGroup = svg.append('g');
    (capitals ?? []).forEach((cap: Capital) => {
      const coords = projection([cap?.lng ?? 0, cap?.lat ?? 0]);
      if (!coords) return;

      const isFav = (favourites ?? []).includes(`${cap?.city}-${cap?.country}`);
      const tz = cap?.timezone ?? 'UTC';
      const offset = getUtcOffsetMinutes(tz, utcDate);
      const timeInfo = getTimeInTimezone(utcDate, tz);
      const abbr = getTimezoneAbbreviation(tz, utcDate);

      const g = markersGroup.append('g')
        .attr('transform', `translate(${coords[0]},${coords[1]})`)
        .attr('cursor', 'pointer');

      // Outer glow for favourites
      if (isFav) {
        g.append('circle')
          .attr('r', 6)
          .attr('fill', 'none')
          .attr('stroke', '#00d4ff')
          .attr('stroke-width', 1.5)
          .attr('opacity', 0.7);
      }

      // Dot
      g.append('circle')
        .attr('r', isFav ? 3.5 : 2)
        .attr('fill', isFav ? '#00d4ff' : '#ffffff')
        .attr('opacity', isFav ? 1 : 0.7)
        .attr('stroke', isFav ? '#00d4ff' : 'none')
        .attr('stroke-width', 0.5);

      // Hover and click
      g.on('mouseover', function (event: any) {
        d3.select(this).select('circle').attr('r', isFav ? 5 : 3.5);
        const containerRect = containerRef?.current?.getBoundingClientRect();
        setTooltip({
          x: (event?.clientX ?? 0) - (containerRect?.left ?? 0),
          y: (event?.clientY ?? 0) - (containerRect?.top ?? 0) - 10,
          content: `${cap?.city ?? ''}, ${cap?.country ?? ''}\n${timeInfo?.time ?? '00:00'} ${abbr} (${formatUtcOffset(offset)})`,
        });
      })
        .on('mouseout', function () {
          d3.select(this).select('circle').attr('r', isFav ? 3.5 : 2);
          setTooltip(null);
        })
        .on('click', () => {
          onToggleFavourite(`${cap?.city ?? ''}-${cap?.country ?? ''}`);
        });
    });
  }, [worldData, dimensions, capitals, favourites, utcDate, onToggleFavourite]);

  return (
    <div ref={containerRef} className="relative w-full" style={{ minHeight: 400 }}>
      <svg
        ref={svgRef}
        width={dimensions?.width ?? 960}
        height={dimensions?.height ?? 500}
        className="w-full h-auto"
      />
      {tooltip && (
        <div
          className="absolute pointer-events-none z-50 bg-gray-900/95 border border-cyan-500/30 text-white text-xs px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm"
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
