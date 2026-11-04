import React from 'react';
import { PlayerState, TileData } from '../game/types';
import { GRID_WIDTH, GRID_HEIGHT, getTileKey } from '../game/mapData';

interface HUDProps {
  playerState: PlayerState;
  totalLandmarks: number;
  tiles: TileData[];
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenCodex: () => void;
  onRecenterPlayer: () => void;
  onPause: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  playerState,
  totalLandmarks,
  tiles,
  isMuted,
  onToggleMute,
  onOpenCodex,
  onRecenterPlayer,
  onPause,
}) => {
  const discoveredCount = playerState.discoveredLandmarks.size;
  const explorationPercent = Math.round((playerState.revealedTiles.size / (GRID_WIDTH * GRID_HEIGHT)) * 100);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none flex flex-col justify-between p-4">
      {/* Top Status Bar & Controls */}
      <div className="w-full flex items-start justify-between gap-4">
        {/* Left Status Cluster */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          {/* Stars / Currency Readout */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-lg text-amber-300 font-bold text-sm">
            <span>⭐</span>
            <span className="font-mono tabular-nums text-white">{playerState.stars}</span>
            <span className="text-[10px] text-amber-400/80 font-sans uppercase tracking-wider">Stars</span>
          </div>

          {/* Landmarks Discovered */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-lg text-emerald-400 font-bold text-sm">
            <span>🏛️</span>
            <span className="font-mono tabular-nums text-white">{discoveredCount}</span>
            <span className="text-slate-400 font-mono text-xs">/ {totalLandmarks}</span>
            <span className="text-[10px] text-emerald-300/80 font-sans uppercase tracking-wider hidden sm:inline">Wonders</span>
          </div>

          {/* Exploration Percentage */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-lg text-sky-400 font-bold text-sm">
            <span>🧭</span>
            <span className="font-mono tabular-nums text-white">{explorationPercent}%</span>
            <span className="text-[10px] text-sky-300/80 font-sans uppercase tracking-wider hidden sm:inline">Explored</span>
          </div>

          {/* Movement Range Status */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-lg text-xs font-semibold ${
            playerState.isMounted 
              ? 'bg-amber-950/80 border-amber-600/70 text-amber-200' 
              : 'bg-slate-900/90 border-slate-700/80 text-slate-300'
          }`}>
            <span>{playerState.isMounted ? '🐎' : '🚶'}</span>
            <span>{playerState.moveRange} Tiles Range</span>
          </div>
        </div>

        {/* Right Action Icons Cluster */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Croatian Codex Button */}
          <button
            onClick={onOpenCodex}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs shadow-lg active:scale-95 transition-all cursor-pointer"
            title="Open Croatian Codex"
            aria-label="Open Codex"
          >
            <span>📖</span>
            <span className="hidden sm:inline">Codex</span>
            <span className="px-1.5 py-0.2 rounded-full bg-red-600/80 text-[10px] text-white font-mono">
              {discoveredCount}/{totalLandmarks}
            </span>
          </button>

          {/* Recenter Camera */}
          <button
            onClick={onRecenterPlayer}
            className="w-9 h-9 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center text-sm shadow-lg active:scale-95 transition-all cursor-pointer"
            title="Recenter on Explorer"
            aria-label="Recenter Camera"
          >
            📍
          </button>

          {/* Mute Audio */}
          <button
            onClick={onToggleMute}
            className="w-9 h-9 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center text-sm shadow-lg active:scale-95 transition-all cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          {/* Pause */}
          <button
            onClick={onPause}
            className="w-9 h-9 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center text-sm shadow-lg active:scale-95 transition-all cursor-pointer"
            title="Pause Game [Esc / P]"
            aria-label="Pause Game"
          >
            ⏸️
          </button>
        </div>
      </div>

      {/* Bottom Row: Corner Minimap */}
      <div className="w-full flex items-end justify-between pointer-events-none">
        {/* Navigation Key Hint */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400 pointer-events-auto">
          <span>WASD / Arrows Hop</span>
          <span>·</span>
          <span>Click to Inspect</span>
        </div>

        {/* Minimalist Croatia Crescent Minimap */}
        <div className="pointer-events-auto p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-2xl">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-1">
            Hrvatska Minimap
          </div>
          <div
            className="grid gap-[1.5px] bg-slate-950 p-1.5 rounded-lg"
            style={{
              gridTemplateColumns: `repeat(${GRID_WIDTH}, minmax(0, 1fr))`,
              width: '140px',
              height: '130px',
            }}
          >
            {tiles.map(tile => {
              const isPlayer = tile.x === playerState.x && tile.z === playerState.z;
              const isRevealed = playerState.revealedTiles.has(getTileKey(tile.x, tile.z));

              let bg = '#121820'; // unrevealed / dark void
              if (isPlayer) {
                bg = '#ef4444'; // Bright Red player dot
              } else if (isRevealed) {
                if (tile.landmarkId) {
                  bg = '#fbbf24'; // Gold landmark
                } else if (tile.isLand) {
                  bg = tile.biome === 'slavonia' ? '#d97706' : tile.biome === 'zagorje' ? '#22c55e' : tile.biome === 'lika' ? '#06b6d4' : '#f59e0b';
                } else {
                  bg = '#1e3a5f'; // water
                }
              }

              return (
                <div
                  key={`${tile.x},${tile.z}`}
                  style={{ backgroundColor: bg }}
                  className={`w-full h-full rounded-[0.5px] ${isPlayer ? 'ring-1 ring-white animate-pulse' : ''}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
