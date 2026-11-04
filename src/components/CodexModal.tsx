import React, { useState } from 'react';
import { BiomeId, LandmarkData } from '../game/types';
import { BIOMES, LANDMARKS } from '../game/mapData';

interface CodexModalProps {
  discoveredLandmarks: Set<string>;
  onClose: () => void;
  onSelectLandmark: (landmark: LandmarkData) => void;
}

export const CodexModal: React.FC<CodexModalProps> = ({
  discoveredLandmarks,
  onClose,
  onSelectLandmark,
}) => {
  const [activeBiome, setActiveBiome] = useState<BiomeId>('slavonia');

  const biomeList: BiomeId[] = ['slavonia', 'zagorje', 'lika', 'dalmatia'];
  const allLandmarksList = Object.values(LANDMARKS);
  const currentBiomeLandmarks = allLandmarksList.filter(lm => lm.biome === activeBiome);

  const totalDiscovered = discoveredLandmarks.size;
  const totalCount = allLandmarksList.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-none select-none">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100 flex flex-col max-h-[85vh] relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span>📖</span>
              <span>Croatian Biome Codex</span>
            </h2>
            <p className="text-xs text-slate-400">
              Grand Tour Progress: <span className="font-bold text-amber-300 font-mono">{totalDiscovered} / {totalCount}</span> Wonders Explored
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Codex"
          >
            ✕
          </button>
        </div>

        {/* Biome Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 pb-3">
          {biomeList.map(bId => {
            const b = BIOMES[bId];
            const isSelected = activeBiome === bId;
            const biomeLms = allLandmarksList.filter(l => l.biome === bId);
            const foundCount = biomeLms.filter(l => discoveredLandmarks.has(l.id)).length;

            return (
              <button
                key={bId}
                onClick={() => setActiveBiome(bId)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800 border-amber-400 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: b.colors.primary }}
                  />
                  <span className="text-[10px] font-mono text-slate-400">
                    {foundCount}/{biomeLms.length}
                  </span>
                </div>
                <div className="text-xs font-bold truncate">{b.name.split('&')[0]}</div>
              </button>
            );
          })}
        </div>

        {/* Biome Description Banner */}
        <div className="mb-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="text-xs font-bold text-amber-300 mb-0.5">
            {BIOMES[activeBiome].name}
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {BIOMES[activeBiome].description}
          </p>
        </div>

        {/* Landmarks in Selected Biome */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {currentBiomeLandmarks.map(lm => {
            const isFound = discoveredLandmarks.has(lm.id);

            if (!isFound) {
              return (
                <div
                  key={lm.id}
                  className="p-4 rounded-xl bg-slate-950/40 border border-dashed border-slate-800 flex items-center justify-between text-slate-500"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xl">
                      ❓
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-400">Undiscovered Wonder</div>
                      <div className="text-[11px] text-slate-500">
                        Explore near ({lm.gridX}, {lm.gridZ}) in {BIOMES[lm.biome].name.split('&')[0]}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2 py-1 rounded bg-slate-900 text-slate-500">
                    Fogged
                  </span>
                </div>
              );
            }

            return (
              <div
                key={lm.id}
                className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 hover:border-amber-400/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl shadow-inner">
                      {lm.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{lm.name}</h3>
                      <p className="text-[11px] text-amber-300/80">{lm.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onSelectLandmark(lm);
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-bold transition-colors cursor-pointer shrink-0"
                  >
                    View on Map
                  </button>
                </div>

                {/* Snappy Highlighted Lore Note */}
                <div className="mb-2 p-2.5 rounded-lg bg-amber-500/10 border-l-2 border-amber-400 text-amber-100 text-xs leading-relaxed">
                  &ldquo;{lm.loreNote}&rdquo;
                </div>

                {/* Gameplay Buff info */}
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span>{lm.gameBuff.title}</span>
                  <span className="font-mono text-emerald-400 font-bold">{lm.gameBuff.stat}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
