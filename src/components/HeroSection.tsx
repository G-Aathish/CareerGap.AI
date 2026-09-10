import React from 'react';
import { ArrowRight, Sparkles, Cpu, Binary, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onAnalyze: () => void;
  onLoadDemo: () => void;
  isLoading: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onAnalyze,
  onLoadDemo,
  isLoading,
}) => {
  return (
    <section className="relative pt-10 pb-8 sm:pt-14 sm:pb-12 overflow-hidden">
      {/* Ambient background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto text-center px-4 sm:px-6">
        {/* Hackathon Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/70 border border-cyan-700/50 text-cyan-300 mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span>HACKNOVA’26 • Problem Statement: PS-07 • Education & Learning</span>
        </div>

        {/* Large Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-4">
          Know Your Goal.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
            Know Your Gap.
          </span>
          <br />
          Know Your Next Step.
        </h1>

        {/* Subtitle & Short Explanation */}
        <p className="text-lg sm:text-xl font-medium text-cyan-200/90 mb-3 max-w-2xl mx-auto">
          AI-powered personalized skill intelligence for career readiness.
        </p>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
          CareerGap AI compares your current skills with your target career requirements and creates a personalized path to career readiness.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <button
            id="hero-analyze-btn"
            onClick={onAnalyze}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing Career Readiness...</span>
              </>
            ) : (
              <>
                <span>Analyze My Skill Gap</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            id="hero-demo-btn"
            onClick={onLoadDemo}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-slate-200 hover:text-white transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Load Demo (Java Developer)</span>
          </button>
        </div>

        {/* Core Differentiator Box */}
        <div className="max-w-3xl mx-auto bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                “AI where it helps. Algorithms where accuracy matters.”
              </h2>
            </div>
            <span className="text-xs font-mono text-cyan-400">Production Hybrid Architecture</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 text-xs text-slate-300">
            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
              <div className="flex items-center gap-1.5 font-bold text-cyan-300 mb-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Google Gemini AI</span>
              </div>
              <ul className="space-y-1 text-slate-400">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                  Resume & Job Description Semantic Parsing
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                  Skill Normalization & Taxonomy Alignment
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                  Personalized 1-on-1 AI Career Coach
                </li>
              </ul>
            </div>

            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
              <div className="flex items-center gap-1.5 font-bold text-purple-300 mb-1.5">
                <Binary className="w-4 h-4 text-purple-400" />
                <span>Deterministic Math & SQLite</span>
              </div>
              <ul className="space-y-1 text-slate-400">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-purple-400" />
                  Mathematically Auditable Readiness Score (0-100%)
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-purple-400" />
                  Deterministic Gap Classification (Matched, Partial, Missing)
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-purple-400" />
                  Formulaic Weighted Priority Metric (Gap + Importance + JD)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
