import { CompanyHiringProfile } from '../../shared/types.ts';

export const ALL_COMPANIES_HIRING: CompanyHiringProfile[] = [
  // Java Developer
  {
    id: 'amazon-java',
    companyName: 'Amazon',
    logoLetter: 'A',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    industry: 'Cloud & E-Commerce Big Tech',
    careersSupported: ['Java Developer', 'Full Stack Developer', 'Cloud Engineer', 'DevOps Engineer'],
    featuredRole: 'Software Development Engineer I (Java)',
    hiringTier: 'Top Tech',
    typicalHiringBar: 75,
    experienceLevel: 'Entry-Level',
    location: 'Seattle, WA / Multiple / Remote Option',
    workplaceType: 'Hybrid',
    salaryRange: '$120,000 - $165,000',
    keySkills: ['Java', 'Object-Oriented Programming', 'Spring Boot', 'Data Structures', 'REST APIs', 'AWS'],
    whySuitable: 'Massive enterprise Java services infrastructure with thousands of microservices powering AWS and Amazon retail.',
    linkedinSearchQuery: 'Amazon Software Development Engineer Java',
  },
  {
    id: 'jpmorgan-java',
    companyName: 'JPMorgan Chase',
    logoLetter: 'J',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    industry: 'Global Investment Banking & FinTech',
    careersSupported: ['Java Developer', 'Python Developer', 'Cybersecurity Analyst'],
    featuredRole: 'Java Software Engineer (Associate / Graduate)',
    hiringTier: 'FinTech',
    typicalHiringBar: 70,
    experienceLevel: 'Associate',
    location: 'New York, NY / Plano, TX / Bengaluru / London',
    workplaceType: 'Hybrid',
    salaryRange: '$95,000 - $135,000',
    keySkills: ['Java', 'Spring Boot', 'SQL', 'REST API', 'Git', 'Microservices'],
    whySuitable: 'One of the world\'s largest financial Java codebases handling trillions in daily global transaction volume.',
    linkedinSearchQuery: 'JPMorgan Chase Java Software Engineer Associate',
  },
  {
    id: 'oracle-java',
    companyName: 'Oracle',
    logoLetter: 'O',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-500/30',
    industry: 'Enterprise Cloud & Database Systems',
    careersSupported: ['Java Developer', 'Cloud Engineer', 'DevOps Engineer'],
    featuredRole: 'Backend Cloud Engineer (Java & OCI)',
    hiringTier: 'Enterprise',
    typicalHiringBar: 72,
    experienceLevel: 'Entry-Level',
    location: 'Austin, TX / Redwood City, CA / Remote',
    workplaceType: 'Hybrid',
    salaryRange: '$105,000 - $145,000',
    keySkills: ['Java', 'Database Fundamentals', 'SQL', 'Spring Boot', 'Docker', 'Linux'],
    whySuitable: 'The creator and steward of Java and Oracle Database. Core engineering roles focus deeply on JVM performance.',
    linkedinSearchQuery: 'Oracle Java Software Engineer Cloud',
  },
  {
    id: 'infosys-java',
    companyName: 'Infosys',
    logoLetter: 'I',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    industry: 'Global Technology Consulting & Services',
    careersSupported: ['Java Developer', 'Web Developer', 'Cloud Engineer', 'Data Analyst'],
    featuredRole: 'Specialist Programmer / Java Developer',
    hiringTier: 'Global IT',
    typicalHiringBar: 65,
    experienceLevel: 'Entry-Level',
    location: 'Indianapolis, IN / Bengaluru / Global',
    workplaceType: 'Hybrid',
    salaryRange: '$75,000 - $95,000',
    keySkills: ['Java', 'OOP', 'Spring Boot', 'SQL', 'HTML', 'REST API'],
    whySuitable: 'Top recruiter for fresh computer science graduates with structured onboarding and client deployment programs.',
    linkedinSearchQuery: 'Infosys Specialist Programmer Java Developer',
  },
  {
    id: 'cisco-java',
    companyName: 'Cisco',
    logoLetter: 'C',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    industry: 'Networking Hardware & Cloud Software',
    careersSupported: ['Java Developer', 'Cloud Engineer', 'Cybersecurity Analyst'],
    featuredRole: 'Software Engineer - Java Cloud Services',
    hiringTier: 'Enterprise',
    typicalHiringBar: 74,
    experienceLevel: 'Associate',
    location: 'San Jose, CA / Raleigh, NC / Remote',
    workplaceType: 'Remote',
    salaryRange: '$110,000 - $140,000',
    keySkills: ['Java', 'REST API', 'Networking', 'Spring Boot', 'Docker', 'Git'],
    whySuitable: 'High-reliability distributed networking controllers and security suites built in modern Java frameworks.',
    linkedinSearchQuery: 'Cisco Java Software Engineer',
  },
  {
    id: 'goldman-java',
    companyName: 'Goldman Sachs',
    logoLetter: 'G',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    industry: 'Investment Banking & Quantitative Trading',
    careersSupported: ['Java Developer', 'Data Scientist', 'Cybersecurity Analyst'],
    featuredRole: 'Engineering Analyst (Java Distributed Systems)',
    hiringTier: 'FinTech',
    typicalHiringBar: 78,
    experienceLevel: 'Entry-Level',
    location: 'New York, NY / Dallas, TX / Bengaluru',
    workplaceType: 'Hybrid',
    salaryRange: '$115,000 - $150,000',
    keySkills: ['Java', 'Data Structures', 'SQL', 'Concurrency', 'Algorithms', 'Spring'],
    whySuitable: 'Ultra-low-latency financial architecture demanding rock-solid algorithmic understanding and clean Java code.',
    linkedinSearchQuery: 'Goldman Sachs Java Software Engineer Analyst',
  },

  // Web Developer & Full Stack Developer
  {
    id: 'google-web',
    companyName: 'Google',
    logoLetter: 'G',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    industry: 'Search, Advertising & Cloud Platforms',
    careersSupported: ['Web Developer', 'Full Stack Developer', 'AI Engineer', 'Cloud Engineer'],
    featuredRole: 'Software Engineer - Frontend & Web Applications',
    hiringTier: 'Top Tech',
    typicalHiringBar: 80,
    experienceLevel: 'Entry-Level',
    location: 'Mountain View, CA / New York, NY / Remote',
    workplaceType: 'Hybrid',
    salaryRange: '$135,000 - $185,000',
    keySkills: ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'React', 'Data Structures'],
    whySuitable: 'Pioneers of the open web and modern browser standards with massive scale applications like Workspace and YouTube.',
    linkedinSearchQuery: 'Google Frontend Software Engineer Web',
  },
  {
    id: 'stripe-web',
    companyName: 'Stripe',
    logoLetter: 'S',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    industry: 'Financial Infrastructure & Developer Tools',
    careersSupported: ['Web Developer', 'Full Stack Developer', 'Python Developer'],
    featuredRole: 'Full Stack Software Engineer - Merchant UI',
    hiringTier: 'Top Tech',
    typicalHiringBar: 78,
    experienceLevel: 'Associate',
    location: 'San Francisco, CA / Seattle, WA / Remote',
    workplaceType: 'Remote',
    salaryRange: '$140,000 - $190,000',
    keySkills: ['React', 'TypeScript', 'Node.js', 'REST API', 'Authentication & JWT', 'CSS'],
    whySuitable: 'Celebrated for developer experience, meticulous design standards, and modern TypeScript architecture.',
    linkedinSearchQuery: 'Stripe Full Stack Engineer Frontend',
  },
  {
    id: 'shopify-web',
    companyName: 'Shopify',
    logoLetter: 'S',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    industry: 'Global E-Commerce Platforms',
    careersSupported: ['Web Developer', 'Full Stack Developer'],
    featuredRole: 'Web Developer (React / GraphQL)',
    hiringTier: 'Enterprise',
    typicalHiringBar: 72,
    experienceLevel: 'Entry-Level',
    location: 'Remote (Global) / Toronto / Ottawa',
    workplaceType: 'Remote',
    salaryRange: '$95,000 - $130,000',
    keySkills: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Git'],
    whySuitable: 'Digital-by-design company offering 100% remote software developer positions worldwide with modern web tech.',
    linkedinSearchQuery: 'Shopify Web Developer React Remote',
  },
  {
    id: 'atlassian-web',
    companyName: 'Atlassian',
    logoLetter: 'A',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    industry: 'Team Collaboration & Developer Tools',
    careersSupported: ['Web Developer', 'Full Stack Developer', 'Java Developer', 'DevOps Engineer'],
    featuredRole: 'Graduate / Associate Software Engineer',
    hiringTier: 'Enterprise',
    typicalHiringBar: 70,
    experienceLevel: 'Entry-Level',
    location: 'Remote / San Francisco / Sydney / Bengaluru',
    workplaceType: 'Remote',
    salaryRange: '$100,000 - $140,000',
    keySkills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'REST API', 'Git'],
    whySuitable: 'Creator of Jira, Confluence, and Trello. Exceptional culture for early career developers with remote-first autonomy.',
    linkedinSearchQuery: 'Atlassian Graduate Software Engineer Web',
  },

  // Cloud Engineer & DevOps
  {
    id: 'aws-cloud',
    companyName: 'Amazon Web Services (AWS)',
    logoLetter: 'A',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    industry: 'Public Cloud Infrastructure',
    careersSupported: ['Cloud Engineer', 'DevOps Engineer', 'Cybersecurity Analyst'],
    featuredRole: 'Cloud Support Associate / Systems Engineer',
    hiringTier: 'Cloud Leader',
    typicalHiringBar: 72,
    experienceLevel: 'Entry-Level',
    location: 'Herndon, VA / Dallas, TX / Dublin / Remote',
    workplaceType: 'Hybrid',
    salaryRange: '$90,000 - $125,000',
    keySkills: ['Linux', 'Networking', 'Docker', 'Python', 'Deployment & Hosting', 'CI/CD Pipelines'],
    whySuitable: 'The world\'s #1 cloud provider. Provides an unmatched training ground to build cloud architectures.',
    linkedinSearchQuery: 'AWS Cloud Support Associate Systems Engineer',
  },
  {
    id: 'microsoft-azure',
    companyName: 'Microsoft Azure',
    logoLetter: 'M',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    industry: 'Enterprise Cloud & Operating Systems',
    careersSupported: ['Cloud Engineer', 'DevOps Engineer', 'Java Developer', 'Web Developer'],
    featuredRole: 'Cloud Solution Engineer (Graduate)',
    hiringTier: 'Cloud Leader',
    typicalHiringBar: 74,
    experienceLevel: 'Entry-Level',
    location: 'Redmond, WA / Atlanta, GA / Remote',
    workplaceType: 'Hybrid',
    salaryRange: '$115,000 - $155,000',
    keySkills: ['Networking', 'Linux', 'Docker', 'Kubernetes', 'CI/CD Pipelines', 'Security'],
    whySuitable: 'Rapidly expanding enterprise cloud computing footprint with huge demand for certified cloud practitioners.',
    linkedinSearchQuery: 'Microsoft Azure Cloud Solutions Engineer Graduate',
  },

  // AI & Data Science
  {
    id: 'nvidia-ai',
    companyName: 'NVIDIA',
    logoLetter: 'N',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    industry: 'AI Hardware, GPU Acceleration & Deep Learning',
    careersSupported: ['AI Engineer', 'Machine Learning Engineer', 'Data Scientist'],
    featuredRole: 'AI Application & Solutions Engineer',
    hiringTier: 'Top Tech',
    typicalHiringBar: 82,
    experienceLevel: 'Entry-Level',
    location: 'Santa Clara, CA / Austin, TX / Remote',
    workplaceType: 'Hybrid',
    salaryRange: '$145,000 - $195,000',
    keySkills: ['Python', 'TensorFlow/PyTorch', 'Deep Learning', 'C', 'Linear Algebra', 'Machine Learning'],
    whySuitable: 'The foundation of the modern AI revolution. Engineering teams optimize LLM inference and generative models.',
    linkedinSearchQuery: 'NVIDIA AI Software Engineer Deep Learning',
  },
  {
    id: 'netflix-data',
    companyName: 'Netflix',
    logoLetter: 'N',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-500/30',
    industry: 'Streaming Media & Big Data Personalization',
    careersSupported: ['Data Scientist', 'Data Analyst', 'Python Developer'],
    featuredRole: 'Associate Data & Analytics Engineer',
    hiringTier: 'Top Tech',
    typicalHiringBar: 78,
    experienceLevel: 'Associate',
    location: 'Los Gatos, CA / Los Angeles, CA / Remote',
    workplaceType: 'Hybrid',
    salaryRange: '$130,000 - $175,000',
    keySkills: ['SQL', 'Python', 'Pandas', 'Statistics', 'Data Visualization', 'Tableau'],
    whySuitable: 'World-renowned data culture using predictive analytics and recommendations for 250M+ global subscribers.',
    linkedinSearchQuery: 'Netflix Data Analyst Data Science',
  },

  // Cybersecurity
  {
    id: 'crowdstrike-sec',
    companyName: 'CrowdStrike',
    logoLetter: 'C',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-500/30',
    industry: 'Cloud-Native Endpoint & Identity Security',
    careersSupported: ['Cybersecurity Analyst', 'Cloud Engineer', 'Python Developer'],
    featuredRole: 'Associate Threat Intelligence Analyst',
    hiringTier: 'Enterprise',
    typicalHiringBar: 70,
    experienceLevel: 'Entry-Level',
    location: 'Austin, TX / Sunnyvale, CA / Remote',
    workplaceType: 'Remote',
    salaryRange: '$85,000 - $120,000',
    keySkills: ['Networking', 'Linux', 'Cybersecurity Fundamentals', 'SIEM', 'Threat Detection', 'Incident Response'],
    whySuitable: 'Industry-leading Falcon platform detecting active threats in real time across Fortune 500 networks.',
    linkedinSearchQuery: 'CrowdStrike Associate Security Analyst Threat Intelligence',
  },
];

