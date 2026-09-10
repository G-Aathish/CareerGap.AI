import React, { useState, useEffect } from 'react';
import {
  Linkedin,
  ExternalLink,
  Search,
  Building2,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  MapPin,
  Sparkles,
  Copy,
  Check,
  Filter,
  DollarSign,
  TrendingUp,
  Globe,
  RefreshCw,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import {
  AnalysisResult,
  SimulatedJobPosting,
  SuggestedLinkedInSearch,
  JobSearchResponse
} from '../../shared/types.ts';
import {
  getCompaniesForCareer,
  buildLinkedInJobSearchUrl,
  getLinkedInProfileAdvice
} from '../data/companyHiringData.ts';

interface LinkedInJobMatcherProps {
  result: AnalysisResult;
}

export const LinkedInJobMatcher: React.FC<LinkedInJobMatcherProps> = ({ result }) => {
  const { career, readinessScore, matchedSkills, prioritizedGaps } = result;

  // Active view tab
  const [activeTab, setActiveTab] = useState<'ai-postings' | 'companies' | 'profile'>('ai-postings');

  // Search builder state
  const [searchLocation, setSearchLocation] = useState('Worldwide');
  const [experienceLevel, setExperienceLevel] = useState<'all' | 'internship' | 'entry-level' | 'associate'>('entry-level');
  const [workplaceType, setWorkplaceType] = useState<'any' | 'remote' | 'hybrid' | 'on-site'>('any');
  const [activeCompanyFilter, setActiveCompanyFilter] = useState<'all' | 'high-match' | 'top-tech' | 'remote'>('all');
  const [copiedHeadline, setCopiedHeadline] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Gemini Simulated Job Search State
  const [simulatedJobs, setSimulatedJobs] = useState<SimulatedJobPosting[]>([]);
  const [suggestedSearches, setSuggestedSearches] = useState<SuggestedLinkedInSearch[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isAiEnhanced, setIsAiEnhanced] = useState(false);
  const [jobSearchError, setJobSearchError] = useState<string | null>(null);

  const matchedNames = matchedSkills.map((s) => s.skillName);
  const gapNames = prioritizedGaps.map((s) => s.skillName);

  const companies = getCompaniesForCareer(career);
  const profileAdvice = getLinkedInProfileAdvice(career, matchedNames, gapNames);

  // Generate current custom search URL
  const customLinkedInUrl = buildLinkedInJobSearchUrl({
    keywords: `${career} ${matchedNames.slice(0, 2).join(' ')}`.trim(),
    location: searchLocation,
    experienceLevel,
    workplaceType,
  });

  // Call /api/jobs/search endpoint
  const fetchSimulatedJobs = async (loc?: string) => {
    setIsLoadingJobs(true);
    setJobSearchError(null);
    try {
      const response = await fetch('/api/jobs/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          career,
          missingSkills: gapNames,
          matchedSkills: matchedNames,
          location: loc || searchLocation,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data: JobSearchResponse = await response.json();
      setSimulatedJobs(data.jobs || []);
      setSuggestedSearches(data.suggestedLinkedInSearches || []);
      setIsAiEnhanced(Boolean(data.aiEnhanced));
    } catch (err) {
      console.error('Failed to fetch job postings from /api/jobs/search:', err);
      setJobSearchError('Could not load AI job postings. Click Refresh to try again.');
    } finally {
      setIsLoadingJobs(false);
    }
  };

  // Fetch on mount or when career or location changes
  useEffect(() => {
    fetchSimulatedJobs(searchLocation);
  }, [career]);

  // Filtered companies
  const filteredCompanies = companies.filter((company) => {
    if (activeCompanyFilter === 'high-match') {
      return readinessScore >= company.typicalHiringBar - 10;
    }
    if (activeCompanyFilter === 'top-tech') {
      return company.hiringTier === 'Top Tech';
    }
    if (activeCompanyFilter === 'remote') {
      return company.workplaceType === 'Remote';
    }
    return true;
  });

  const handleCopyHeadline = () => {
    navigator.clipboard.writeText(profileAdvice.headline);
    setCopiedHeadline(true);
    setTimeout(() => setCopiedHeadline(false), 2000);
  };

  const handleCopySearchUrl = () => {
    navigator.clipboard.writeText(customLinkedInUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <section
      id="linkedin-job-matcher-section"
      className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md"
    >
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0a66c2]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header Banner */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#0a66c2] text-white flex items-center justify-center shadow-lg shadow-[#0a66c2]/30 shrink-0">
              <Linkedin className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  LinkedIn Job Matcher & Hiring Directory
                </h2>
                <span className="hidden sm:inline-flex px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-[#0a66c2]/20 text-[#388ae5] border border-[#0a66c2]/40">
                  Live Mapping
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-0.5">
                Connecting your verified <span className="text-cyan-400 font-semibold">{readinessScore}% Readiness Score</span> directly to companies hiring for <span className="text-white font-semibold">{career}</span> roles.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Launch Button */}
        <a
          id="btn-open-linkedin-main"
          href={customLinkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0a66c2] to-[#0077b5] hover:from-[#004182] hover:to-[#0a66c2] text-white font-bold text-sm shadow-xl shadow-[#0a66c2]/25 transition-all hover:scale-[1.02] cursor-pointer shrink-0"
        >
          <Search className="w-4 h-4" />
          <span>Search {career} Jobs on LinkedIn</span>
          <ExternalLink className="w-4 h-4 opacity-75" />
        </a>
      </div>

      {/* Quick Launch Presets Strip */}
      <div className="relative z-10 mt-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          1-Click LinkedIn Search Presets
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <a
            id="preset-entry-level"
            href={buildLinkedInJobSearchUrl({
              keywords: `${career}`,
              experienceLevel: 'entry-level',
              location: 'Worldwide',
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/40 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-500/20">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                  Entry-Level {career}
                </div>
                <div className="text-[11px] text-slate-400">0 - 2 Years Experience</div>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
          </a>

          <a
            id="preset-remote"
            href={buildLinkedInJobSearchUrl({
              keywords: `${career}`,
              workplaceType: 'remote',
              location: 'Worldwide',
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-blue-500/40 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:bg-blue-500/20">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                  100% Remote Roles
                </div>
                <div className="text-[11px] text-slate-400">Work from Anywhere</div>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
          </a>

          <a
            id="preset-matched-skills"
            href={buildLinkedInJobSearchUrl({
              keywords: `${career} ${matchedNames.slice(0, 2).join(' ')}`,
              experienceLevel: 'entry-level',
              location: 'Worldwide',
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/40 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Matched Skills Query
                </div>
                <div className="text-[11px] text-slate-400">
                  {matchedNames.slice(0, 2).join(' + ') || 'Core Skills'}
                </div>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
          </a>

          <a
            id="preset-internship"
            href={buildLinkedInJobSearchUrl({
              keywords: `${career} Intern`,
              experienceLevel: 'internship',
              location: 'Worldwide',
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/40 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:bg-amber-500/20">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                  Internships & Trainees
                </div>
                <div className="text-[11px] text-slate-400">Campus & Early Talent</div>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
          </a>
        </div>
      </div>

      {/* Interactive Search Customizer Bar */}
      <div className="relative z-10 mt-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto flex-1">
          {/* Location Select */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-cyan-400" />
              Target Location
            </label>
            <select
              id="select-linkedin-location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              aria-label="Target Location"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Worldwide">Worldwide (Any)</option>
              <option value="United States">United States</option>
              <option value="India">India</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Germany">Germany</option>
              <option value="Singapore">Singapore</option>
            </select>
          </div>

          {/* Experience Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-blue-400" />
              Experience Level
            </label>
            <select
              id="select-linkedin-experience"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value as any)}
              aria-label="Experience Level"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="entry-level">Entry-Level (0 - 2 yrs)</option>
              <option value="internship">Internship</option>
              <option value="associate">Associate Level</option>
              <option value="all">All Experience Levels</option>
            </select>
          </div>

          {/* Workplace Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-emerald-400" />
              Workplace Type
            </label>
            <select
              id="select-linkedin-workplace"
              value={workplaceType}
              onChange={(e) => setWorkplaceType(e.target.value as any)}
              aria-label="Workplace Type"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="any">Any (Remote or On-site)</option>
              <option value="remote">Remote Only</option>
              <option value="hybrid">Hybrid</option>
              <option value="on-site">On-site Only</option>
            </select>
          </div>
        </div>

        {/* Action Button & Copy URL */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <button
            type="button"
            onClick={handleCopySearchUrl}
            title="Copy LinkedIn search link"
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedUrl ? 'Copied Link!' : 'Copy Link'}</span>
          </button>

          <a
            id="btn-custom-linkedin-search"
            href={customLinkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/20 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Launch Search</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Navigation View Tabs */}
      <div className="relative z-10 mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2 p-1 bg-slate-950/90 rounded-xl border border-slate-800 overflow-x-auto">
          <button
            type="button"
            id="tab-ai-postings"
            onClick={() => setActiveTab('ai-postings')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === 'ai-postings'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>AI Real-World Postings</span>
            {simulatedJobs.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-200 text-[10px]">
                {simulatedJobs.length}
              </span>
            )}
          </button>
          <button
            type="button"
            id="tab-companies-directory"
            onClick={() => setActiveTab('companies')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === 'companies'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-cyan-300" />
            <span>Company Benchmarks</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">
              {filteredCompanies.length}
            </span>
          </button>
          <button
            type="button"
            id="tab-profile-tips"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Linkedin className="w-3.5 h-3.5 text-cyan-300" />
            <span>Profile & Headline</span>
          </button>
        </div>

        {activeTab === 'ai-postings' && (
          <div className="flex items-center gap-3">
            {isAiEnhanced && (
              <span className="inline-flex items-center gap-1.5 text-[11px] text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20 font-medium">
                <Sparkles className="w-3 h-3" />
                Gemini Intelligence Active
              </span>
            )}
            <button
              type="button"
              id="btn-refresh-ai-jobs"
              onClick={() => fetchSimulatedJobs(searchLocation)}
              disabled={isLoadingJobs}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isLoadingJobs ? 'animate-spin' : ''}`} />
              <span>{isLoadingJobs ? 'Simulating...' : 'Refresh AI Postings'}</span>
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: AI Real-World Job Postings */}
      {activeTab === 'ai-postings' && (
        <div className="relative z-10 mt-6 space-y-6">
          {/* Intro bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Simulated Market Openings for {career}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Powered by /api/jobs/search
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Gemini analyzes your matched skills ({matchedNames.slice(0, 3).join(', ') || 'Core CS'}) and missing skills ({gapNames.slice(0, 3).join(', ') || 'Advanced Tech'}) to match real hiring benchmarks with direct LinkedIn search links.
              </p>
            </div>
          </div>

          {/* Loading State */}
          {isLoadingJobs && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 animate-pulse space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-32 bg-slate-800 rounded" />
                    <div className="h-5 w-20 bg-slate-800 rounded-full" />
                  </div>
                  <div className="h-4 w-48 bg-slate-800 rounded" />
                  <div className="h-12 w-full bg-slate-900 rounded-xl" />
                  <div className="h-8 w-full bg-slate-800 rounded-lg" />
                </div>
              ))}
            </div>
          )}

          {/* Error banner */}
          {jobSearchError && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>{jobSearchError}</span>
              </div>
              <button
                type="button"
                onClick={() => fetchSimulatedJobs(searchLocation)}
                className="px-3 py-1 bg-red-900/50 hover:bg-red-800/50 text-white rounded-lg text-xs font-semibold"
              >
                Retry
              </button>
            </div>
          )}

          {/* Suggested Skill-Based LinkedIn Searches Strip */}
          {!isLoadingJobs && suggestedSearches.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-[#388ae5] fill-current" />
                <span>Skill-Targeted LinkedIn Search Strategies</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestedSearches.map((s, idx) => (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-[#0a66c2]/50 transition-all flex items-center justify-between group"
                  >
                    <div className="pr-2">
                      <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                        <span>{s.label}</span>
                        <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{s.description}</p>
                      <span className="inline-block mt-1 font-mono text-[10px] text-[#388ae5] bg-[#0a66c2]/10 px-1.5 py-0.5 rounded border border-[#0a66c2]/20">
                        {s.query}
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-[#388ae5] shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Job Postings Grid */}
          {!isLoadingJobs && simulatedJobs.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {simulatedJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between group"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors">
                            {job.company}
                          </h4>
                          {job.companyTier && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                              {job.companyTier}
                            </span>
                          )}
                        </div>
                        <h5 className="text-sm font-semibold text-cyan-300 mt-0.5">
                          {job.title}
                        </h5>
                      </div>

                      {/* Fit Score Pill */}
                      <div className="shrink-0 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                          <Sparkles className="w-3.5 h-3.5" />
                          {job.fitScore}% Fit
                        </span>
                      </div>
                    </div>

                    {/* Metadata strip */}
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {job.location}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                        {job.workplaceType}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                        {job.experienceLevel}
                      </span>
                      {job.salaryRange && (
                        <span className="flex items-center gap-1 text-emerald-400 font-medium">
                          <DollarSign className="w-3 h-3" />
                          {job.salaryRange}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="mt-3 text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                      {job.descriptionSnippet}
                    </p>

                    {/* Skills Breakdown */}
                    <div className="mt-3 space-y-2">
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 mb-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Matched Skills for this Role:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {job.matchedSkills.map((m) => (
                            <span
                              key={m}
                              className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px] font-medium"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>

                      {job.missingSkillsRequired && job.missingSkillsRequired.length > 0 && (
                        <div>
                          <div className="text-[10px] uppercase font-bold tracking-wider text-amber-400 mb-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Skill Gap / Ramp-Up Needed:
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {job.missingSkillsRequired.map((gap) => (
                              <span
                                key={gap}
                                className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-medium"
                              >
                                {gap}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* AI Recommendation Reason */}
                    {job.recommendationReason && (
                      <p className="mt-3 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-2 italic">
                        <strong className="text-slate-300 not-italic font-semibold">AI Match Note:</strong>{' '}
                        {job.recommendationReason}
                      </p>
                    )}
                  </div>

                  {/* Bottom Action */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Targeted LinkedIn Query Generated
                    </span>
                    <a
                      id={`btn-apply-job-${job.id}`}
                      href={job.linkedinSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0a66c2]/20 hover:bg-[#0a66c2] text-[#388ae5] hover:text-white border border-[#0a66c2]/40 hover:border-[#0a66c2] text-xs font-bold transition-all cursor-pointer shadow-sm"
                    >
                      <Linkedin className="w-3.5 h-3.5 fill-current" />
                      <span>Search on LinkedIn</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Company Hiring Directory */}
      {activeTab === 'companies' && (
      <div className="relative z-10 mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>Top Companies Currently Hiring for {career}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal">
                {filteredCompanies.length} tracked employers
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Evaluated against your verified {readinessScore}% readiness score with direct LinkedIn hiring search links.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setActiveCompanyFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                activeCompanyFilter === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              All Employers
            </button>
            <button
              type="button"
              onClick={() => setActiveCompanyFilter('high-match')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                activeCompanyFilter === 'high-match'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              Ready to Apply (Competitive)
            </button>
            <button
              type="button"
              onClick={() => setActiveCompanyFilter('top-tech')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                activeCompanyFilter === 'top-tech'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              Top Tech Leaders
            </button>
            <button
              type="button"
              onClick={() => setActiveCompanyFilter('remote')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                activeCompanyFilter === 'remote'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              Remote-First
            </button>
          </div>
        </div>

        {/* Company Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredCompanies.map((company) => {
            const isReady = readinessScore >= company.typicalHiringBar;
            const isCompetitive = readinessScore >= company.typicalHiringBar - 15;
            const diff = readinessScore - company.typicalHiringBar;

            const companyLinkedInSearchUrl = buildLinkedInJobSearchUrl({
              keywords: `${company.companyName} ${company.featuredRole}`,
              location: searchLocation,
            });

            return (
              <div
                key={company.id}
                className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between group"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-lg border ${company.badgeBg}`}
                      >
                        {company.logoLetter}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors">
                            {company.companyName}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                            {company.hiringTier}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{company.industry}</p>
                      </div>
                    </div>

                    {/* Match Status Badge */}
                    <div className="text-right shrink-0">
                      {isReady ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Ready to Apply
                        </span>
                      ) : isCompetitive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-bold">
                          <Sparkles className="w-3.5 h-3.5" />
                          Competitive Match
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Skill Up Needed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Featured Role & Location */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>{company.featuredRole}</span>
                      <span className="text-[11px] font-normal text-slate-400">
                        {company.experienceLevel}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {company.location}
                      </span>
                      {company.salaryRange && (
                        <span className="flex items-center gap-1 text-emerald-400 font-medium">
                          <DollarSign className="w-3 h-3" />
                          {company.salaryRange}
                        </span>
                      )}
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                        {company.workplaceType}
                      </span>
                    </div>
                  </div>

                  {/* Hiring Bar Comparison Meter */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">
                        Typical Hiring Bar: <strong className="text-slate-200">{company.typicalHiringBar}%</strong>
                      </span>
                      <span className="text-slate-400">
                        Your Readiness:{' '}
                        <strong className={isReady ? 'text-emerald-400' : isCompetitive ? 'text-cyan-400' : 'text-amber-400'}>
                          {readinessScore}% ({diff >= 0 ? `+${diff}%` : `${diff}%`})
                        </strong>
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden relative">
                      {/* Company Bar Marker */}
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-white/70 z-10"
                        style={{ left: `${company.typicalHiringBar}%` }}
                        title={`Hiring Bar: ${company.typicalHiringBar}%`}
                      />
                      {/* User Score Fill */}
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isReady
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : isCompetitive
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                            : 'bg-gradient-to-r from-amber-500 to-orange-500'
                        }`}
                        style={{ width: `${Math.min(readinessScore, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Skills Alignment */}
                  <div className="mt-3">
                    <div className="text-[11px] font-semibold text-slate-400 mb-1.5">
                      Key Skills Evaluated for this Role:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {company.keySkills.map((skill) => {
                        const hasSkill = matchedNames.some(
                          (m) => m.toLowerCase() === skill.toLowerCase()
                        );
                        return (
                          <span
                            key={skill}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                              hasSkill
                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 border-slate-700/60'
                            }`}
                          >
                            {hasSkill ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
                            )}
                            <span>{skill}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Why Suitable Note */}
                  <p className="mt-3 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-2">
                    <strong className="text-slate-300 font-semibold">Why this role fits:</strong>{' '}
                    {company.whySuitable}
                  </p>
                </div>

                {/* Bottom Action */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Live postings updated on LinkedIn
                  </span>
                  <a
                    id={`btn-search-${company.id}`}
                    href={companyLinkedInSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0a66c2]/20 hover:bg-[#0a66c2] text-[#388ae5] hover:text-white border border-[#0a66c2]/40 hover:border-[#0a66c2] text-xs font-bold transition-all cursor-pointer"
                  >
                    <Linkedin className="w-3.5 h-3.5 fill-current" />
                    <span>Search Jobs at {company.companyName}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* TAB 3: LinkedIn Profile & Recruiter Visibility Card */}
      {activeTab === 'profile' && (
      <div className="relative z-10 mt-6 p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-900/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-white text-base">
                Optimize Your LinkedIn Profile to Attract Recruiters
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Recruiters find candidate profiles using targeted skill queries. Align your LinkedIn headline and skills section with these high-impact keywords:
            </p>

            {/* Generated Headline Box */}
            <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                  Recommended LinkedIn Headline:
                </div>
                <div className="text-xs font-mono font-medium text-white mt-0.5">
                  {profileAdvice.headline}
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyHeadline}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
              >
                {copiedHeadline ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedHeadline ? 'Copied!' : 'Copy Headline'}</span>
              </button>
            </div>

            {/* Suggested Top 5 Skills for LinkedIn Profile */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold text-[11px]">
                Top Skills to Pin to Your Profile:
              </span>
              {profileAdvice.topSkillsToFeature.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 text-[11px] font-medium"
                >
                  +{skill}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:w-72 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shrink-0">
            <div className="font-bold text-white text-xs mb-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#388ae5]" />
              Recruiter Search Tip
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {profileAdvice.recruiterTip}
            </p>
          </div>
        </div>
      </div>
      )}
    </section>
  );
};
