import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { CareerSelector } from './components/CareerSelector.tsx';
import { SkillInput } from './components/SkillInput.tsx';
import { JobAndResumeInput } from './components/JobAndResumeInput.tsx';
import { LandingFlow } from './components/LandingFlow.tsx';
import { ReadinessScoreCard } from './components/ReadinessScoreCard.tsx';
import { SkillGapGrid } from './components/SkillGapGrid.tsx';
import { PriorityGapsCard } from './components/PriorityGapsCard.tsx';
import { SkillComparisonChart } from './components/SkillComparisonChart.tsx';
import { TransferableSkillsGraph } from './components/TransferableSkillsGraph.tsx';
import { LearningRoadmapTimeline } from './components/LearningRoadmapTimeline.tsx';
import { CareerCoachChat } from './components/CareerCoachChat.tsx';
import { LinkedInJobMatcher } from './components/LinkedInJobMatcher.tsx';
import { PresentationModeModal } from './components/PresentationModeModal.tsx';
import { Footer } from './components/Footer.tsx';
import {
  Career,
  StudentSkill,
  SkillProficiency,
  JobDescriptionAnalysis,
  AnalysisResult,
} from '../shared/types.ts';
import { ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

const DEMO_JOB_DESCRIPTION = `We are looking for a Java Backend Developer with experience in Java, Spring Boot, REST APIs, SQL, Git and Docker. The ideal candidate will write clean code, collaborate with cross-functional teams, and build scalable microservices. Bachelor's degree in Computer Science or equivalent experience required.`;

const DEMO_STUDENT_SKILLS: StudentSkill[] = [
  { name: 'Java', proficiency: 'Intermediate' },
  { name: 'C', proficiency: 'Intermediate' },
  { name: 'SQL', proficiency: 'Beginner' },
  { name: 'HTML', proficiency: 'Beginner' },
];

export default function App() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<string>('Java Developer');
  const [customCareerName, setCustomCareerName] = useState<string>('');
  const [studentSkills, setStudentSkills] = useState<StudentSkill[]>([]);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [jobAnalysis, setJobAnalysis] = useState<JobDescriptionAnalysis | undefined>(undefined);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Fetch careers on mount
  useEffect(() => {
    async function loadCareers() {
      try {
        const res = await fetch('/api/careers');
        if (res.ok) {
          const data: Career[] = await res.json();
          setCareers(data);
        }
      } catch (err) {
        console.error('Failed to load careers from API:', err);
      }
    }
    loadCareers();
  }, []);

  const handleAddSkill = (newSkill: StudentSkill) => {
    setStudentSkills((prev) => [...prev, newSkill]);
    setErrorMessage('');
  };

  const handleRemoveSkill = (index: number) => {
    setStudentSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateSkillProficiency = (index: number, proficiency: SkillProficiency) => {
    setStudentSkills((prev) =>
      prev.map((s, i) => (i === index ? { ...s, proficiency } : s))
    );
  };

  const handleSkillsExtractedFromResume = (extracted: StudentSkill[]) => {
    setStudentSkills((prev) => {
      const existingNames = new Set(prev.map((s) => s.name.toLowerCase()));
      const filtered = extracted.filter((s) => !existingNames.has(s.name.toLowerCase()));
      return [...prev, ...filtered];
    });
  };

  // Perform Analysis
  const performAnalysis = async (
    targetCareer: string,
    skillsToAnalyze: StudentSkill[],
    jobDesc: string,
    isDemoTrigger: boolean = false
  ) => {
    if (skillsToAnalyze.length === 0) {
      setErrorMessage('Please add at least one current skill before analyzing.');
      const el = document.getElementById('student-skill-input-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const finalCareer = targetCareer === 'Custom Career' ? customCareerName.trim() || 'Custom Software Engineer' : targetCareer;

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          career: finalCareer,
          skills: skillsToAnalyze,
          jobDescription: jobDesc,
          isDemo: isDemoTrigger,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to complete analysis');
      }

      const data: AnalysisResult = await response.json();
      setAnalysisResult(data);
      setIsDemoActive(isDemoTrigger);

      // Smooth scroll to results
      setTimeout(() => {
        const resultsEl = document.getElementById('dashboard-results');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An error occurred during analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load Demo Function
  const handleLoadDemo = () => {
    setSelectedCareer('Java Developer');
    setStudentSkills(DEMO_STUDENT_SKILLS);
    setJobDescription(DEMO_JOB_DESCRIPTION);
    setIsDemoActive(true);
    setErrorMessage('');

    // Trigger immediate analysis with demo payload
    performAnalysis('Java Developer', DEMO_STUDENT_SKILLS, DEMO_JOB_DESCRIPTION, true);
  };

  return (
    <div className="min-h-screen bg-[#070c18] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* Top Header */}
      <Header
        onLoadDemo={handleLoadDemo}
        onOpenPresentation={() => setIsPresentationOpen(true)}
        isDemoActive={isDemoActive}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero / Value Proposition */}
        <HeroSection
          onAnalyze={() => performAnalysis(selectedCareer, studentSkills, jobDescription, isDemoActive)}
          onLoadDemo={handleLoadDemo}
          isLoading={isLoading}
        />

        {/* Error Notification banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage('')}
              className="text-slate-400 hover:text-white px-2 py-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Input Configuration Section */}
        <div id="setup-section" className="space-y-6 my-6">
          {/* 1. Career Selection */}
          <CareerSelector
            careers={careers}
            selectedCareer={selectedCareer}
            customCareerName={customCareerName}
            onSelectCareer={setSelectedCareer}
            onCustomCareerNameChange={setCustomCareerName}
          />

          {/* 2. Current Skills Input */}
          <SkillInput
            skills={studentSkills}
            onAddSkill={handleAddSkill}
            onRemoveSkill={handleRemoveSkill}
            onUpdateSkillProficiency={handleUpdateSkillProficiency}
          />

          {/* 3. Job Description & Resume Input */}
          <JobAndResumeInput
            jobDescription={jobDescription}
            onJobDescriptionChange={setJobDescription}
            jobAnalysis={jobAnalysis}
            onJobAnalysisResult={setJobAnalysis}
            onSkillsExtractedFromResume={handleSkillsExtractedFromResume}
          />

          {/* Big Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-2xl shadow-xl">
            <div>
              <h3 className="font-bold text-white text-base">Ready to evaluate your readiness?</h3>
              <p className="text-xs text-slate-400">
                Audits your skills against {selectedCareer} benchmarks with deterministic math & AI intelligence.
              </p>
            </div>

            <button
              id="main-run-analysis-btn"
              type="button"
              disabled={isLoading || studentSkills.length === 0}
              onClick={() => performAnalysis(selectedCareer, studentSkills, jobDescription, false)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Computing Skill Gap...</span>
                </>
              ) : (
                <>
                  <span>Analyze My Skill Gap</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Container or Landing Flow */}
        {!analysisResult ? (
          <LandingFlow onLoadDemo={handleLoadDemo} />
        ) : (
          <div id="dashboard-results" className="pt-8 space-y-8 animate-fadeIn">
            {/* 1. Readiness Score Overview */}
            <ReadinessScoreCard result={analysisResult} />

            {/* 2. 3-Column Skill Gap Grid (Matched, Partial, Missing) */}
            <SkillGapGrid
              matchedSkills={analysisResult.matchedSkills}
              partialSkills={analysisResult.partialSkills}
              missingSkills={analysisResult.missingSkills}
            />

            {/* 3. Priority Skill Gaps (High, Medium, Low) */}
            <PriorityGapsCard prioritizedGaps={analysisResult.prioritizedGaps} />

            {/* 4. Skill Comparison Chart (Current vs Required) */}
            <SkillComparisonChart skills={analysisResult.allEvaluatedSkills} />

            {/* 5. Transferable Skills Graph */}
            <TransferableSkillsGraph chains={analysisResult.transferableChains} />

            {/* 6. Personalized 6-Week Learning Roadmap */}
            <LearningRoadmapTimeline
              roadmap={analysisResult.roadmap}
              career={analysisResult.career}
            />

            {/* 7. LinkedIn Job Matcher & Hiring Company Intelligence */}
            <LinkedInJobMatcher result={analysisResult} />

            {/* 8. AI Career Coach Interactive Chat */}
            <CareerCoachChat
              career={analysisResult.career}
              readinessScore={analysisResult.readinessScore}
              studentSkills={studentSkills}
              evaluatedSkills={analysisResult.allEvaluatedSkills}
            />
          </div>
        )}
      </main>

      {/* Presentation Mode Slide Modal for Judges */}
      <PresentationModeModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        result={analysisResult}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
