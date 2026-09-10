import {
  StudentSkill,
  CareerSkillRequirement,
  EvaluatedSkill,
  GapStatus,
  PriorityLevel,
  TransferableChain,
  RoadmapWeek,
  SkillRelationship,
  JobDescriptionAnalysis
} from '../../shared/types.ts';

// Proficiency numerical scale as mandated
export const PROFICIENCY_MAP: Record<string, number> = {
  Beginner: 0.3,
  Intermediate: 0.6,
  Advanced: 1.0,
};

export function proficiencyToNumber(prof?: string): number {
  if (!prof) return 0;
  const match = Object.keys(PROFICIENCY_MAP).find(
    (k) => k.toLowerCase() === prof.trim().toLowerCase()
  );
  return match ? PROFICIENCY_MAP[match] : 0.3;
}

export function normalizeSkillName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ');
}

// Synonyms map for deterministic matching
const COMMON_SYNONYMS: Record<string, string[]> = {
  'rest api': ['restful', 'restful services', 'rest', 'restful api', 'web apis', 'apis'],
  'object-oriented programming': ['oop', 'object oriented', 'object oriented programming', 'oops'],
  'git': ['version control', 'git/github', 'git cli', 'vcs'],
  'github': ['github actions', 'gh'],
  'sql': ['relational databases', 'mysql', 'postgresql', 'relational database', 'sqlite', 'rdbms'],
  'database fundamentals': ['databases', 'db fundamentals', 'database design', 'rdbms concepts'],
  'data structures': ['dsa', 'data structures and algorithms', 'data structure'],
  'algorithms': ['algorithmic problem solving', 'algorithms and data structures'],
  'spring boot': ['spring', 'springboot', 'spring framework', 'spring mvc'],
  'react': ['react.js', 'reactjs', 'react native'],
  'node.js': ['nodejs', 'node', 'express', 'express.js'],
  'machine learning': ['ml', 'machine learning algorithms', 'statistical learning'],
  'deep learning': ['neural networks', 'dl'],
  'generative ai': ['gen ai', 'llms', 'foundation models', 'prompt engineering'],
  'cybersecurity fundamentals': ['cyber security', 'infosec', 'information security'],
  'docker': ['containerization', 'containers'],
  'ci/cd pipelines': ['ci cd', 'ci/cd', 'continuous integration', 'github actions'],
  'cloud (aws/gcp)': ['cloud', 'aws', 'gcp', 'cloud computing', 'azure'],
};

export function findStudentSkillMatch(reqSkillName: string, studentSkills: StudentSkill[]): StudentSkill | undefined {
  const normalizedReq = normalizeSkillName(reqSkillName);

  // 1. Direct exact or substring match
  for (const s of studentSkills) {
    const normStudent = normalizeSkillName(s.name);
    if (normStudent === normalizedReq) return s;
  }

  // 2. Synonyms lookup
  for (const [canonical, aliases] of Object.entries(COMMON_SYNONYMS)) {
    const isReqCanonical = normalizeSkillName(canonical) === normalizedReq;
    const isReqAlias = aliases.some(a => normalizeSkillName(a) === normalizedReq);

    if (isReqCanonical || isReqAlias) {
      for (const s of studentSkills) {
        const normStudent = normalizeSkillName(s.name);
        if (normStudent === normalizeSkillName(canonical) || aliases.some(a => normalizeSkillName(a) === normStudent)) {
          return s;
        }
      }
    }
  }

  // 3. Fallback partial inclusion
  for (const s of studentSkills) {
    const normStudent = normalizeSkillName(s.name);
    if (normStudent.length >= 3 && normalizedReq.includes(normStudent)) {
      return s;
    }
    if (normalizedReq.length >= 3 && normStudent.includes(normalizedReq)) {
      return s;
    }
  }

  return undefined;
}

