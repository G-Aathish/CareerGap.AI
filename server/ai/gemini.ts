import { GoogleGenAI, Type } from '@google/genai';
import {
  JobDescriptionAnalysis,
  StudentSkill,
  EvaluatedSkill,
  CoachMessage,
  JobSearchResponse,
  SimulatedJobPosting,
  SuggestedLinkedInSearch
} from '../../shared/types.ts';

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const PRIMARY_MODEL = 'gemini-3.1-flash-lite';
const SECONDARY_MODEL = 'gemini-3.8-flash';

function withTimeout<T>(promise: Promise<T>, ms = 20000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`AI call timed out after ${ms}ms`)), ms)
    ),
  ]);
}

async function generateWithFallback(
  ai: GoogleGenAI,
  params: { contents: any; config?: any },
  timeoutMs = 20000
) {
  try {
    return await withTimeout(
      ai.models.generateContent({
        model: PRIMARY_MODEL,
        contents: params.contents,
        config: params.config,
      }),
      timeoutMs
    );
  } catch (_primaryErr) {
    // If primary model times out or encounters quota limit, try secondary model
    return await withTimeout(
      ai.models.generateContent({
        model: SECONDARY_MODEL,
        contents: params.contents,
        config: params.config,
      }),
      timeoutMs
    );
  }
}

export async function extractJobSkills(jobText: string): Promise<JobDescriptionAnalysis> {
  const fallback: JobDescriptionAnalysis = extractJobSkillsRuleBased(jobText);
  const ai = getGeminiClient();

  if (!ai) {
    return fallback;
  }

  try {
    const prompt = `Analyze this job description for a software/technology role. Extract key technical and professional requirements:
Job Description:
"""${jobText.slice(0, 3000)}"""

Respond ONLY with a JSON object matching this schema.`;

    const response = await generateWithFallback(
      ai,
      {
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              requiredSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Mandatory technical skills and languages',
              },
              preferredSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Bonus, preferred or nice-to-have skills',
              },
              technologies: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Specific frameworks, libraries, tools, and platforms',
              },
              softSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Interpersonal, communication, or methodology skills',
              },
              experienceRequirements: {
                type: Type.STRING,
                description: 'Years of experience or seniority required',
              },
            },
            required: ['requiredSkills', 'technologies'],
          },
        },
      },
      20000
    );

    const parsed = JSON.parse(response.text || '{}');
    return {
      requiredSkills: Array.isArray(parsed.requiredSkills) ? parsed.requiredSkills : fallback.requiredSkills,
      preferredSkills: Array.isArray(parsed.preferredSkills) ? parsed.preferredSkills : fallback.preferredSkills,
      technologies: Array.isArray(parsed.technologies) ? parsed.technologies : fallback.technologies,
      softSkills: Array.isArray(parsed.softSkills) ? parsed.softSkills : fallback.softSkills,
      experienceRequirements: parsed.experienceRequirements || fallback.experienceRequirements,
      jobRelevantSkillsMatched: [],
      additionalSkillsRequested: [],
    };
  } catch (_err) {
    return fallback;
  }
}

// Deterministic rule-based fallback for job description analysis
export function extractJobSkillsRuleBased(text: string): JobDescriptionAnalysis {
  const lower = text.toLowerCase();
  const knownSkills = [
    'java', 'python', 'c++', 'c', 'javascript', 'typescript', 'react', 'node.js', 'angular', 'vue',
    'spring boot', 'django', 'fastapi', 'rest api', 'sql', 'postgresql', 'mysql', 'docker', 'kubernetes',
    'git', 'github', 'aws', 'gcp', 'azure', 'linux', 'data structures', 'algorithms', 'oop',
    'ci/cd', 'microservices', 'redis', 'graphql', 'html', 'css', 'machine learning', 'siem'
  ];

  const foundSkills: string[] = [];
  for (const s of knownSkills) {
    if (new RegExp(`\\b${s.replace('+', '\\+')}\\b`, 'i').test(lower)) {
      foundSkills.push(s.charAt(0).toUpperCase() + s.slice(1));
    }
  }

  return {
    requiredSkills: foundSkills.slice(0, 6),
    preferredSkills: foundSkills.slice(6, 10),
    technologies: foundSkills.filter(s => ['Docker', 'Kubernetes', 'Git', 'GitHub', 'AWS', 'GCP', 'Postgresql'].includes(s)),
    softSkills: ['Problem Solving', 'Communication', 'Teamwork', 'Agile/Scrum'],
    experienceRequirements: text.match(/(\d+\+?\s*(?:to\s*\d+\s*)?years?)/i)?.[1] || 'Entry to Mid Level',
    jobRelevantSkillsMatched: [],
    additionalSkillsRequested: [],
  };
}

