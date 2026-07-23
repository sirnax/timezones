'use client';

import dynamic from 'next/dynamic';

const TimezoneMapApp = dynamic(() => import('./components/timezone-map-app'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-dvh bg-[#070b1a]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Loading Time Zones...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return <TimezoneMapApp />;
}