export function calculateSkillGaps(
  requirements: CareerSkillRequirement[],
  studentSkills: StudentSkill[],
  jobAnalysis?: JobDescriptionAnalysis
): EvaluatedSkill[] {
  const jobRelevantSkills = new Set<string>();
  if (jobAnalysis) {
    [
      ...(jobAnalysis.requiredSkills || []),
      ...(jobAnalysis.technologies || []),
      ...(jobAnalysis.preferredSkills || [])
    ].forEach(s => jobRelevantSkills.add(normalizeSkillName(s)));
  }

  return requirements.map((req) => {
    const matched = findStudentSkillMatch(req.skill_name, studentSkills);
    const currentLevel = matched ? proficiencyToNumber(matched.proficiency) : 0;
    const currentProficiency = matched ? matched.proficiency : undefined;
    const requiredLevel = req.required_level;
    const gap = Math.max(0, Number((requiredLevel - currentLevel).toFixed(2)));

    let status: GapStatus = 'Missing';
    if (gap === 0) {
      status = 'Matched';
    } else if (gap > 0 && currentLevel > 0) {
      status = 'Partial';
    } else {
      status = 'Missing';
    }

    // Job relevance: 1.0 if mentioned in Job Description, 0.5 otherwise
    const normName = normalizeSkillName(req.skill_name);
    const isJobMentioned = Array.from(jobRelevantSkills).some(js =>
      js.includes(normName) || normName.includes(js)
    );
    const jobRelevance = isJobMentioned ? 1.0 : 0.5;

    // Formula: priorityScore = 0.5 * gap + 0.3 * importance + 0.2 * jobRelevance
    // Scale to 0-100
    // Max theoretical score: 0.5 * 1.0 + 0.3 * 1.0 + 0.2 * 1.0 = 1.0
    const rawPriority = (0.5 * gap + 0.3 * req.importance + 0.2 * jobRelevance) * 100;
    const priorityScore = Math.min(100, Math.max(0, Math.round(rawPriority)));

    let priority: PriorityLevel = 'LOW';
    if (priorityScore >= 80) {
      priority = 'HIGH';
    } else if (priorityScore >= 50) {
      priority = 'MEDIUM';
    } else {
      priority = 'LOW';
    }

    let reason = '';
    if (status === 'Matched') {
      reason = `Skill criteria fully met (${Math.round(currentLevel * 100)}% current vs ${Math.round(requiredLevel * 100)}% required).`;
    } else if (status === 'Partial') {
      reason = `Skill partially possessed (${matched?.proficiency}). Requires deepening to reach ${Math.round(requiredLevel * 100)}% target depth.`;
    } else {
      if (isJobMentioned) {
        reason = `High-demand target requirement explicitly cited in employer job description.`;
      } else if (req.importance >= 0.9) {
        reason = `Mission-critical foundational core competency for this career trajectory.`;
      } else {
        reason = `Required career milestone needed for comprehensive operational capability.`;
      }
    }

    return {
      skillName: req.skill_name,
      category: req.category,
      currentLevel,
      currentProficiency,
      requiredLevel,
      gap,
      status,
      importance: req.importance,
      jobRelevance,
      priorityScore,
      priority,
      reason,
    };
  });
}

export function calculateReadinessScore(evaluatedSkills: EvaluatedSkill[]): number {
  if (!evaluatedSkills.length) return 0;

  let weightedCurrentSum = 0;
  let weightedRequiredSum = 0;

  for (const s of evaluatedSkills) {
    // Clamp current level to required level for readiness calculation
    const effectiveCurrent = Math.min(s.currentLevel, s.requiredLevel);
    weightedCurrentSum += effectiveCurrent * s.importance;
    weightedRequiredSum += s.requiredLevel * s.importance;
  }

  if (weightedRequiredSum === 0) return 0;
  const score = (weightedCurrentSum / weightedRequiredSum) * 100;
  return Math.min(100, Math.max(0, Math.round(score)));
}