export async function generateAICareerAdvice(
  career: string,
  readinessScore: number,
  studentSkills: StudentSkill[],
  evaluatedSkills: EvaluatedSkill[],
  jobDescription?: string
): Promise<{ advice: string; aiEnhanced: boolean }> {
  const ai = getGeminiClient();

  const missingList = evaluatedSkills
    .filter(s => s.status === 'Missing')
    .map(s => `${s.skillName} (Importance: ${Math.round(s.importance * 100)}%)`)
    .slice(0, 5)
    .join(', ');

  const partialList = evaluatedSkills
    .filter(s => s.status === 'Partial')
    .map(s => `${s.skillName} (Current: ${s.currentProficiency})`)
    .slice(0, 5)
    .join(', ');

  const matchedList = evaluatedSkills
    .filter(s => s.status === 'Matched')
    .map(s => s.skillName)
    .join(', ');

  // Fallback advice if Gemini is unavailable
  const fallbackAdvice = `Based on our career benchmark for ${career}, your current skill alignment is ${readinessScore}%. ` +
    `Your foundation in ${matchedList || 'core programming'} gives you direct momentum. ` +
    `Your highest priority is to close the gap on ${missingList || 'target frameworks'}, transitioning from conceptual knowledge to production projects. ` +
    `Prioritize hands-on repository building over passive tutorials to demonstrate verified competence to hiring teams.`;

  if (!ai) {
    return { advice: fallbackAdvice, aiEnhanced: false };
  }

  try {
    const prompt = `You are the lead technical career advisor for CareerGap AI at HackNova'26. Provide razor-sharp, actionable career guidance for a student targeting the ${career} role.

Student Profile:
- Career Readiness Score: ${readinessScore}%
- Verified Current Skills: ${studentSkills.map(s => `${s.name} (${s.proficiency})`).join(', ') || 'None specified'}
- Matched Career Skills: ${matchedList || 'None yet'}
- Partial Skills Needing Upgrade: ${partialList || 'None'}
- Critical Missing Gaps: ${missingList || 'None'}
${jobDescription ? `- Employer Job Description Context: "${jobDescription.slice(0, 600)}"` : ''}

Instructions:
1. Deliver 2 concise, highly specific, professional paragraphs.
2. Acknowledge transferable strengths from what they already know.
3. Call out their #1 highest-leverage gap to learn immediately and why.
4. Recommend a specific concrete project pattern to build.
Avoid generic platitudes. Speak directly and objectively.`;

    const response = await generateWithFallback(ai, { contents: prompt }, 20000);

    return {
      advice: response.text?.trim() || fallbackAdvice,
      aiEnhanced: true,
    };
  } catch (_err) {
    return { advice: fallbackAdvice, aiEnhanced: false };
  }
}

