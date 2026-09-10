import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  FileUp,
  CheckCircle,
  AlertCircle,
  Wrench,
  Shield,
  Award,
  Linkedin,
  ExternalLink,
  Briefcase
} from 'lucide-react';
import { JobDescriptionAnalysis, StudentSkill } from '../../shared/types.ts';

interface JobAndResumeInputProps {
  jobDescription: string;
  onJobDescriptionChange: (text: string) => void;
  jobAnalysis?: JobDescriptionAnalysis;
  onJobAnalysisResult: (analysis: JobDescriptionAnalysis) => void;
  onSkillsExtractedFromResume: (skills: StudentSkill[]) => void;
}

const SAMPLE_LINKEDIN_JOBS = [
  {
    company: 'Amazon',
    title: 'Software Development Engineer I (Java)',
    text: `Amazon is hiring a Software Development Engineer I (Java Backend).
Location: Seattle, WA / Multiple / Remote.
Requirements:
- Strong core Java programming, Object-Oriented Design (OOP), and Data Structures.
- Hands-on experience with Spring Boot, REST APIs, Microservices, and SQL databases.
- Familiarity with Git version control, Docker containers, and AWS Cloud infrastructure.
- Bachelor's in Computer Science or equivalent software engineering background.`,
  },
  {
    company: 'JPMorgan Chase',
    title: 'Java Software Engineer - Associate',
    text: `JPMorgan Chase & Co. - Java Software Engineer (Associate / Graduate).
Location: New York, NY / Plano, TX / Remote Option.
Key Responsibilities:
- Build high-throughput enterprise financial microservices using Java and Spring Boot.
- Write robust relational SQL queries, optimize database performance, and build REST APIs.
- Practice automated unit testing, CI/CD pipeline automation with Git, and clean code principles.`,
  },
  {
    company: 'Google',
    title: 'Software Engineer - Frontend & Web',
    text: `Google - Software Engineer, Web Applications & Frontend.
Location: Mountain View, CA / Remote.
Minimum Qualifications:
- Proficiency in JavaScript, TypeScript, modern HTML5, and CSS3.
- Experience with modern component frameworks (React, Angular) and RESTful APIs.
- Understanding of web performance optimization, responsive layouts, and Git workflows.`,
  },
];

