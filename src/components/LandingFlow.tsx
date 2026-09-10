import React from 'react';
import { ArrowRight, UserCheck, Cpu, Briefcase, SplitSquareVertical, Compass, Sparkles } from 'lucide-react';

interface LandingFlowProps {
  onLoadDemo: () => void;
}

export const LandingFlow: React.FC<LandingFlowProps> = ({ onLoadDemo }) => {
  const flowSteps = [
    {
      title: 'Current Skills',
      subtitle: 'Your verified proficiencies',
      icon: UserCheck,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-950/60 border-cyan-800/60',
    },
    {
      title: 'AI Skill Intelligence',
      subtitle: 'Normalization & semantics',
      icon: Cpu,
      color: 'text-purple-400',
      bgColor: 'bg-purple-950/60 border-purple-800/60',
    },
    {
      title: 'Career Benchmarks',
      subtitle: 'Target role requirements',
      icon: Briefcase,
      color: 'text-blue-400',
      bgColor: 'bg-blue-950/60 border-blue-800/60',
    },
    {
      title: 'Skill Gap & Priority',
      subtitle: 'Deterministic audit',
      icon: SplitSquareVertical,
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/60 border-amber-800/60',
    },
    {
      title: 'Personalized Roadmap',
      subtitle: '6-week action plan',
      icon: Compass,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/60 border-emerald-800/60',
    },
  ];

  return (
    <div id="landing-empty-state" className="my-10 p-8 rounded-3xl bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-slate-800 shadow-2xl text-center">
      <div className="max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/50 mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Start Your Evaluation
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Discover Your Career Gap
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Tell us where you want to go and what you already know. CareerGap AI will identify the skills you need next.
        </p>
      </div>

      {/* Visual Flow Diagram */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 max-w-5xl mx-auto mb-8">
        {flowSteps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="relative flex flex-col items-center">
              <div className={`w-full p-4 rounded-2xl border ${step.bgColor} backdrop-blur-sm transition-all hover:scale-102 flex flex-col items-center justify-center min-h-[120px]`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 bg-slate-950/80 border border-slate-800`}>
                  <Icon className={`w-5 h-5 ${step.color}`} />
                </div>
                <h3 className="text-xs font-bold text-white tracking-wide">{step.title}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{step.subtitle}</p>
              </div>

              {idx < flowSteps.length - 1 && (
                <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Demo CTA */}
      <div className="inline-flex flex-col sm:flex-row items-center gap-3 p-2 bg-slate-900/90 border border-slate-800 rounded-2xl">
        <span className="text-xs text-slate-300 px-3">
          Want to see a live demonstration immediately?
        </span>
        <button
          id="landing-load-demo-btn"
          onClick={onLoadDemo}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-900 cursor-pointer"
        >
          Load Demo Example (Java Developer)
        </button>
      </div>
    </div>
  );
};