export function buildTransferableChains(
  studentSkills: StudentSkill[],
  evaluatedSkills: EvaluatedSkill[],
  dbRelationships: SkillRelationship[]
): TransferableChain[] {
  const chains: TransferableChain[] = [];
  const missingOrPartialNames = evaluatedSkills
    .filter((s) => s.status !== 'Matched')
    .map((s) => s.skillName.toLowerCase());

  // 1. Check direct relationships from DB
  for (const rel of dbRelationships) {
    const studentHasFrom = studentSkills.some(
      (ss) => normalizeSkillName(ss.name) === normalizeSkillName(rel.from_skill)
    );
    const targetIsNeeded = missingOrPartialNames.includes(rel.to_skill.toLowerCase());

    if (studentHasFrom && targetIsNeeded) {
      chains.push({
        existingSkill: rel.from_skill,
        targetSkill: rel.to_skill,
        bridgeSteps: [
          rel.from_skill,
          `${rel.relationship_type.toUpperCase()}: ${rel.to_skill}`,
          `Production ${rel.to_skill}`
        ],
        description: rel.description,
      });
    }
  }

  // 2. Add standard curated bridges if student has foundational skills
  const studentSkillNames = studentSkills.map(s => normalizeSkillName(s.name));

  if (studentSkillNames.includes('java') && missingOrPartialNames.some(n => n.includes('spring'))) {
    if (!chains.some(c => c.existingSkill === 'Java' && c.targetSkill === 'Spring Boot')) {
      chains.push({
        existingSkill: 'Java',
        targetSkill: 'Spring Boot',
        bridgeSteps: ['Java Syntax', 'OOP Principles', 'Spring Boot Core', 'REST APIs', 'Backend Development'],
        description: 'Your existing Java knowledge enables immediate comprehension of Spring Beans, Inversion of Control, and microservices.'
      });
    }
  }

  if (studentSkillNames.includes('c') && missingOrPartialNames.some(n => n.includes('data structures') || n.includes('oop'))) {
    chains.push({
      existingSkill: 'C',
      targetSkill: 'Data Structures & OOP',
      bridgeSteps: ['C Programming', 'Pointers & Memory', 'Data Structures', 'Class Encapsulation', 'Problem Solving'],
      description: 'C procedural rigor and pointer arithmetic provide an exceptional mental model for complex data structures and OOP.'
    });
  }

  if (studentSkillNames.includes('sql') && missingOrPartialNames.some(n => n.includes('spring') || n.includes('backend') || n.includes('pandas'))) {
    chains.push({
      existingSkill: 'SQL',
      targetSkill: 'Relational ORM & Data Pipelines',
      bridgeSteps: ['SQL Queries', 'Schema Design', 'ORM / JPA Mapping', 'Optimized APIs'],
      description: 'Your database query foundation directly transfers to backend entities, index optimization, and high-throughput endpoints.'
    });
  }

  if (studentSkillNames.includes('html') && missingOrPartialNames.some(n => n.includes('react') || n.includes('javascript'))) {
    chains.push({
      existingSkill: 'HTML',
      targetSkill: 'Modern Component UI',
      bridgeSteps: ['HTML Semantics', 'DOM Architecture', 'JSX Syntax', 'React Components'],
      description: 'HTML document tree mastery simplifies the transition to component hierarchies, props, and declarative UI.'
    });
  }

  // Default fallback if no specific chain triggered
  if (chains.length === 0 && studentSkills.length > 0) {
    const topExisting = studentSkills[0].name;
    const topGap = evaluatedSkills.find(s => s.status !== 'Matched')?.skillName || 'Target Role Mastery';
    chains.push({
      existingSkill: topExisting,
      targetSkill: topGap,
      bridgeSteps: [topExisting, 'Foundational Parallels', 'Applied Practice', topGap],
      description: `Your proficiency in ${topExisting} establishes key software engineering habits that accelerate learning ${topGap}.`
    });
  }

  return chains;
}