export async function askCareerCoach(
  userQuery: string,
  history: CoachMessage[],
  context: {
    career: string;
    readinessScore: number;
    studentSkills: StudentSkill[];
    evaluatedSkills: EvaluatedSkill[];
  }
): Promise<{ reply: string; aiEnhanced: boolean }> {
  const ai = getGeminiClient();

  const topGaps = context.evaluatedSkills
    .filter(s => s.status !== 'Matched')
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 4)
    .map(s => `${s.skillName} (${s.priority} priority, gap: ${Math.round(s.gap * 100)}%)`)
    .join(', ');

  const matched = context.evaluatedSkills
    .filter(s => s.status === 'Matched')
    .map(s => s.skillName)
    .join(', ');

  const deterministicFallbackReply = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('learn first') || q.includes('what should i learn')) {
      return `For a ${context.career}, your immediate focus should be on **${topGaps.split(',')[0] || 'Core Architecture'}**. Closing this gap moves your readiness score from ${context.readinessScore}% towards job proficiency faster than any other single skill.`;
    }
    if (q.includes('job ready') || q.includes('ready for a')) {
      return `Your current readiness score is **${context.readinessScore}%**. You have verified proficiency in ${matched || 'baseline tools'}, but hiring managers will expect depth in ${topGaps}. With focused 6-week roadmap execution, you can bridge these gaps with deployed portfolio code.`;
    }
    if (q.includes('project')) {
      return `To showcase readiness for ${context.career}, build a complete full-stack or backend service integrating ${matched ? matched.split(',')[0] : 'your core language'} with ${topGaps.split('(')[0] || 'REST APIs'}. Include automated test suites, Docker configuration, and a well-documented README.`;
    }
    return `Based on your ${context.career} evaluation (${context.readinessScore}% readiness), your primary objectives are: 1) Master ${topGaps || 'missing core skills'}, 2) Build end-to-end projects demonstrating these competencies, and 3) Leverage your background in ${matched || 'existing skills'} as a transferable foundation.`;
  };

  if (!ai) {
    return {
      reply: deterministicFallbackReply(userQuery),
      aiEnhanced: false,
    };
  }

  try {
    const systemPrompt = `You are CareerGap AI's embedded Career Coach for HackNova'26.
You are advising a student targeting: ${context.career}.
Readiness Score: ${context.readinessScore}%.
Student's Current Skills: ${context.studentSkills.map(s => `${s.name} (${s.proficiency})`).join(', ') || 'None'}.
Matched Skills: ${matched || 'None'}.
Top Priority Gaps: ${topGaps || 'None'}.

Rules:
- Be clear, practical, direct, and encouraging without generic fluff.
- Always ground your answer in their actual skills and gaps.
- Use clean Markdown with bolding and bullet points where helpful.
- Keep answers under 180 words so they are quick and easy to read during live demonstrations.`;

    const recentConversation = history
      .slice(-4)
      .map(m => `${m.role === 'user' ? 'Student' : 'Coach'}: ${m.content}`)
      .join('\n');

    const prompt = `${systemPrompt}\n\nRecent context:\n${recentConversation}\n\nStudent asks: "${userQuery}"\nCoach:`;

    const response = await generateWithFallback(ai, { contents: prompt }, 20000);

    return {
      reply: response.text?.trim() || deterministicFallbackReply(userQuery),
      aiEnhanced: true,
    };
  } catch (_err) {
    return {
      reply: deterministicFallbackReply(userQuery),
      aiEnhanced: false,
    };
  }
}

export function buildLinkedInUrlHelper(params: {
  keywords: string;
  location?: string;
  expLevel?: string;
  workplaceType?: string;
  company?: string;
}): string {
  let query = params.keywords.trim();
  if (params.company) {
    query = `${params.company} ${query}`;
  }
  const searchParams = new URLSearchParams();
  searchParams.set('keywords', query);

  if (params.location && params.location !== 'Worldwide') {
    searchParams.set('location', params.location);
  }
  if (params.expLevel === 'entry-level') {
    searchParams.set('f_E', '2');
  } else if (params.expLevel === 'internship') {
    searchParams.set('f_E', '1');
  } else if (params.expLevel === 'associate') {
    searchParams.set('f_E', '3');
  }

  if (params.workplaceType === 'Remote') {
    searchParams.set('f_WT', '2');
  } else if (params.workplaceType === 'Hybrid') {
    searchParams.set('f_WT', '3');
  } else if (params.workplaceType === 'On-site') {
    searchParams.set('f_WT', '1');
  }

  searchParams.set('sortBy', 'DD');
  return `https://www.linkedin.com/jobs/search/?${searchParams.toString()}`;
}

