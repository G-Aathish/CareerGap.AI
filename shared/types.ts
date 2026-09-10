export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced';

export interface StudentSkill {
  name: string;
  proficiency: SkillProficiency;
}

export interface Career {
  id: string;
  name: string;
  description: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
}

export interface CareerSkillRequirement {
  id?: number;
  career_id: string;
  skill_id: string;
  skill_name: string;
  required_level: number; // 0.3, 0.6, 0.8, 1.0
  importance: number; // 0.1 to 1.0
  category: string;
}

export interface SkillRelationship {
  id?: number;
  from_skill: string;
  to_skill: string;
  relationship_type: string; // e.g. 'prerequisite', 'foundation', 'enhances', 'specializes'
  description: string;
}

export type GapStatus = 'Matched' | 'Partial' | 'Missing';
export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface EvaluatedSkill {
  skillName: string;
  category: string;
  currentLevel: number; // 0, 0.3, 0.6, 1.0
  currentProficiency?: SkillProficiency;
  requiredLevel: number;
  gap: number; // max(requiredLevel - currentLevel, 0)
  status: GapStatus;
  importance: number;
  jobRelevance: number; // 1.0 if mentioned in JD, 0.5 otherwise
  priorityScore: number; // 0 - 100
  priority: PriorityLevel;
  reason: string;
}

export interface TransferableChain {
  existingSkill: string;
  targetSkill: string;
  bridgeSteps: string[];
  description: string;
}

export interface RoadmapWeek {
  week: number;
  title: string;
  focusSkill: string;
  goal: string;
  task: string;
  milestone: string;
  estimatedHours: number;
  resourceSuggestion?: string;
}

export interface JobDescriptionAnalysis {
  requiredSkills: string[];
  preferredSkills: string[];
  technologies: string[];
  softSkills: string[];
  experienceRequirements: string;
  jobRelevantSkillsMatched: string[];
  additionalSkillsRequested: string[];
}

export interface AnalysisResult {
  isDemo: boolean;
  career: string;
  careerDescription: string;
  readinessScore: number;
  scoreBreakdown: {
    matchedCount: number;
    partialCount: number;
    missingCount: number;
    highPriorityCount: number;
  };
  matchedSkills: EvaluatedSkill[];
  partialSkills: EvaluatedSkill[];
  missingSkills: EvaluatedSkill[];
  allEvaluatedSkills: EvaluatedSkill[];
  prioritizedGaps: EvaluatedSkill[];
  transferableChains: TransferableChain[];
  roadmap: RoadmapWeek[];
  aiAdvice: string;
  aiEnhanced: boolean;
  jobAnalysis?: JobDescriptionAnalysis;
  disclaimer: string;
}

export interface CoachMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  aiEnhanced?: boolean;
}

export interface CompanyHiringProfile {
  id: string;
  companyName: string;
  logoLetter: string;
  badgeBg: string;
  industry: string;
  careersSupported: string[];
  featuredRole: string;
  hiringTier: 'Top Tech' | 'Enterprise' | 'FinTech' | 'Cloud Leader' | 'Global IT' | 'Startup / Scaleup';
  typicalHiringBar: number;
  experienceLevel: 'Intern' | 'Entry-Level' | 'Associate' | 'Mid-Level';
  location: string;
  workplaceType: 'Remote' | 'Hybrid' | 'On-site';
  salaryRange?: string;
  keySkills: string[];
  whySuitable: string;
  linkedinSearchQuery: string;
}

export interface LinkedInSearchFilter {
  keywords: string;
  location: string;
  experienceLevels: string[];
  workplaceTypes: string[];
  sortBy: 'relevance' | 'date';
}

export interface SimulatedJobPosting {
  id: string;
  title: string;
  company: string;
  companyTier?: 'Top Tech' | 'Enterprise' | 'FinTech' | 'Cloud Leader' | 'Startup' | 'Global IT';
  location: string;
  workplaceType: 'Remote' | 'Hybrid' | 'On-site';
  experienceLevel: 'Entry-Level' | 'Associate' | 'Mid-Level' | 'Intern';
  salaryRange?: string;
  descriptionSnippet: string;
  matchedSkills: string[];
  missingSkillsRequired: string[];
  fitScore: number;
  recommendationReason: string;
  linkedinSearchUrl: string;
}

export interface SuggestedLinkedInSearch {
  label: string;
  query: string;
  url: string;
  description: string;
}

export interface JobSearchResponse {
  career: string;
  totalFound: number;
  jobs: SimulatedJobPosting[];
  aiEnhanced: boolean;
  suggestedLinkedInSearches: SuggestedLinkedInSearch[];
}