export function generateDeterministicRoadmap(
  careerName: string,
  evaluatedSkills: EvaluatedSkill[],
  studentSkills: StudentSkill[]
): RoadmapWeek[] {
  // Sort missing and partial skills by priority descending
  const focusSkills = evaluatedSkills
    .filter((s) => s.status !== 'Matched')
    .sort((a, b) => b.priorityScore - a.priorityScore);

  const matchedSkillsNames = evaluatedSkills
    .filter((s) => s.status === 'Matched')
    .map((s) => s.skillName.toLowerCase());

  // Build 6 structured weeks
  const weeks: RoadmapWeek[] = [];

  // Identify top gaps
  const topGap1 = focusSkills[0]?.skillName || 'Core Architectural Concepts';
  const topGap2 = focusSkills[1]?.skillName || 'Applied Problem Solving';
  const topGap3 = focusSkills[2]?.skillName || 'Frameworks & Tooling';
  const topGap4 = focusSkills[3]?.skillName || 'System Integration';
  const topGap5 = focusSkills[4]?.skillName || 'Testing & Production Resilience';

  // Customize based on whether OOP, Data Structures, or Tools are already matched
  let week1Focus = topGap1;
  let week1Goal = `Master the core foundations and modern paradigms of ${topGap1}.`;
  let week1Task = `Implement modular coding exercises and build a focused prototype demonstrating ${topGap1}.`;

  if (focusSkills.some(s => s.skillName.toLowerCase().includes('oop') && s.status === 'Partial')) {
    week1Focus = 'Object-Oriented Programming Deep-Dive';
    week1Goal = 'Strengthen OOP design patterns, inheritance, and clean code principles.';
    week1Task = 'Build a multi-class domain model implementing polymorphism, encapsulation, and abstraction.';
  } else if (focusSkills.some(s => s.skillName.toLowerCase().includes('data structures') && s.status !== 'Matched')) {
    week1Focus = 'Data Structures & Algorithmic Efficiency';
    week1Goal = 'Improve algorithmic problem-solving and time/space complexity analysis.';
    week1Task = 'Implement custom linked lists, hash maps, binary trees, and solve 10 targeted problems.';
  }

  weeks.push({
    week: 1,
    title: `Week 1: ${week1Focus}`,
    focusSkill: week1Focus,
    goal: week1Goal,
    task: week1Task,
    milestone: 'Foundational benchmark reached with unit-tested sample modules.',
    estimatedHours: 12,
    resourceSuggestion: 'Official Documentation & interactive practice suites'
  });

  // Week 2
  let week2Focus = topGap2;
  weeks.push({
    week: 2,
    title: `Week 2: ${week2Focus}`,
    focusSkill: week2Focus,
    goal: `Deepen practical execution of ${week2Focus} aligned with ${careerName} best practices.`,
    task: `Build an integrated lab project resolving realistic edge cases and data validation using ${week2Focus}.`,
    milestone: 'Working multi-tier submodule successfully committed.',
    estimatedHours: 14,
    resourceSuggestion: 'Production architecture guides and style conventions'
  });

  // Week 3
  let week3Focus = topGap3;
  if (!matchedSkillsNames.includes('git') && focusSkills.some(s => s.skillName.toLowerCase().includes('git'))) {
    week3Focus = 'Git & Professional Version Control';
    weeks.push({
      week: 3,
      title: 'Week 3: Professional Version Control & Collaboration',
      focusSkill: 'Git & GitHub',
      goal: 'Learn enterprise branch workflows, pull requests, semantic commits, and merge conflict resolution.',
      task: 'Initialize a clean Git repository, establish branch protection rules, and execute PR workflows on GitHub.',
      milestone: 'Active public repository featuring structured Git history.',
      estimatedHours: 10,
      resourceSuggestion: 'GitHub Skills & Pro Git handbook'
    });
  } else {
    weeks.push({
      week: 3,
      title: `Week 3: ${week3Focus}`,
      focusSkill: week3Focus,
      goal: `Connect foundational knowledge to real-world ${week3Focus} workflows.`,
      task: `Construct a functional service layer incorporating ${week3Focus}.`,
      milestone: 'Operational service layer meeting standard validation criteria.',
      estimatedHours: 14,
      resourceSuggestion: 'Developer tutorials and reference implementations'
    });
  }

  // Week 4
  let week4Focus = topGap4;
  if (careerName.toLowerCase().includes('java') && focusSkills.some(s => s.skillName.toLowerCase().includes('spring'))) {
    week4Focus = 'Spring Boot Backend Architecture';
    weeks.push({
      week: 4,
      title: 'Week 4: Spring Boot Microservices & Dependency Injection',
      focusSkill: 'Spring Boot',
      goal: 'Understand Spring inversion of control, auto-configuration, service layers, and application properties.',
      task: 'Bootstrap a production-ready Spring Boot application with layered controllers, services, and repositories.',
      milestone: 'Bootable backend service passing local integration tests.',
      estimatedHours: 16,
      resourceSuggestion: 'Spring.io Initializr & Spring Guides'
    });
  } else {
    weeks.push({
      week: 4,
      title: `Week 4: ${week4Focus}`,
      focusSkill: week4Focus,
      goal: `Master intermediate-to-advanced patterns in ${week4Focus}.`,
      task: `Build and test scalable modules with robust exception handling in ${week4Focus}.`,
      milestone: 'Clean modular implementation verified by end-to-end assertions.',
      estimatedHours: 15,
      resourceSuggestion: 'Framework official documentation'
    });
  }

  // Week 5
  let week5Focus = topGap5;
  if (careerName.toLowerCase().includes('java') || careerName.toLowerCase().includes('full stack') || careerName.toLowerCase().includes('python')) {
    week5Focus = 'REST APIs & Database Integration';
    weeks.push({
      week: 5,
      title: 'Week 5: RESTful API Design & Persistent Data Layers',
      focusSkill: 'REST API & SQL Integration',
      goal: 'Design standard RESTful endpoints (GET/POST/PUT/DELETE) connected to relational tables with validation.',
      task: 'Implement full CRUD endpoints with error handling, schema migrations, and relational query joins.',
      milestone: 'Fully documented OpenAPI / Swagger endpoints accessible via HTTP client.',
      estimatedHours: 16,
      resourceSuggestion: 'RESTful API Guidelines & SQL indexing tutorials'
    });
  } else {
    weeks.push({
      week: 5,
      title: `Week 5: System Integration & Optimization`,
      focusSkill: week5Focus,
      goal: `Integrate multiple sub-components into a unified, high-performance pipeline.`,
      task: `Run benchmarks, profile bottlenecks, and optimize query latency or compute overhead.`,
      milestone: 'Measurable performance optimization report generated.',
      estimatedHours: 14,
      resourceSuggestion: 'Performance profiling and debugging handbooks'
    });
  }

  // Week 6: Capstone Project
  weeks.push({
    week: 6,
    title: `Week 6: Production Capstone & Career Portfolio Deployment`,
    focusSkill: `Full ${careerName} Portfolio Capstone`,
    goal: 'Consolidate all matched and newly developed skills into an employer-ready, deployed capstone demonstration.',
    task: `Build, document with a comprehensive README, and deploy a full-featured project exhibiting your ${careerName} skill readiness.`,
    milestone: 'Live production URL and clean GitHub repository ready to present in technical interviews.',
    estimatedHours: 20,
    resourceSuggestion: 'Cloud deployment platforms (Cloud Run / Vercel / GitHub)'
  });

  return weeks;
}
