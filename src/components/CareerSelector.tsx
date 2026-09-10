import React, { useState } from 'react';
import { Briefcase, ChevronDown, PlusCircle, Sparkles } from 'lucide-react';
import { Career } from '../../shared/types.ts';

interface CareerSelectorProps {
  careers: Career[];
  selectedCareer: string;
  customCareerName: string;
  onSelectCareer: (careerName: string) => void;
  onCustomCareerNameChange: (name: string) => void;
}

export const CareerSelector: React.FC<CareerSelectorProps> = ({
  careers,
  selectedCareer,
  customCareerName,
  onSelectCareer,
  onCustomCareerNameChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const isCustom = selectedCareer === 'Custom Career';

  const filteredCareers = careers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (name: string) => {
    onSelectCareer(name);
    setIsOpen(false);
  };

  const selectedObj = careers.find(c => c.name === selectedCareer);

  return (
    <div id="career-selection-card" className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Choose Your Target Career</h2>
            <p className="text-xs text-slate-400">Select standard benchmark role or enter a custom target profile</p>
          </div>
        </div>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/50 px-2.5 py-1 rounded-full border border-cyan-800/40">
          Target Goal
        </span>
      </div>

      {/* Dropdown Container */}
      <div className="relative">
        <button
          id="career-dropdown-toggle"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-slate-950/80 border border-slate-700 hover:border-cyan-500 rounded-xl text-left text-sm text-white transition-all cursor-pointer shadow-inner"
        >
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-cyan-300">Target Role:</span>
            <span className="text-white font-medium truncate">
              {isCustom ? (customCareerName || 'Custom Career (Specify below)') : selectedCareer}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl z-40 overflow-hidden max-h-72 flex flex-col">
            <div className="p-2 border-b border-slate-800">
              <input
                id="career-search-input"
                type="text"
                placeholder="Search careers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className="overflow-y-auto p-1.5 space-y-1">
              {filteredCareers.map((c) => (
                <button
                  key={c.id}
                  id={`career-option-${c.id}`}
                  onClick={() => handleSelect(c.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex flex-col gap-0.5 cursor-pointer ${
                    selectedCareer === c.name
                      ? 'bg-cyan-950/70 border border-cyan-500/40 text-cyan-300'
                      : 'hover:bg-slate-900 text-slate-200'
                  }`}
                >
                  <span className="font-semibold text-sm">{c.name}</span>
                  <span className="text-[11px] text-slate-400 line-clamp-1">{c.description}</span>
                </button>
              ))}

              <button
                id="career-option-custom"
                onClick={() => handleSelect('Custom Career')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center gap-2 cursor-pointer ${
                  selectedCareer === 'Custom Career'
                    ? 'bg-purple-950/70 border border-purple-500/40 text-purple-300'
                    : 'hover:bg-slate-900 text-purple-300'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-purple-400" />
                <span className="font-semibold">+ Custom Career</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Selected Career Description Banner */}
      {selectedObj && !isCustom && (
        <div className="mt-3 text-xs text-slate-400 bg-slate-950/40 px-3.5 py-2 rounded-lg border border-slate-800/60 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>{selectedObj.description}</span>
        </div>
      )}

      {/* Custom Career Input */}
      {isCustom && (
        <div className="mt-4 pt-4 border-t border-slate-800">
          <label htmlFor="custom-career-name-input" className="block text-xs font-semibold text-purple-300 mb-1.5">
            Enter Custom Career Name:
          </label>
          <input
            id="custom-career-name-input"
            type="text"
            placeholder="e.g. Blockchain Core Developer, Embedded Systems Architect..."
            value={customCareerName}
            onChange={(e) => onCustomCareerNameChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950 border border-purple-500/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            CareerGap AI will dynamically synthesize industry-standard skill benchmarks for this role.
          </p>
        </div>
      )}
    </div>
  );
};
