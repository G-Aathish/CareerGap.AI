import React from 'react';
import { BarChart3 } from 'lucide-react';
import { EvaluatedSkill } from '../../shared/types.ts';

interface SkillComparisonChartProps {
  skills: EvaluatedSkill[];
}

export const SkillComparisonChart: React.FC<SkillComparisonChartProps> = ({ skills }) => {
  return (
    <div id="skill-visualization-section" className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Skill Benchmark Comparison</h2>
            <p className="text-xs text-slate-400">Side-by-side evaluation of your current proficiency vs career target standard</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-cyan-400"></div>
            <span className="text-slate-300">Your Current Level</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-slate-600"></div>
            <span className="text-slate-400">Target Required Level</span>
          </div>
        </div>
      </div>

      {/* Bars List */}
      <div className="space-y-4">
        {skills.map((s, idx) => {
          const currentPct = Math.round(s.currentLevel * 100);
          const requiredPct = Math.round(s.requiredLevel * 100);

          return (
            <div key={idx} id={`skill-chart-row-${idx}`} className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{s.skillName}</span>
                  <span className="text-[11px] text-slate-400">({s.category})</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-cyan-400 font-bold">{currentPct}% Current</span>
                  <span className="text-slate-500">/</span>
                  <span className="text-slate-300">{requiredPct}% Target</span>
                </div>
              </div>

              {/* Stacked comparison bar */}
              <div className="relative w-full h-3.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                {/* Required Target Background Marker */}
                <div
                  className="absolute top-0 bottom-0 left-0 bg-slate-700/60 rounded-full"
                  style={{ width: `${requiredPct}%` }}
                />
                {/* Current Actual Level */}
                <div
                  className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(currentPct, 100)}%` }}
                />
              </div>

              {/* Difference Status */}
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-1">
                <span>Importance: {Math.round(s.importance * 100)}%</span>
                <span className={s.gap === 0 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                  {s.gap === 0 ? '✓ Requirement Met' : `Gap: -${Math.round(s.gap * 100)}% to target`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
