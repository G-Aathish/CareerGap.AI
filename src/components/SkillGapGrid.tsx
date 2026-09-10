import React from 'react';
import { Check, CircleDot, Circle, Award, AlertCircle, ArrowUpRight } from 'lucide-react';
import { EvaluatedSkill } from '../../shared/types.ts';

interface SkillGapGridProps {
  matchedSkills: EvaluatedSkill[];
  partialSkills: EvaluatedSkill[];
  missingSkills: EvaluatedSkill[];
}

export const SkillGapGrid: React.FC<SkillGapGridProps> = ({
  matchedSkills,
  partialSkills,
  missingSkills,
}) => {
  return (
    <div id="skill-gap-section" className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">Your Skill Gap</h2>
          <p className="text-xs text-slate-400">Classified by mathematical gap between student proficiency and career requirement</p>
        </div>
        <span className="text-xs font-mono text-cyan-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          3-Tier Classification
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* MATCHED COLUMN */}
        <div className="bg-slate-900/70 backdrop-blur-md border border-emerald-900/40 rounded-2xl p-5 shadow-xl flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-900/30">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <h3 className="font-extrabold text-sm text-emerald-300 tracking-wide">
                MATCHED ({matchedSkills.length})
              </h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">Gap = 0</span>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-96 pr-1">
            {matchedSkills.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">No fully matched skills yet.</p>
            ) : (
              matchedSkills.map((s, idx) => (
                <div
                  key={idx}
                  id={`matched-skill-${idx}`}
                  className="p-3 rounded-xl bg-slate-950/60 border border-emerald-950/80 hover:border-emerald-700/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 text-xs">
                        ✓
                      </div>
                      <span className="text-sm font-bold text-white">{s.skillName}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                      {Math.round(s.currentLevel * 100)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>{s.category}</span>
                    <span className="text-emerald-400/90 font-medium">Ready</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PARTIAL COLUMN */}
        <div className="bg-slate-900/70 backdrop-blur-md border border-amber-900/40 rounded-2xl p-5 shadow-xl flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-amber-900/30">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <h3 className="font-extrabold text-sm text-amber-300 tracking-wide">
                PARTIAL ({partialSkills.length})
              </h3>
            </div>
            <span className="text-[11px] font-mono text-amber-400">Gap &gt; 0</span>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-96 pr-1">
            {partialSkills.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">No partial skills identified.</p>
            ) : (
              partialSkills.map((s, idx) => (
                <div
                  key={idx}
                  id={`partial-skill-${idx}`}
                  className="p-3 rounded-xl bg-slate-950/60 border border-amber-950/80 hover:border-amber-700/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-amber-950 border border-amber-700/60 flex items-center justify-center text-amber-400 text-xs">
                        ◐
                      </div>
                      <span className="text-sm font-bold text-white">{s.skillName}</span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
                      Gap: {Math.round(s.gap * 100)}%
                    </span>
                  </div>

                  {/* Visual mini bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden my-1.5">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all"
                      style={{ width: `${(s.currentLevel / s.requiredLevel) * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{s.category}</span>
                    <span>
                      {Math.round(s.currentLevel * 100)}% of {Math.round(s.requiredLevel * 100)}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* MISSING COLUMN */}
        <div className="bg-slate-900/70 backdrop-blur-md border border-rose-900/40 rounded-2xl p-5 shadow-xl flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-rose-900/30">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
              <h3 className="font-extrabold text-sm text-rose-300 tracking-wide">
                MISSING ({missingSkills.length})
              </h3>
            </div>
            <span className="text-[11px] font-mono text-rose-400">Level = 0</span>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-96 pr-1">
            {missingSkills.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">No missing skills! Fully job ready.</p>
            ) : (
              missingSkills.map((s, idx) => (
                <div
                  key={idx}
                  id={`missing-skill-${idx}`}
                  className="p-3 rounded-xl bg-slate-950/60 border border-rose-950/80 hover:border-rose-700/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-rose-950 border border-rose-700/60 flex items-center justify-center text-rose-400 text-xs">
                        ○
                      </div>
                      <span className="text-sm font-bold text-white">{s.skillName}</span>
                    </div>
                    <span className="text-[10px] font-mono text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/60">
                      Req: {Math.round(s.requiredLevel * 100)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>{s.category}</span>
                    <span className="text-rose-400 font-mono text-[10px]">
                      {s.priority} Priority
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
