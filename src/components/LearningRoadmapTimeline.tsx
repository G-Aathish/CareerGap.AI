import React, { useState } from 'react';
import { Compass, Calendar, CheckSquare, Trophy, Clock, BookOpen, ChevronRight } from 'lucide-react';
import { RoadmapWeek } from '../../shared/types.ts';

interface LearningRoadmapTimelineProps {
  roadmap: RoadmapWeek[];
  career: string;
}

export const LearningRoadmapTimeline: React.FC<LearningRoadmapTimelineProps> = ({ roadmap, career }) => {
  const [activeWeek, setActiveWeek] = useState<number>(1);

  return (
    <div id="roadmap-section" className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Personalized 6-Week Learning Roadmap</h2>
            <p className="text-xs text-slate-400">Targeted weekly milestones customized to your priority gaps for {career}</p>
          </div>
        </div>

        <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-800/40 self-start sm:self-auto">
          6-Week Action Plan
        </span>
      </div>

      {/* Week Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        {roadmap.map((w) => (
          <button
            key={w.week}
            id={`week-tab-${w.week}`}
            type="button"
            onClick={() => setActiveWeek(w.week)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeWeek === w.week
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Week {w.week}</span>
          </button>
        ))}
      </div>

      {/* Active Week Focus Card */}
      {(() => {
        const currentWeek = roadmap.find((w) => w.week === activeWeek) || roadmap[0];
        if (!currentWeek) return null;

        return (
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-emerald-900/50 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800/80">
              <div>
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-400">
                  Sprint Milestone
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                  {currentWeek.title}
                </h3>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-auto">
                <span className="flex items-center gap-1.5 text-xs font-mono text-cyan-300 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  ~{currentWeek.estimatedHours} hrs / week
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              {/* Objective & Goal */}
              <div className="space-y-4">
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 font-bold text-white mb-1.5">
                    <Compass className="w-4 h-4 text-emerald-400" />
                    <span>Weekly Learning Goal</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{currentWeek.goal}</p>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 font-bold text-white mb-1.5">
                    <CheckSquare className="w-4 h-4 text-cyan-400" />
                    <span>Hands-On Implementation Task</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{currentWeek.task}</p>
                </div>
              </div>

              {/* Milestone & Resources */}
              <div className="space-y-4">
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 font-bold text-amber-300 mb-1.5">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Verification Milestone</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{currentWeek.milestone}</p>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 font-bold text-purple-300 mb-1.5">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <span>Recommended Curated Resource</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{currentWeek.resourceSuggestion}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Mini timeline overview */}
      <div className="mt-6 pt-5 border-t border-slate-800/80">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
          Roadmap Sequence Overview
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {roadmap.map((w) => (
            <button
              key={w.week}
              onClick={() => setActiveWeek(w.week)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                activeWeek === w.week
                  ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <span className="text-[10px] font-mono text-emerald-400 block font-bold">W{w.week}</span>
              <span className="text-xs font-semibold text-white truncate block">{w.focusSkill}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
