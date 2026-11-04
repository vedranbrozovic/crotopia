import React from 'react';

interface TitleScreenProps {
  onStart: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-slate-950/85 text-slate-100 select-none">
      {/* Top Bar / Brand */}
      <div className="w-full max-w-4xl flex items-center justify-between text-xs tracking-widest text-slate-400 font-mono uppercase">
        <span className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-red-500 shadow-sm" />
          Republika Hrvatska · Low-Poly Odyssey
        </span>
        <span>4 Biomes · 14 Wonders</span>
      </div>

      {/* Main Title Centerpiece */}
      <div className="flex flex-col items-center text-center max-w-xl space-y-6 my-auto">
        {/* Bespoke Croatian Crest SVG Emblem */}
        <div className="w-24 h-28 relative flex items-center justify-center filter drop-shadow-lg">
          <svg viewBox="0 0 100 120" className="w-full h-full fill-none">
            {/* Shield Outer Outline */}
            <path
              d="M 10 10 H 90 V 70 C 90 95, 50 115, 50 115 C 50 115, 10 95, 10 70 Z"
              fill="#182230"
              stroke="#e2e8f0"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* 3x3 Low-poly Checkerboard Grid (Croatian Šahovnica) */}
            <g clipPath="url(#shieldClip)">
              <rect x="20" y="20" width="20" height="20" fill="#dc2626" />
              <rect x="40" y="20" width="20" height="20" fill="#f8fafc" />
              <rect x="60" y="20" width="20" height="20" fill="#dc2626" />
              <rect x="20" y="40" width="20" height="20" fill="#f8fafc" />
              <rect x="40" y="40" width="20" height="20" fill="#dc2626" />
              <rect x="60" y="40" width="20" height="20" fill="#f8fafc" />
              <rect x="20" y="60" width="20" height="20" fill="#dc2626" />
              <rect x="40" y="60" width="20" height="20" fill="#f8fafc" />
              <rect x="60" y="60" width="20" height="20" fill="#dc2626" />
            </g>
            <clipPath id="shieldClip">
              <path d="M 16 16 H 84 V 68 C 84 90, 50 108, 50 108 C 50 108, 16 90, 16 68 Z" />
            </clipPath>
          </svg>
        </div>

        {/* Title Lockup */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white font-sans drop-shadow-md">
            CROATIA
          </h1>
          <p className="text-lg md:text-xl font-medium text-amber-300/90 tracking-wide">
            A Cozy Biome Odyssey
          </p>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed max-w-md font-sans">
          Step into a vibrant Polytopia-style low-poly world. Explore the golden Pannonian plains of Slavonia, the romantic hills of Zagorje, the karst peaks of Velebit, and the sun-drenched Adriatic coastline.
        </p>

        {/* Start CTA Button */}
        <div className="pt-2">
          <button
            data-start="true"
            onClick={onStart}
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-red-600 via-amber-600 to-red-600 text-white font-bold text-base shadow-xl hover:shadow-red-500/25 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <span className="tracking-wide">Begin Journey</span>
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Control Hint Line */}
      <div className="text-xs text-slate-400 font-mono tracking-wider flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <span>WASD / Arrow Keys Move</span>
        <span>·</span>
        <span>Click Tiles to Inspect & Hop</span>
        <span>·</span>
        <span>Drag to Pan</span>
        <span>·</span>
        <span>Scroll to Zoom</span>
        <span>·</span>
        <span>Press Enter to Start</span>
      </div>
    </div>
  );
};
