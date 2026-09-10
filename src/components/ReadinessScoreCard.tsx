import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Flame, Info, HelpCircle } from 'lucide-react';
import { AnalysisResult } from '../../shared/types.ts';

interface ReadinessScoreCardProps {
  result: AnalysisResult;
}

export const ReadinessScoreCard: React.FC<ReadinessScoreCardProps> = ({ result }) => {
  const [showFormulaInfo, setShowFormulaInfo] = useState(false);

  const { readinessScore, career, isDemo, scoreBreakdown } = result;

  // SVG circular gauge calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (readinessScore / 100) * circumference;

  // Color dynamic based on score
  let scoreColor = 'text-cyan-400';
  let strokeColor = '#06b6d4';
  if (readinessScore >= 75) {
    scoreColor = 'text-emerald-400';
    strokeColor = '#10b981';
  } else if (readinessScore >= 50) {
    scoreColor = 'text-cyan-400';
    strokeColor = '#06b6d4';
  } else {
    scoreColor = 'text-amber-400';
    strokeColor = '#f59e0b';
  }

  return (
    <div id="readiness-score-overview" className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
      {/* Header with Demo tag & Disclaimer info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            Career Readiness Analysis
          </h2>
          {isDemo && (
            <span
              id="demo-example-badge"
              className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-700/60 shadow-sm"
            >
              Demo Example
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowFormulaInfo(!showFormulaInfo)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>How is this calculated?</span>
        </button>
      </div>

      {/* Formula Explanation Popover */}
      {showFormulaInfo && (
        <div className="mb-6 p-4 rounded-xl bg-slate-950/90 border border-cyan-800/50 text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-2 font-bold text-cyan-300">
            <Info className="w-4 h-4" />
            <span>Deterministic Scoring Formula:</span>
          </div>
          <code className="block p-2 rounded bg-slate-900 font-mono text-cyan-200 text-[11px]">
            readinessScore = round( ( Σ [min(currentLevel, requiredLevel) × importance] ) / ( Σ [requiredLevel × importance] ) × 100 )
          </code>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Beginner = 0.3, Intermediate = 0.6, Advanced = 1.0. Missing skills = 0.
            The calculation is 100% deterministic and auditable.
          </p>
          <p className="text-amber-300/90 font-medium text-[11px]">
            * {result.disclaimer}
          </p>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Circular Progress Gauge */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              {/* Background Circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#1e293b"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Animated Progress Circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={strokeColor}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 1.2s ease-in-out' }}
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span id="readiness-score-number" className={`text-4xl sm:text-5xl font-extrabold tracking-tight font-mono ${scoreColor}`}>
                {readinessScore}%
              </span>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mt-0.5">
                Readiness Score
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-medium text-center mt-2 px-2">
            Skill alignment with <span className="text-white font-bold">{career}</span> requirements
          </p>
        </div>

        {/* Right: Breakdown KPI Cards */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Matched */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-emerald-300">Matched</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span id="stat-matched-count" className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                {scoreBreakdown.matchedCount}
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">Fully aligned skills</p>
            </div>
          </div>

          {/* Partial */}
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-amber-300">Partial</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span id="stat-partial-count" className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                {scoreBreakdown.partialCount}
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">Need level increase</p>
            </div>
          </div>

          {/* Missing */}
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/40 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-rose-300">Skill Gaps</span>
              <XCircle className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <span id="stat-missing-count" className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                {scoreBreakdown.missingCount}
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">Missing prerequisites</p>
            </div>
          </div>

          {/* High Priority */}
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-purple-300">High Priority</span>
              <Flame className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <span id="stat-high-priority-count" className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                {scoreBreakdown.highPriorityCount}
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">Immediate roadmap targets</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Career Advice Summary Callout */}
      {result.aiAdvice && (
        <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-cyan-900/60 flex flex-col sm:flex-row items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-600/50 flex items-center justify-center shrink-0 text-cyan-400 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="text-xs leading-relaxed text-slate-300">
            <div className="flex items-center gap-2 font-bold text-cyan-300 mb-1">
              <span>AI Strategic Guidance</span>
              {result.aiEnhanced ? (
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-cyan-950 border border-cyan-800 text-cyan-400">
                  Gemini Enhanced
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800 text-slate-400">
                  Deterministic Baseline
                </span>
              )}
            </div>
            <p className="text-slate-300 whitespace-pre-line">{result.aiAdvice}</p>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-[11px] text-slate-500 text-center mt-4">
        {result.disclaimer}
      </p>
    </div>
  );
};