export function getCompaniesForCareer(careerName: string): CompanyHiringProfile[] {
  const norm = (careerName || '').toLowerCase().trim();

  // Find exact or substring career matches
  const directMatches = ALL_COMPANIES_HIRING.filter(c =>
    c.careersSupported.some(cs => cs.toLowerCase().includes(norm) || norm.includes(cs.toLowerCase()))
  );

  if (directMatches.length >= 3) {
    return directMatches;
  }

  // Fallback: If custom career or fewer matches, provide a solid selection adapted to the career
  const relevant = ALL_COMPANIES_HIRING.filter(c => {
    if (norm.includes('java') || norm.includes('backend')) {
      return ['amazon-java', 'jpmorgan-java', 'oracle-java', 'infosys-java', 'cisco-java', 'goldman-java'].includes(c.id);
    }
    if (norm.includes('web') || norm.includes('frontend') || norm.includes('full stack')) {
      return ['google-web', 'stripe-web', 'shopify-web', 'atlassian-web', 'infosys-java'].includes(c.id);
    }
    if (norm.includes('cloud') || norm.includes('devops')) {
      return ['aws-cloud', 'microsoft-azure', 'oracle-java', 'atlassian-web', 'cisco-java'].includes(c.id);
    }
    if (norm.includes('data') || norm.includes('analyst') || norm.includes('scientist')) {
      return ['netflix-data', 'goldman-java', 'nvidia-ai', 'infosys-java'].includes(c.id);
    }
    if (norm.includes('ai') || norm.includes('machine learning') || norm.includes('ml')) {
      return ['nvidia-ai', 'google-web', 'netflix-data', 'microsoft-azure'].includes(c.id);
    }
    if (norm.includes('cyber') || norm.includes('security')) {
      return ['crowdstrike-sec', 'cisco-java', 'jpmorgan-java', 'aws-cloud'].includes(c.id);
    }
    return true;
  });

  return relevant.length ? relevant.slice(0, 6) : ALL_COMPANIES_HIRING.slice(0, 6);
}

