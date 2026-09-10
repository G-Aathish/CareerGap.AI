import React from 'react';
import { Target, Sparkles, Presentation, RefreshCw, Linkedin } from 'lucide-react';

interface HeaderProps {
  onLoadDemo: () => void;
  onOpenPresentation: () => void;
  isDemoActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onLoadDemo,
  onOpenPresentation,
  isDemoActive,
}) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Target className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-mono">
                CAREERGAP<span className="text-cyan-400">.AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                AI Career Intelligence
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400">
              Personalized Skill Gap Intelligence for Career Readiness
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => scrollToSection('setup-section')}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Skill Input
          </button>
          <button
            onClick={() => scrollToSection('dashboard-results')}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Readiness Dashboard
          </button>
          <button
            onClick={() => scrollToSection('skill-gap-section')}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Gap Analysis
          </button>
          <button
            onClick={() => scrollToSection('roadmap-section')}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Roadmap
          </button>
          <button
            onClick={() => scrollToSection('coach-section')}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            AI Coach
          </button>
          <button
            onClick={() => scrollToSection('linkedin-job-matcher-section')}
            className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1.5 text-cyan-300"
          >
            <Linkedin className="w-3.5 h-3.5 text-[#388ae5] fill-current" />
            <span>LinkedIn Jobs</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="header-load-demo-btn"
            onClick={onLoadDemo}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isDemoActive
                ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-300'
                : 'bg-slate-900/80 border-slate-700 hover:border-cyan-500/50 text-slate-200 hover:text-white'
            }`}
            title="Load Hackathon Java Developer Demo"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Load Demo</span>
            <span className="sm:hidden">Demo</span>
          </button>

          <button
            id="header-presentation-mode-btn"
            onClick={onOpenPresentation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-950/60 border border-purple-500/40 text-purple-200 hover:bg-purple-900/60 transition-all cursor-pointer shadow-sm shadow-purple-950"
            title="Judges Presentation Mode"
          >
            <Presentation className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">Demo Mode</span>
          </button>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-amber-400">HACKNOVA'26</span>
          </div>
        </div>
      </div>
    </header>
  );
};