function generateSimulatedJobPostingsFallback(
  career: string,
  missingSkills: string[],
  matchedSkills: string[] = [],
  location: string = 'Worldwide'
): JobSearchResponse {
  const norm = (career || 'Software Engineer').toLowerCase();
  const topGaps = missingSkills.slice(0, 3);
  const topMatches = matchedSkills.slice(0, 3);

  // Default company templates tailored by tech profile
  const isJava = norm.includes('java') || norm.includes('backend');
  const isWeb = norm.includes('web') || norm.includes('frontend') || norm.includes('full stack');
  const isCloud = norm.includes('cloud') || norm.includes('devops');
  const isData = norm.includes('data') || norm.includes('ai') || norm.includes('machine learning');

  interface RawTemplate {
    id: string;
    title: string;
    company: string;
    companyTier: 'Top Tech' | 'Enterprise' | 'FinTech' | 'Cloud Leader' | 'Startup' | 'Global IT';
    location: string;
    workplaceType: 'Remote' | 'Hybrid' | 'On-site';
    experienceLevel: 'Entry-Level' | 'Associate' | 'Mid-Level' | 'Intern';
    salaryRange: string;
    descriptionSnippet: string;
    roleMissing: string[];
    roleMatched: string[];
    fitScore: number;
    recommendationReason: string;
  }

  let templates: RawTemplate[] = [];

  if (isJava) {
    templates = [
      {
        id: 'job-amazon-java',
        title: 'Software Development Engineer I (Java)',
        company: 'Amazon',
        companyTier: 'Top Tech',
        location: 'Seattle, WA / Multiple',
        workplaceType: 'Hybrid',
        experienceLevel: 'Entry-Level',
        salaryRange: '$125,000 - $160,000',
        descriptionSnippet: 'Build high-volume distributed backend microservices powering AWS and Amazon retail customer orders using Java and AWS cloud architectures.',
        roleMatched: topMatches.length ? topMatches : ['Java', 'OOP', 'Data Structures'],
        roleMissing: topGaps.length ? topGaps.slice(0, 2) : ['Spring Boot', 'AWS'],
        fitScore: 78,
        recommendationReason: `Your core background matches Amazon's engineering bar; adding ${topGaps[0] || 'Spring Boot'} will make your application highly competitive.`,
      },
      {
        id: 'job-jpmorgan-java',
        title: 'Java Software Engineer (Associate)',
        company: 'JPMorgan Chase & Co.',
        companyTier: 'FinTech',
        location: 'Plano, TX / New York, NY / Remote',
        workplaceType: 'Hybrid',
        experienceLevel: 'Associate',
        salaryRange: '$95,000 - $130,000',
        descriptionSnippet: 'Develop mission-critical transactional banking microservices handling real-time payments, ledger sync, and RESTful API communications.',
        roleMatched: topMatches.length ? topMatches : ['Java', 'SQL', 'REST API'],
        roleMissing: topGaps.length ? topGaps.slice(0, 2) : ['Spring Boot', 'Microservices'],
        fitScore: 75,
        recommendationReason: `Great entry-to-associate trajectory for Java specialists with strong automated testing and data structures knowledge.`,
      },
      {
        id: 'job-spotify-java',
        title: 'Associate Backend Engineer (Java & Cloud)',
        company: 'Spotify',
        companyTier: 'Top Tech',
        location: 'Remote / New York, NY',
        workplaceType: 'Remote',
        experienceLevel: 'Entry-Level',
        salaryRange: '$110,000 - $145,000',
        descriptionSnippet: 'Work with the playback and audio streaming infrastructure engineering teams building resilient Java services and high-scale APIs.',
        roleMatched: topMatches.length ? topMatches : ['Java', 'Git', 'REST API'],
        roleMissing: topGaps.length ? topGaps.slice(0, 2) : ['Docker', 'Cloud Services'],
        fitScore: 82,
        recommendationReason: `Fully remote role offering outstanding mentorship for early-career developers closing cloud deployment gaps.`,
      },
      {
        id: 'job-capitalone-java',
        title: 'Associate Software Engineer (Java / Cloud)',
        company: 'Capital One',
        companyTier: 'FinTech',
        location: 'McLean, VA / Richmond, VA',
        workplaceType: 'Hybrid',
        experienceLevel: 'Entry-Level',
        salaryRange: '$100,000 - $135,000',
        descriptionSnippet: '100% cloud-native financial services team building resilient APIs, real-time fraud checks, and modern event-driven Java pipelines.',
        roleMatched: topMatches.length ? topMatches : ['Java', 'OOP', 'SQL'],
        roleMissing: topGaps.length ? topGaps.slice(0, 2) : ['REST API', 'Spring Boot'],
        fitScore: 80,
        recommendationReason: `Capital One is renowned for early career developer programs with direct mentorship on modern cloud tech.`,
      },
    ];
  } else if (isWeb) {
    templates = [
      {
        id: 'job-stripe-web',
        title: 'Full Stack Software Engineer - Merchant UI',
        company: 'Stripe',
        companyTier: 'Top Tech',
        location: 'San Francisco, CA / Remote',
        workplaceType: 'Remote',
        experienceLevel: 'Entry-Level',
        salaryRange: '$135,000 - $175,000',
        descriptionSnippet: 'Craft delightful payment dashboards, merchant reporting workflows, and developer onboarding portals using modern TypeScript and React.',
        roleMatched: topMatches.length ? topMatches : ['JavaScript', 'HTML', 'CSS'],
        roleMissing: topGaps.length ? topGaps.slice(0, 2) : ['React', 'TypeScript'],
        fitScore: 80,
        recommendationReason: `Stripe's benchmark values clean UI craftsmanship; completing a full-stack project closing ${topGaps[0] || 'React'} positions you well.`,
      },
      {
        id: 'job-shopify-web',
        title: 'Web Developer - Merchant Experience',
        company: 'Shopify',
        companyTier: 'Enterprise',
        location: 'Remote (Worldwide)',
        workplaceType: 'Remote',
        experienceLevel: 'Entry-Level',
        salaryRange: '$90,000 - $125,000',
        descriptionSnippet: 'Build responsive web apps and storefront components powering millions of global merchants with modern JavaScript, GraphQL, and component libraries.',
        roleMatched: topMatches.length ? topMatches : ['HTML', 'CSS', 'JavaScript'],
        roleMissing: topGaps.length ? topGaps.slice(0, 2) : ['React', 'Git'],
        fitScore: 84,
        recommendationReason: `100% remote-first company with high empathy for early career talent and modern front-end stacks.`,
      },
      {
        id: 'job-datadog-web',
        title: 'Frontend Software Engineer I',
        company: 'Datadog',
        companyTier: 'Top Tech',
        location: 'New York, NY / Remote',
        workplaceType: 'Hybrid',
        experienceLevel: 'Entry-Level',
        salaryRange: '$115,000 - $150,000',
        descriptionSnippet: 'Design real-time observability telemetry graphs, interactive log analyzers, and responsive dashboards for DevOps and cloud teams.',
        roleMatched: topMatches.length ? topMatches : ['JavaScript', 'TypeScript', 'CSS'],
        roleMissing: topGaps.length ? topGaps.slice(0, 2) : ['React', 'Data Visualization'],
        fitScore: 76,
        recommendationReason: `High-growth infrastructure team where modern component architecture and clean state management shine.`,
      },
    ];
  } else if (isCloud) {
    templates = [
      {
        id: 'job-aws-cloud',
        title: 'Cloud Support Associate / Systems Engineer',
        company: 'Amazon Web Services (AWS)',
        companyTier: 'Cloud Leader',
        location: 'Herndon, VA / Dallas, TX / Remote',
        workplaceType: 'Hybrid',
        experienceLevel: 'Entry-Level',
        salaryRange: '$95,000 - $130,000',
        descriptionSnippet: 'Troubleshoot complex enterprise cloud architectures, automate infrastructure provisioning, and build containerized solutions on AWS.',
        roleMatched: topMatches.length ? topMatches : ['Linux', 'Networking', 'Git'],
        roleMissing: topGaps.length ? topGaps.slice(0, 2) : ['Docker', 'CI/CD Pipelines'],
        fitScore: 76,
        recommendationReason: `Premier launchpad to master large-scale distributed systems and enterprise infrastructure.`,
      },
      {
        id: 'job-cloudflare-cloud',
        title: 'Associate Cloud Systems Engineer',
        company: 'Cloudflare',
        companyTier: 'Cloud Leader',
        location: 'Austin, TX / San Francisco, CA / Remote',
        workplaceType: 'Remote',
        experienceLevel: 'Entry-Level',
        salaryRange: '$110,000 - $140,000',
        descriptionSnippet: 'Help protect and accelerate millions of websites through global edge network engineering, DNS, and serverless compute.',
        roleMatched: topMatches.length ? topMatches : ['Networking', 'Linux', 'Security'],
        roleMissing: topGaps.length ? topGaps.slice(0, 2) : ['Docker', 'Kubernetes'],
        fitScore: 78,
        recommendationReason: `Exceptional opportunity to learn edge networking and modern serverless platforms.`,
      },
    ];
  } else {
    // General tech / software engineering role
    templates = [
      {
        id: 'job-google-swe',
        title: `Software Engineer, Early Career (${career})`,
        company: 'Google',
        companyTier: 'Top Tech',
        location: 'Mountain View, CA / New York, NY / Remote',
        workplaceType: 'Hybrid',
        experienceLevel: 'Entry-Level',
        salaryRange: '$130,000 - $175,000',
        descriptionSnippet: `Build scalable features and distributed systems supporting millions of users across core ${career} products.`,
        roleMatched: topMatches.length ? topMatches : ['Problem Solving', 'Data Structures', 'Git'],
        roleMissing: topGaps.length ? topGaps.slice(0, 2) : ['Cloud Deployment', 'System Architecture'],
        fitScore: 75,
        recommendationReason: `Google values fundamental problem solving; building projects addressing your gap skills will help you pass screening.`,
      },
      {
        id: 'job-atlassian-swe',
        title: `Associate Software Engineer (${career})`,
        company: 'Atlassian',
        companyTier: 'Enterprise',
        location: 'Remote (Worldwide) / San Francisco / Sydney',
        workplaceType: 'Remote',
        experienceLevel: 'Entry-Level',
        salaryRange: '$105,000 - $140,000',
        descriptionSnippet: `Collaborate across global teams building modern developer and collaboration software with modern cloud-first tech.`,
        roleMatched: topMatches.length ? topMatches : ['Programming Fundamentals', 'Git'],
        roleMissing: topGaps.length ? topGaps.slice(0, 2) : ['Modern Frameworks', 'Testing'],
        fitScore: 82,
        recommendationReason: `Atlassian offers a remote-first culture with an established graduate and associate onboarding framework.`,
      },
      {
        id: 'job-datadog-swe',
        title: `Software Engineer I (${career})`,
        company: 'Datadog',
        companyTier: 'Top Tech',
        location: 'New York, NY / Boston, MA / Remote',
        workplaceType: 'Hybrid',
        experienceLevel: 'Entry-Level',
        salaryRange: '$115,000 - $150,000',
        descriptionSnippet: `Work on distributed microservices, APIs, and modern data processing engines handling trillions of events every day.`,
        roleMatched: topMatches.length ? topMatches : ['Coding Skills', 'Databases'],
        roleMissing: topGaps.length ? topGaps.slice(0, 2) : ['Microservices', 'Docker'],
        fitScore: 78,
        recommendationReason: `High-velocity engineering environment with active hiring for junior engineers ready to learn.`,
      },
    ];
  }

  const jobs: SimulatedJobPosting[] = templates.map((t) => ({
    id: t.id,
    title: t.title,
    company: t.company,
    companyTier: t.companyTier,
    location: t.location,
    workplaceType: t.workplaceType,
    experienceLevel: t.experienceLevel,
    salaryRange: t.salaryRange,
    descriptionSnippet: t.descriptionSnippet,
    matchedSkills: t.roleMatched,
    missingSkillsRequired: t.roleMissing,
    fitScore: t.fitScore,
    recommendationReason: t.recommendationReason,
    linkedinSearchUrl: buildLinkedInUrlHelper({
      keywords: `${t.company} ${t.title}`,
      location,
      expLevel: 'entry-level',
    }),
  }));

  const primaryMissing = missingSkills[0] || 'Modern Tech';
  const primaryMatched = matchedSkills[0] || 'Core Skills';

  const suggestedLinkedInSearches: SuggestedLinkedInSearch[] = [
    {
      label: `Skill Bridge: ${career} + ${primaryMissing}`,
      query: `"${career}" AND "${primaryMissing}"`,
      url: buildLinkedInUrlHelper({
        keywords: `${career} ${primaryMissing}`,
        location,
        expLevel: 'entry-level',
      }),
      description: `Target postings specifically seeking or teaching ${primaryMissing}, perfect as you finish this learning milestone.`,
    },
    {
      label: `Current Match: ${career} + ${primaryMatched}`,
      query: `"${career}" AND "${primaryMatched}"`,
      url: buildLinkedInUrlHelper({
        keywords: `${career} ${primaryMatched}`,
        location,
        expLevel: 'entry-level',
      }),
      description: `Jobs prioritizing skills you already have, maximizing immediate interview readiness.`,
    },
    {
      label: `Entry-Level ${career} Postings`,
      query: `${career} (Entry Level)`,
      url: buildLinkedInUrlHelper({
        keywords: career,
        location,
        expLevel: 'entry-level',
      }),
      description: `All junior, graduate, and associate postings on LinkedIn with 0-2 years experience filter.`,
    },
    {
      label: `Remote-First ${career} Roles`,
      query: `${career} (Remote)`,
      url: buildLinkedInUrlHelper({
        keywords: career,
        location,
        workplaceType: 'Remote',
      }),
      description: `Companies hiring remote developers worldwide in this domain.`,
    },
  ];

  return {
    career,
    totalFound: jobs.length,
    jobs,
    aiEnhanced: false,
    suggestedLinkedInSearches,
  };
}

