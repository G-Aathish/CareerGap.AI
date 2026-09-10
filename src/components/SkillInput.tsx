import React, { useState } from 'react';
import { Layers, Plus, Trash2, Zap, Check } from 'lucide-react';
import { StudentSkill, SkillProficiency } from '../../shared/types.ts';

interface SkillInputProps {
  skills: StudentSkill[];
  onAddSkill: (skill: StudentSkill) => void;
  onRemoveSkill: (index: number) => void;
  onUpdateSkillProficiency: (index: number, proficiency: SkillProficiency) => void;
}

const COMMON_QUICK_SKILLS = [
  'Java', 'Python', 'C', 'SQL', 'HTML', 'JavaScript', 'React', 'Git', 'Spring Boot', 'Data Structures', 'Docker'
];

export const SkillInput: React.FC<SkillInputProps> = ({
  skills,
  onAddSkill,
  onRemoveSkill,
  onUpdateSkillProficiency,
}) => {
  const [skillName, setSkillName] = useState('');
  const [proficiency, setProficiency] = useState<SkillProficiency>('Intermediate');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = skillName.trim();
    if (!trimmed) {
      setErrorMsg('Please enter a skill name.');
      return;
    }

    if (skills.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg('This skill has already been added.');
      return;
    }

    onAddSkill({ name: trimmed, proficiency });
    setSkillName('');
    setErrorMsg('');
  };

  const handleQuickAdd = (suggested: string) => {
    if (skills.some(s => s.name.toLowerCase() === suggested.toLowerCase())) {
      return;
    }
    onAddSkill({ name: suggested, proficiency: 'Intermediate' });
  };

  return (
    <div id="student-skill-input-section" className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">What skills do you currently have?</h2>
            <p className="text-xs text-slate-400">Add languages, tools, or frameworks with your current proficiency level</p>
          </div>
        </div>
        <span className="text-xs font-mono text-blue-400 bg-blue-950/50 px-2.5 py-1 rounded-full border border-blue-800/40">
          {skills.length} {skills.length === 1 ? 'Skill' : 'Skills'} Added
        </span>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4">
        <div className="sm:col-span-6">
          <label htmlFor="skill-name-input" className="block text-xs font-semibold text-slate-300 mb-1">
            Skill Name:
          </label>
          <input
            id="skill-name-input"
            type="text"
            placeholder="e.g. Java, C, SQL, Git..."
            value={skillName}
            onChange={(e) => {
              setSkillName(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            className="w-full px-3.5 py-2.5 bg-slate-950/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="sm:col-span-4">
          <label htmlFor="skill-proficiency-select" className="block text-xs font-semibold text-slate-300 mb-1">
            Proficiency Level:
          </label>
          <select
            id="skill-proficiency-select"
            value={proficiency}
            onChange={(e) => setProficiency(e.target.value as SkillProficiency)}
            className="w-full px-3.5 py-2.5 bg-slate-950/90 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="Beginner">Beginner (0.3 - Foundation)</option>
            <option value="Intermediate">Intermediate (0.6 - Working Knowledge)</option>
            <option value="Advanced">Advanced (1.0 - Production Proficient)</option>
          </select>
        </div>

        <div className="sm:col-span-2 flex items-end">
          <button
            id="add-skill-button"
            type="submit"
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-all shadow-md shadow-cyan-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </form>

      {errorMsg && (
        <p className="text-xs text-rose-400 mb-3">{errorMsg}</p>
      )}

      {/* Quick Add Suggestions */}
      <div className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
        <span className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
          <Zap className="w-3 h-3 text-amber-400" /> Quick add:
        </span>
        {COMMON_QUICK_SKILLS.map((item) => {
          const alreadyAdded = skills.some(s => s.name.toLowerCase() === item.toLowerCase());
          return (
            <button
              key={item}
              id={`quick-skill-${item.toLowerCase().replace(/\s+/g, '-')}`}
              type="button"
              disabled={alreadyAdded}
              onClick={() => handleQuickAdd(item)}
              className={`px-2 py-0.5 rounded-md text-[11px] transition-all cursor-pointer ${
                alreadyAdded
                  ? 'bg-slate-800/40 text-slate-600 border border-slate-800 cursor-default line-through'
                  : 'bg-slate-800/80 hover:bg-cyan-950/80 text-slate-300 hover:text-cyan-300 border border-slate-700/60 hover:border-cyan-700'
              }`}
            >
              + {item}
            </button>
          );
        })}
      </div>

      {/* Active Skills List / Chips */}
      {skills.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl bg-slate-950/30">
          <p className="text-xs text-slate-400">No skills added yet. Add your current languages and tools above, or click "Load Demo".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {skills.map((skill, idx) => {
            const badgeColors: Record<SkillProficiency, string> = {
              Beginner: 'bg-amber-950/70 text-amber-300 border-amber-800/50',
              Intermediate: 'bg-cyan-950/70 text-cyan-300 border-cyan-800/50',
              Advanced: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/50',
            };

            return (
              <div
                key={`${skill.name}-${idx}`}
                id={`student-skill-chip-${idx}`}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all group"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="font-semibold text-sm text-white truncate">{skill.name}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <select
                      value={skill.proficiency}
                      onChange={(e) => onUpdateSkillProficiency(idx, e.target.value as SkillProficiency)}
                      className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-full border bg-transparent focus:outline-none cursor-pointer ${badgeColors[skill.proficiency]}`}
                    >
                      <option value="Beginner" className="bg-slate-900 text-amber-300">Beginner (0.3)</option>
                      <option value="Intermediate" className="bg-slate-900 text-cyan-300">Intermediate (0.6)</option>
                      <option value="Advanced" className="bg-slate-900 text-emerald-300">Advanced (1.0)</option>
                    </select>
                  </div>
                </div>

                <button
                  id={`remove-skill-btn-${idx}`}
                  type="button"
                  onClick={() => onRemoveSkill(idx)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                  title="Remove skill"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
