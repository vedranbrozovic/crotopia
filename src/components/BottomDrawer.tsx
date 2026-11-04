import React from 'react';
import { TileData, LandmarkData } from '../game/types';
import { BIOMES } from '../game/mapData';

interface BottomDrawerProps {
  selectedTile: TileData | null;
  selectedLandmark: LandmarkData | null;
  playerPos: { x: number; z: number };
  isReachable: boolean;
  onMoveHere: (x: number, z: number) => void;
  onInteractLandmark: (landmark: LandmarkData) => void;
  onFocusCamera: (x: number, z: number) => void;
  onClose: () => void;
}

export const BottomDrawer: React.FC<BottomDrawerProps> = ({
  selectedTile,
  selectedLandmark,
  playerPos,
  isReachable,
  onMoveHere,
  onInteractLandmark,
  onFocusCamera,
  onClose,
}) => {
  if (!selectedTile) return null;

  const biomeInfo = BIOMES[selectedTile.biome];
  const isPlayerHere = playerPos.x === selectedTile.x && playerPos.z === selectedTile.z;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-4 pointer-events-auto transition-transform duration-300">
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl p-5 text-slate-100 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close details"
        >
          ✕
        </button>

        {/* Biome Badge & Coordinates */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className="w-2.5 h-2.5 rounded-full ring-2 ring-white/20"
            style={{ backgroundColor: biomeInfo.colors.primary }}
          />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {biomeInfo.name}
          </span>
          <span className="text-xs text-slate-500 font-mono">
            ({selectedTile.x}, {selectedTile.z})
          </span>
        </div>

        {/* Title & Icon Header */}
        <div className="flex items-start gap-3.5 mb-3">
          <div className="w-12 h-12 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center text-2xl shrink-0 shadow-inner">
            {selectedLandmark ? selectedLandmark.icon : selectedTile.isLand ? '🌿' : '🌊'}
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              {selectedLandmark ? selectedLandmark.name : `${selectedTile.type.replace('_', ' ')} Tile`}
              {isPlayerHere && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Explorer Here
                </span>
              )}
            </h2>
            <p className="text-xs font-medium text-amber-300/80">
              {selectedLandmark ? selectedLandmark.title : `Terrain Elevation: ${(selectedTile.height * 100).toFixed(0)}m`}
            </p>
          </div>
        </div>

        {/* Highlighted Lore Note (The exact requested snappy encyclopedia blurb) */}
        {selectedLandmark && (
          <div className="mb-3.5 p-3 rounded-xl bg-amber-500/10 border-l-4 border-amber-400 text-amber-100 text-xs leading-relaxed font-sans shadow-sm">
            <span className="font-bold text-amber-300 uppercase tracking-wider block text-[10px] mb-1">
              Highlighted Lore Note
            </span>
            &ldquo;{selectedLandmark.loreNote}&rdquo;
          </div>
        )}

        {/* Gameplay Buff Card */}
        {selectedLandmark?.gameBuff && (
          <div className="mb-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white block">
                {selectedLandmark.gameBuff.title}
              </span>
              <p className="text-[11px] text-slate-300 leading-snug">
                {selectedLandmark.gameBuff.description}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <span className="inline-block text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                {selectedLandmark.gameBuff.stat}
              </span>
            </div>
          </div>
        )}

        {/* Natural Tile Description when not a landmark */}
        {!selectedLandmark && (
          <div className="mb-4 text-xs text-slate-300 leading-relaxed">
            {selectedTile.isLand
              ? `Part of the ${biomeInfo.name}. Rich regional terrain characterized by ${biomeInfo.paletteName}.`
              : 'The pristine turquoise waters of the Adriatic Sea, flowing along the Croatian coastline.'}
          </div>
        )}

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
          {!isPlayerHere && selectedTile.type !== 'deep_water' && (
            <button
              onClick={() => onMoveHere(selectedTile.x, selectedTile.z)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isReachable
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>{isReachable ? '⚡ Hop Here (In Range)' : '🚶 Walk Toward'}</span>
            </button>
          )}

          {selectedLandmark && (
            <button
              onClick={() => onInteractLandmark(selectedLandmark)}
              className="flex-1 py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <span>{selectedLandmark.actionLabel || 'Commune / Interact'}</span>
            </button>
          )}

          <button
            onClick={() => onFocusCamera(selectedTile.x, selectedTile.z)}
            className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            title="Focus camera"
          >
            🎯 Recenter
          </button>
        </div>
      </div>
    </div>
  );
};