export async function searchJobsWithGemini(
  career: string,
  missingSkills: string[],
  matchedSkills: string[] = [],
  location: string = 'Worldwide'
): Promise<JobSearchResponse> {
  const fallback = generateSimulatedJobPostingsFallback(career, missingSkills, matchedSkills, location);
  const ai = getGeminiClient();

  if (!ai) {
    return fallback;
  }

  try {
    const prompt = `You are an AI Job Matching & Talent Intelligence Engine for software engineering students.
Career Role Target: "${career}".
Candidate's Verified Matched Skills: ${matchedSkills.length ? matchedSkills.join(', ') : 'Basic programming & computer science'}.
Candidate's Identified Skill Gaps / Missing Skills: ${missingSkills.length ? missingSkills.join(', ') : 'None'}.
Preferred Location: "${location}".

Simulate a realistic search of 3 to 4 real-world tech job postings currently hiring for early career / associate candidates in this field.
Ensure:
1. Real reputable tech companies (e.g. Amazon, Google, Stripe, JPMorgan, Atlassian, Spotify, Datadog, Capital One, Cloudflare, Oracle, Shopify, etc.).
2. Roles must genuinely match the candidate's career: "${career}".
3. Indicate which of the candidate's skills are matched, and which of their missing skills this employer would expect them to learn.
4. Provide a realistic salary range, workplace type (Remote, Hybrid, On-site), and location.
5. Provide a 2-sentence description snippet of what the team builds.
6. Calculate an estimated fit score (60 to 95) based on the skill match.
7. Provide a 1-sentence personalized recommendation on why this role is suitable and how bridging the missing skills prepares them.

Respond ONLY with a JSON object matching this schema.`;

    const response = await generateWithFallback(
      ai,
      {
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              jobs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    company: { type: Type.STRING },
                    companyTier: {
                      type: Type.STRING,
                      enum: ['Top Tech', 'Enterprise', 'FinTech', 'Cloud Leader', 'Startup', 'Global IT'],
                    },
                    location: { type: Type.STRING },
                    workplaceType: {
                      type: Type.STRING,
                      enum: ['Remote', 'Hybrid', 'On-site'],
                    },
                    experienceLevel: {
                      type: Type.STRING,
                      enum: ['Entry-Level', 'Associate', 'Mid-Level', 'Intern'],
                    },
                    salaryRange: { type: Type.STRING },
                    descriptionSnippet: { type: Type.STRING },
                    matchedSkills: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    missingSkillsRequired: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    fitScore: { type: Type.INTEGER },
                    recommendationReason: { type: Type.STRING },
                  },
                  required: [
                    'id',
                    'title',
                    'company',
                    'location',
                    'workplaceType',
                    'experienceLevel',
                    'descriptionSnippet',
                    'matchedSkills',
                    'missingSkillsRequired',
                    'fitScore',
                    'recommendationReason',
                  ],
                },
              },
            },
            required: ['jobs'],
          },
        },
      },
      20000
    );

    const parsedText = response.text?.trim();
    if (!parsedText) {
      return fallback;
    }

    const data = JSON.parse(parsedText);
    if (!Array.isArray(data.jobs) || data.jobs.length === 0) {
      return fallback;
    }

    // Map and enrich with live LinkedIn search URLs
    const jobs: SimulatedJobPosting[] = data.jobs.map((j: any, index: number) => ({
      id: j.id || `sim-job-${index}`,
      title: j.title || `${career} Associate`,
      company: j.company || 'Tech Employer',
      companyTier: j.companyTier || 'Top Tech',
      location: j.location || 'Remote / Worldwide',
      workplaceType: (['Remote', 'Hybrid', 'On-site'].includes(j.workplaceType) ? j.workplaceType : 'Hybrid') as any,
      experienceLevel: (['Entry-Level', 'Associate', 'Mid-Level', 'Intern'].includes(j.experienceLevel) ? j.experienceLevel : 'Entry-Level') as any,
      salaryRange: j.salaryRange || '$95,000 - $130,000',
      descriptionSnippet: j.descriptionSnippet || 'Developing high-throughput services and customer-facing components.',
      matchedSkills: Array.isArray(j.matchedSkills) && j.matchedSkills.length ? j.matchedSkills : (matchedSkills.slice(0, 3) || ['Core Programming']),
      missingSkillsRequired: Array.isArray(j.missingSkillsRequired) && j.missingSkillsRequired.length ? j.missingSkillsRequired : (missingSkills.slice(0, 2) || ['Cloud Frameworks']),
      fitScore: typeof j.fitScore === 'number' ? Math.min(Math.max(j.fitScore, 50), 98) : 75,
      recommendationReason: j.recommendationReason || `Strong alignment with ${career} foundations with growth potential in missing technical competencies.`,
      linkedinSearchUrl: buildLinkedInUrlHelper({
        keywords: `${j.company} ${j.title}`,
        location,
        expLevel: 'entry-level',
      }),
    }));

    const primaryMissing = missingSkills[0] || 'Cloud & APIs';
    const primaryMatched = matchedSkills[0] || 'Core Fundamentals';

    const suggestedLinkedInSearches: SuggestedLinkedInSearch[] = [
      {
        label: `Skill Bridge: ${career} + ${primaryMissing}`,
        query: `"${career}" AND "${primaryMissing}"`,
        url: buildLinkedInUrlHelper({
          keywords: `${career} ${primaryMissing}`,
          location,
          expLevel: 'entry-level',
        }),
        description: `Target postings specifically seeking or ramping up on ${primaryMissing}, perfect as you close this skill gap.`,
      },
      {
        label: `Current Match: ${career} + ${primaryMatched}`,
        query: `"${career}" AND "${primaryMatched}"`,
        url: buildLinkedInUrlHelper({
          keywords: `${career} ${primaryMatched}`,
          location,
          expLevel: 'entry-level',
        }),
        description: `Jobs prioritizing skills you already have, maximizing immediate interview readiness.`,
      },
      {
        label: `Entry-Level ${career} Postings`,
        query: `${career} (Entry Level)`,
        url: buildLinkedInUrlHelper({
          keywords: career,
          location,
          expLevel: 'entry-level',
        }),
        description: `All junior, graduate, and associate postings on LinkedIn with 0-2 years experience filter.`,
      },
      {
        label: `Remote-First ${career} Roles`,
        query: `${career} (Remote)`,
        url: buildLinkedInUrlHelper({
          keywords: career,
          location,
          workplaceType: 'Remote',
        }),
        description: `Companies hiring remote developers worldwide in this domain.`,
      },
    ];

    return {
      career,
      totalFound: jobs.length,
      jobs,
      aiEnhanced: true,
      suggestedLinkedInSearches,
    };
  } catch (_err) {
    return fallback;
  }
}