export function buildLinkedInJobSearchUrl(params: {
  keywords: string;
  location?: string;
  experienceLevel?: 'internship' | 'entry-level' | 'associate' | 'all';
  workplaceType?: 'remote' | 'hybrid' | 'on-site' | 'any';
  companyName?: string;
}): string {
  let query = params.keywords.trim();
  if (params.companyName) {
    query = `${params.companyName} ${query}`;
  }

  const searchParams = new URLSearchParams();
  searchParams.set('keywords', query);

  if (params.location && params.location !== 'Worldwide') {
    searchParams.set('location', params.location);
  }

  // LinkedIn experience level parameters
  // f_E=1: Internship, f_E=2: Entry level, f_E=3: Associate
  if (params.experienceLevel === 'internship') {
    searchParams.set('f_E', '1');
  } else if (params.experienceLevel === 'entry-level') {
    searchParams.set('f_E', '2');
  } else if (params.experienceLevel === 'associate') {
    searchParams.set('f_E', '3');
  }

  // Workplace type: f_WT=2 (Remote), f_WT=1 (On-site), f_WT=3 (Hybrid)
  if (params.workplaceType === 'remote') {
    searchParams.set('f_WT', '2');
  } else if (params.workplaceType === 'hybrid') {
    searchParams.set('f_WT', '3');
  } else if (params.workplaceType === 'on-site') {
    searchParams.set('f_WT', '1');
  }

  // Default to recent postings
  searchParams.set('sortBy', 'DD');

  return `https://www.linkedin.com/jobs/search/?${searchParams.toString()}`;
}

export function getLinkedInProfileAdvice(
  career: string,
  matchedSkills: string[],
  priorityGaps: string[]
) {
  const topMatched = matchedSkills.slice(0, 4);
  const primaryGap = priorityGaps[0] || 'Modern Cloud Frameworks';

  return {
    headline: `Aspiring ${career} | ${topMatched.join(' • ')} | Learning ${primaryGap}`,
    summaryKeywords: [
      career,
      ...topMatched,
      'RESTful APIs',
      'Git Version Control',
      'Clean Architecture',
      'Test-Driven Development',
      'Agile Team Collaboration',
    ],
    topSkillsToFeature: [
      ...topMatched,
      'Object-Oriented Design',
      'Problem Solving',
      'Software Development Life Cycle (SDLC)',
    ].slice(0, 5),
    recruiterTip: `Recruiters search LinkedIn using Boolean filters (e.g. "${career}" AND "${topMatched[0] || 'Java'}"). Add your matched skills directly to your LinkedIn Skills section and profile summary to increase recruiter search appearances by up to 40%.`,
  };
}