export const JobAndResumeInput: React.FC<JobAndResumeInputProps> = ({
  jobDescription,
  onJobDescriptionChange,
  jobAnalysis,
  onJobAnalysisResult,
  onSkillsExtractedFromResume,
}) => {
  const [activeTab, setActiveTab] = useState<'job' | 'linkedin' | 'resume'>('job');
  const [linkedInUrlOrText, setLinkedInUrlOrText] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzingJob, setIsAnalyzingJob] = useState(false);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [resumeSuccessMsg, setResumeSuccessMsg] = useState('');
  const [apiError, setApiError] = useState('');

  const runJobAnalysis = async (textToAnalyze: string) => {
    if (!textToAnalyze.trim()) {
      setApiError('Please paste job text first.');
      return;
    }
    setApiError('');
    setIsAnalyzingJob(true);

    try {
      const response = await fetch('/api/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: textToAnalyze }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze job description');
      }

      const data: JobDescriptionAnalysis = await response.json();
      onJobAnalysisResult(data);
    } catch (err) {
      console.error(err);
      setApiError('AI job parsing failed, but your skill gap will still analyze via database.');
    } finally {
      setIsAnalyzingJob(false);
    }
  };

  const handleAnalyzeJob = () => {
    runJobAnalysis(jobDescription);
  };

  const handleLoadLinkedInSample = (sampleText: string) => {
    onJobDescriptionChange(sampleText);
    setActiveTab('job');
    runJobAnalysis(sampleText);
  };

  const handleImportLinkedInText = () => {
    if (!linkedInUrlOrText.trim()) {
      setApiError('Please enter a LinkedIn job description or title first.');
      return;
    }
    onJobDescriptionChange(linkedInUrlOrText);
    setActiveTab('job');
    runJobAnalysis(linkedInUrlOrText);
  };

  const handleResumeExtract = async () => {
    if (!resumeText.trim()) {
      setApiError('Please paste your resume text first.');
      return;
    }
    setApiError('');
    setIsParsingResume(true);
    setResumeSuccessMsg('');

    try {
      const response = await fetch('/api/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: resumeText }),
      });

      if (!response.ok) throw new Error('Resume parsing failed');
      const data: JobDescriptionAnalysis = await response.json();

      // Convert extracted technologies & required skills to StudentSkills
      const combined = Array.from(new Set([...data.requiredSkills, ...data.technologies]));
      if (combined.length > 0) {
        const extracted: StudentSkill[] = combined.slice(0, 8).map(name => ({
          name,
          proficiency: 'Intermediate',
        }));
        onSkillsExtractedFromResume(extracted);
        setResumeSuccessMsg(`Successfully extracted ${extracted.length} skills from your resume into your skills list!`);
      } else {
        setApiError('No distinct technical skills detected in the provided resume text.');
      }
    } catch (err) {
      console.error(err);
      setApiError('Resume parsing failed. Please input skills manually.');
    } finally {
      setIsParsingResume(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setResumeText(text);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div id="job-description-section" className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Target Job Description & LinkedIn Mapping</h2>
            <p className="text-xs text-slate-400">Enhance your evaluation against specific employer requirements</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveTab('job')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              activeTab === 'job'
                ? 'bg-purple-900/70 text-purple-200 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Job Description
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('linkedin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'linkedin'
                ? 'bg-[#0a66c2]/80 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Linkedin className="w-3 h-3 fill-current text-[#388ae5]" />
            <span>LinkedIn Importer</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('resume')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              activeTab === 'resume'
                ? 'bg-purple-900/70 text-purple-200 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Upload Resume
          </button>
        </div>
      </div>

      {apiError && (
        <div className="mb-3 p-3 bg-rose-950/50 border border-rose-800/50 rounded-xl text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {resumeSuccessMsg && (
        <div className="mb-3 p-3 bg-emerald-950/50 border border-emerald-800/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{resumeSuccessMsg}</span>
        </div>
      )}

      {/* Tab: Job Description */}
      {activeTab === 'job' && (
        <div>
          <label htmlFor="job-description-textarea" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Paste a Job Description:
          </label>
          <textarea
            id="job-description-textarea"
            rows={4}
            value={jobDescription}
            onChange={(e) => onJobDescriptionChange(e.target.value)}
            placeholder="Paste a job description or LinkedIn posting here (e.g. We are looking for a Java Backend Developer with experience in Spring Boot, REST APIs, SQL, Git and Docker...)"
            className="w-full p-3.5 bg-slate-950/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-sans"
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400">
              When analyzed, Gemini extracts technical, preferred, and soft skill requirements to weight your priority score.
            </span>
            <button
              id="analyze-job-description-btn"
              type="button"
              onClick={handleAnalyzeJob}
              disabled={isAnalyzingJob || !jobDescription.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-purple-900/80 hover:bg-purple-800 border border-purple-600/50 text-purple-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-purple-950"
            >
              {isAnalyzingJob ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Extracting Skills with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                  <span>Analyze Job Description</span>
                </>
              )}
            </button>
          </div>

          {/* Render Extracted Job Breakdown if available */}
          {jobAnalysis && (
            <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> Extracted Employer Requirements
                </span>
                {jobAnalysis.experienceRequirements && (
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    Exp: {jobAnalysis.experienceRequirements}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                {/* Required Skills */}
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="font-semibold text-slate-300 block mb-1 text-[11px] uppercase tracking-wider text-cyan-400">
                    Required Skills
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {jobAnalysis.requiredSkills?.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/40 text-[11px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Technologies / Tools */}
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="font-semibold text-slate-300 block mb-1 text-[11px] uppercase tracking-wider text-purple-400">
                    Technologies
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {jobAnalysis.technologies?.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/40 text-[11px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Soft Skills */}
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="font-semibold text-slate-300 block mb-1 text-[11px] uppercase tracking-wider text-emerald-400">
                    Professional / Soft
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {jobAnalysis.softSkills?.map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/40 text-[11px]">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: LinkedIn Importer */}
      {activeTab === 'linkedin' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span>Paste LinkedIn Job Description or Requirements:</span>
              <a
                href="https://www.linkedin.com/jobs/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#388ae5] hover:underline flex items-center gap-1 text-[11px]"
              >
                <span>Open LinkedIn Jobs</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <textarea
              id="linkedin-import-textarea"
              rows={3}
              value={linkedInUrlOrText}
              onChange={(e) => setLinkedInUrlOrText(e.target.value)}
              placeholder="Copy & paste text from any LinkedIn job posting (responsibilities, required skills, tech stack)..."
              className="w-full p-3.5 bg-slate-950/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0a66c2] font-sans"
            />
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={handleImportLinkedInText}
                disabled={isAnalyzingJob || !linkedInUrlOrText.trim()}
                className="px-4 py-2 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
              >
                <Linkedin className="w-3.5 h-3.5 fill-current" />
                <span>Import & Analyze Job Posting</span>
              </button>
            </div>
          </div>

          {/* One-Click Real LinkedIn Postings */}
          <div className="pt-3 border-t border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Or Load Real Company LinkedIn Job Samples:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SAMPLE_LINKEDIN_JOBS.map((sample, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleLoadLinkedInSample(sample.text)}
                  className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-left transition-all cursor-pointer group"
                >
                  <div className="text-xs font-bold text-white group-hover:text-cyan-400 flex items-center justify-between">
                    <span>{sample.company}</span>
                    <Linkedin className="w-3 h-3 text-[#0a66c2] fill-current" />
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                    {sample.title}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Resume Parsing */}
      {activeTab === 'resume' && (
        <div>
          <label htmlFor="resume-textarea" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Upload or Paste Resume:
          </label>

          <div className="flex items-center gap-3 mb-3">
            <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-950 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-white cursor-pointer">
              <FileUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>Select File (.txt, .md)</span>
              <input
                id="resume-file-input"
                type="file"
                accept=".txt,.md,.text"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <span className="text-[11px] text-slate-500">or paste text below</span>
          </div>

          <textarea
            id="resume-textarea"
            rows={4}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste raw resume text here (Skills, Experience, Education, Projects)..."
            className="w-full p-3.5 bg-slate-950/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
          />

          <div className="mt-3 flex justify-end">
            <button
              id="extract-resume-skills-btn"
              type="button"
              onClick={handleResumeExtract}
              disabled={isParsingResume || !resumeText.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-cyan-900"
            >
              {isParsingResume ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Extracting Resume Skills...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Extract Skills into Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
