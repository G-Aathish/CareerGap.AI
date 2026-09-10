import React from 'react';
import { GitMerge, ArrowRight, Lightbulb, Sparkles } from 'lucide-react';
import { TransferableChain } from '../../shared/types.ts';

interface TransferableSkillsGraphProps {
  chains: TransferableChain[];
}

export const TransferableSkillsGraph: React.FC<TransferableSkillsGraphProps> = ({ chains }) => {
  return (
    <div id="transferable-skills-section" className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <GitMerge className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Transferable Skill Intelligence</h2>
            <p className="text-xs text-slate-400">Your existing knowledge can become a foundation for your next skill</p>
          </div>
        </div>

        <span className="text-xs font-mono text-purple-300 bg-purple-950/50 px-3 py-1 rounded-full border border-purple-800/40 self-start sm:self-auto">
          Knowledge Bridges
        </span>
      </div>

      {chains.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl bg-slate-950/30">
          <p className="text-xs text-slate-400">
            Add foundational languages (like Java, C, SQL, or Python) to compute transferable graph bridges.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {chains.map((chain, idx) => (
            <div
              key={idx}
              id={`transferable-chain-${idx}`}
              className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 hover:border-purple-800/50 transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Knowledge Pathway:
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  {chain.existingSkill} → {chain.targetSkill}
                </span>
              </div>

              {/* Step Chain Pipeline */}
              <div className="flex flex-wrap items-center gap-2 py-2 overflow-x-auto">
                {chain.bridgeSteps.map((step, stepIdx) => {
                  const isFirst = stepIdx === 0;
                  const isLast = stepIdx === chain.bridgeSteps.length - 1;

                  return (
                    <React.Fragment key={stepIdx}>
                      <div
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm whitespace-nowrap ${
                          isFirst
                            ? 'bg-cyan-950 border border-cyan-700/80 text-cyan-300'
                            : isLast
                            ? 'bg-purple-950 border border-purple-700/80 text-purple-200'
                            : 'bg-slate-900 border border-slate-800 text-slate-200'
                        }`}
                      >
                        {isFirst && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
                        {isLast && <Sparkles className="w-3 h-3 text-purple-400" />}
                        <span>{step}</span>
                      </div>

                      {!isLast && (
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Description text */}
              <div className="mt-3 flex items-start gap-2 pt-2 border-t border-slate-900 text-xs text-slate-400">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{chain.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
