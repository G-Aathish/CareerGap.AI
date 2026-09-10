import React from 'react';
import { Target, Heart, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-900">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                <Target className="w-4 h-4" />
              </div>
              <span className="font-mono font-bold text-lg text-white">
                CAREERGAP<span className="text-cyan-400">.AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Personalized Skill Gap Intelligence for Career Readiness. Closing the divide between academic curricula and production industry requirements through deterministic mathematics and contextual AI.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-slate-900 border border-slate-800 text-slate-300">
                React 18
              </span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-slate-900 border border-slate-800 text-slate-300">
                Express + SQLite WASM
              </span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-slate-900 border border-slate-800 text-cyan-400">
                Gemini 3.8 Flash
              </span>
            </div>
          </div>

          {/* Col 2: Hackathon Details */}
          <div>
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-3 font-mono">
              Hackathon Context
            </span>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="text-amber-400">Event:</span>
                <span className="text-white font-medium">HACKNOVA’26</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-cyan-400">Statement:</span>
                <span className="text-white font-medium">PS-07</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-purple-400">Domain:</span>
                <span className="text-white font-medium">Education & Learning</span>
              </li>
              <li className="pt-2 text-[11px] text-slate-500">
                Prototype verified with reproducible calculations & demo modes.
              </li>
            </ul>
          </div>

          {/* Col 3: SDG Goals */}
          <div>
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-3 font-mono">
              SDG Impact Alignment
            </span>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-rose-950 border border-rose-800 text-rose-300 font-mono text-[10px] flex items-center justify-center font-bold">
                  4
                </span>
                <span className="text-slate-300 font-medium">SDG 4: Quality Education</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-amber-950 border border-amber-800 text-amber-300 font-mono text-[10px] flex items-center justify-center font-bold">
                  8
                </span>
                <span className="text-slate-300 font-medium">SDG 8: Decent Work & Growth</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-purple-950 border border-purple-800 text-purple-300 font-mono text-[10px] flex items-center justify-center font-bold">
                  10
                </span>
                <span className="text-slate-300 font-medium">SDG 10: Reduced Inequalities</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 CareerGap AI • Built for HACKNOVA’26</p>
          <p className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Auditable Deterministic Calculations • Safe AI Augmentation</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
