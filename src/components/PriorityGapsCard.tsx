import React, { useState } from 'react';
import { Flame, ShieldAlert, Sparkles, Filter, Briefcase } from 'lucide-react';
import { EvaluatedSkill, PriorityLevel } from '../../shared/types.ts';

interface PriorityGapsCardProps {
  prioritizedGaps: EvaluatedSkill[];
}

export const PriorityGapsCard: React.FC<PriorityGapsCardProps> = ({ prioritizedGaps }) => {
  const [filterPriority, setFilterPriority] = useState<string>('ALL');

  const filtered = prioritizedGaps.filter((s) => {
    if (filterPriority === 'ALL') return true;
    return s.priority === filterPriority;
  });

  const getPriorityStyle = (priority: PriorityLevel) => {
    switch (priority) {
      case 'HIGH':
        return {
          border: 'border-rose-900/60',
          bg: 'bg-rose-950/20',
          badge: 'bg-rose-950/80 text-rose-300 border-rose-800/80',
          iconColor: 'text-rose-400',
        };
      case 'MEDIUM':
        return {
          border: 'border-amber-900/60',
          bg: 'bg-amber-950/20',
          badge: 'bg-amber-950/80 text-amber-300 border-amber-800/80',
          iconColor: 'text-amber-400',
        };
      case 'LOW':
        return {
          border: 'border-blue-900/60',
          bg: 'bg-blue-950/20',
          badge: 'bg-blue-950/80 text-blue-300 border-blue-800/80',
          iconColor: 'text-blue-400',
        };
    }
  };

  return (
    <div id="priority-skill-gaps-section" className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-400" />
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">Priority Skill Gaps</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Ranked using <span className="font-mono text-cyan-300">priorityScore = 0.5×gap + 0.3×importance + 0.2×jobRelevance</span>
          </p>
        </div>

        {/* Priority Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 self-start sm:self-auto">
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
            <button
              key={p}
              id={`filter-priority-${p.toLowerCase()}`}
              type="button"
              onClick={() => setFilterPriority(p)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterPriority === p
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl bg-slate-950/30">
          <p className="text-xs text-slate-400">No skill gaps match the current filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((skill, idx) => {
            const style = getPriorityStyle(skill.priority);

            return (
              <div
                key={idx}
                id={`priority-gap-card-${idx}`}
                className={`p-4 rounded-xl border ${style.border} ${style.bg} transition-all hover:scale-101 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-sm font-bold text-white block">{skill.skillName}</span>
                      <span className="text-[11px] text-slate-400">{skill.category}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {skill.jobRelevance > 0.5 && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950/90 text-purple-300 border border-purple-800/60" title="Explicitly mentioned in target job description">
                          <Briefcase className="w-3 h-3 text-purple-400" />
                          <span>In JD</span>
                        </span>
                      )}
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${style.badge}`}>
                        {skill.priority}
                      </span>
                    </div>
                  </div>

                  {/* Metrics bar */}
                  <div className="grid grid-cols-3 gap-2 py-2 my-2 bg-slate-950/60 rounded-lg px-3 border border-slate-800/60 text-center">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Gap</span>
                      <span className="text-xs font-mono font-bold text-white">{Math.round(skill.gap * 100)}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Importance</span>
                      <span className="text-xs font-mono font-bold text-cyan-300">{Math.round(skill.importance * 100)}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Priority Pts</span>
                      <span className="text-xs font-mono font-bold text-purple-300">{skill.priorityScore}</span>
                    </div>
                  </div>

                  {/* Reason Text */}
                  <p className="text-xs text-slate-300 leading-relaxed mt-2">
                    <span className="text-slate-400 font-semibold">Impact: </span>
                    {skill.reason}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
