import React from 'react';
import { X, Sparkles, Trophy, Target, ArrowRight, CheckCircle2, AlertTriangle, XCircle, Compass } from 'lucide-react';
import { AnalysisResult } from '../../shared/types.ts';

interface PresentationModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AnalysisResult | null;
}

export const PresentationModeModal: React.FC<PresentationModeModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-950 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
        {/* Close Button */}
        <button
          id="close-presentation-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Presentation Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-mono font-bold text-lg">
              CG
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  CAREERGAP AI
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                  HACKNOVA'26 PS-07
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Personalized Skill Gap Intelligence for Career Readiness • Executive Summary
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800/60 self-start sm:self-auto">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span>Problem Statement: PS-07</span>
          </div>
        </div>

        {/* Content Body */}
        {!result ? (
          <div className="py-12 text-center text-slate-400">
            <p className="text-sm">Please analyze a profile or click "Load Demo" on the main dashboard to view the evaluation slide.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top row: Target & Score */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  1. Target Trajectory
                </span>
                <span className="text-lg font-bold text-white block">{result.career}</span>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{result.careerDescription}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    2. Readiness Score
                  </span>
                  <span className="text-3xl font-extrabold font-mono text-cyan-400">
                    {result.readinessScore}%
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Audited Alignment</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
                  <Target className="w-6 h-6" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  3. Gap Breakdown
                </span>
                <div className="grid grid-cols-3 gap-2 mt-2 text-center text-xs">
                  <div className="p-1.5 rounded bg-emerald-950/60 border border-emerald-900/60">
                    <span className="text-emerald-400 font-bold block text-sm">{result.scoreBreakdown.matchedCount}</span>
                    <span className="text-[10px] text-slate-400">Matched</span>
                  </div>
                  <div className="p-1.5 rounded bg-amber-950/60 border border-amber-900/60">
                    <span className="text-amber-400 font-bold block text-sm">{result.scoreBreakdown.partialCount}</span>
                    <span className="text-[10px] text-slate-400">Partial</span>
                  </div>
                  <div className="p-1.5 rounded bg-rose-950/60 border border-rose-900/60">
                    <span className="text-rose-400 font-bold block text-sm">{result.scoreBreakdown.missingCount}</span>
                    <span className="text-[10px] text-slate-400">Gaps</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Row: Priority Gaps & Transferable Graph */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2 text-rose-400">
                  Top Priority Skill Gaps
                </span>
                <div className="space-y-2">
                  {result.prioritizedGaps.slice(0, 3).map((g, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white">{g.skillName}</span>
                        <span className="text-[11px] text-slate-400 block">{g.reason}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800 shrink-0">
                        {g.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2 text-purple-400">
                  Transferable Skill Chain
                </span>
                {result.transferableChains.slice(0, 2).map((chain, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 mb-2">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-cyan-300 mb-1 overflow-x-auto">
                      {chain.bridgeSteps.map((s, sIdx) => (
                        <React.Fragment key={sIdx}>
                          <span className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800 whitespace-nowrap">{s}</span>
                          {sIdx < chain.bridgeSteps.length - 1 && <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />}
                        </React.Fragment>
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{chain.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Row: 6-Week Roadmap Highlights */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider block mb-3 text-emerald-400 flex items-center gap-1.5">
                <Compass className="w-4 h-4" /> 6-Week Customized Roadmap Timeline
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
                {result.roadmap.map((w) => (
                  <div key={w.week} className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-left">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 block">Week {w.week}</span>
                    <span className="font-semibold text-white block truncate">{w.focusSkill}</span>
                    <span className="text-[10px] text-slate-400 block mt-1 line-clamp-1">{w.milestone}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture Footer Note */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Deterministic scoring logic: 0.5×gap + 0.3×importance + 0.2×jobRelevance</span>
              <span className="font-mono text-cyan-400">SDG 4 • SDG 8 • SDG 10</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
