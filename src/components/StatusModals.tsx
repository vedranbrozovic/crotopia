import React from 'react';
import { PlayerState } from '../game/types';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({ onResume, onRestart }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-none select-none">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100 text-center space-y-5">
        <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-xl text-amber-400">
          ⏸️
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-black text-white">Journey Paused</h2>
          <p className="text-xs text-slate-400">Take a breath in the Croatian countryside</p>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={onResume}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            Resume Exploring
          </button>
          <button
            onClick={onRestart}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors cursor-pointer"
          >
            Restart Odyssey
          </button>
        </div>

        <div className="pt-2 text-[11px] text-slate-500 font-mono">
          Press [Esc] or [P] to Resume
        </div>
      </div>
    </div>
  );
};

interface VictoryModalProps {
  playerState: PlayerState;
  onContinue: () => void;
  onRestart: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  playerState,
  onContinue,
  onRestart,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-none select-none">
      <div className="w-full max-w-md bg-slate-900 border border-amber-500/50 rounded-2xl shadow-2xl p-6 text-slate-100 text-center space-y-5 relative">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-3xl shadow-inner">
          🏆
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">
            Grand Tour Complete
          </span>
          <h2 className="text-2xl font-black text-white">
            Master Explorer of Croatia!
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
            You have journeyed across all four biomes and uncovered the 14 iconic cultural, historical, and natural wonders of Croatia.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
          <div>
            <div className="text-base font-black font-mono text-emerald-400 tabular-nums">
              14 / 14
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-sans">Wonders</div>
          </div>
          <div>
            <div className="text-base font-black font-mono text-amber-400 tabular-nums">
              {playerState.stars}
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-sans">Stars</div>
          </div>
          <div>
            <div className="text-base font-black font-mono text-sky-400 tabular-nums">
              {playerState.revealedTiles.size}
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-sans">Tiles Fog-Free</div>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={onContinue}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            Keep Roaming Croatia
          </button>
          <button
            onClick={onRestart}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors cursor-pointer"
          >
            Start New Odyssey
          </button>
        </div>
      </div>
    </div>
  );
};
