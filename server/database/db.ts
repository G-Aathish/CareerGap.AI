import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';

let dbInstance: Database | null = null;
const DB_FILE_PATH = path.join(process.cwd(), 'careergap.sqlite');

export async function getDb(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE_PATH)) {
    try {
      const fileBuffer = fs.readFileSync(DB_FILE_PATH);
      dbInstance = new SQL.Database(fileBuffer);
      return dbInstance;
    } catch (e) {
      console.warn('Failed to load existing SQLite file, creating fresh database:', e);
    }
  }

  dbInstance = new SQL.Database();
  initializeSchemaAndSeed(dbInstance);
  saveDb(dbInstance);
  return dbInstance;
}

export function saveDb(db: Database) {
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE_PATH, buffer);
  } catch (err) {
    console.error('Failed to persist SQLite database to disk:', err);
  }
}

function initializeSchemaAndSeed(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS careers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT
    );

    CREATE TABLE IF NOT EXISTS career_skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      career_id TEXT NOT NULL,
      skill_id TEXT NOT NULL,
      required_level REAL NOT NULL,
      importance REAL NOT NULL,
      category TEXT
    );

    CREATE TABLE IF NOT EXISTS skill_relationships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_skill TEXT NOT NULL,
      to_skill TEXT NOT NULL,
      relationship_type TEXT NOT NULL,
      description TEXT
    );
  `);

  // Careers
  const careers = [
    { id: 'java-developer', name: 'Java Developer', description: 'Enterprise backend & robust server architecture engineer utilizing Java, Spring Boot, and relational databases.' },
    { id: 'python-developer', name: 'Python Developer', description: 'Specialist in backend services, automation, APIs, and data integrations using Python, Django, or FastAPI.' },
    { id: 'full-stack-developer', name: 'Full Stack Developer', description: 'End-to-end web engineer crafting responsive user interfaces and scalable Node/SQL/REST backend services.' },
    { id: 'web-developer', name: 'Web Developer', description: 'Front-facing application engineer building high-performance, modern responsive interfaces with React and web standards.' },
    { id: 'data-analyst', name: 'Data Analyst', description: 'Data modeling, statistical analysis, interactive dashboards, and business intelligence using SQL, Python, and Power BI.' },
    { id: 'data-scientist', name: 'Data Scientist', description: 'Advanced statistical modeling, predictive algorithms, data mining, and machine learning solutions.' },
    { id: 'ai-engineer', name: 'AI Engineer', description: 'Applied artificial intelligence, neural networks, foundation model integrations, and machine learning systems.' },
    { id: 'machine-learning-engineer', name: 'Machine Learning Engineer', description: 'Production ML pipeline engineer designing MLOps, model training, feature stores, and scalable inference.' },
    { id: 'cybersecurity-analyst', name: 'Cybersecurity Analyst', description: 'Information security practitioner focused on threat detection, network security, SIEM, and incident response.' },
    { id: 'cloud-engineer', name: 'Cloud Engineer', description: 'Cloud infrastructure architect handling cloud deployments, Docker containers, IAM security, and networking.' },
    { id: 'devops-engineer', name: 'DevOps Engineer', description: 'Automation and CI/CD specialist maintaining containerized platforms, monitoring, and infrastructure-as-code.' },
  ];

  for (const c of careers) {
    db.run('INSERT INTO careers (id, name, description) VALUES (?, ?, ?)', [c.id, c.name, c.description]);
  }

  // Skills
  const skills = [
    { id: 'java', name: 'Java', category: 'Programming Languages' },
    { id: 'oop', name: 'Object-Oriented Programming', category: 'Fundamentals' },
    { id: 'dsa', name: 'Data Structures', category: 'Computer Science' },
    { id: 'algorithms', name: 'Algorithms', category: 'Computer Science' },
    { id: 'sql', name: 'SQL', category: 'Databases' },
    { id: 'git', name: 'Git', category: 'Tools & DevOps' },
    { id: 'github', name: 'GitHub', category: 'Tools & DevOps' },
    { id: 'spring-boot', name: 'Spring Boot', category: 'Backend Frameworks' },
    { id: 'rest-api', name: 'REST API', category: 'Backend & Architecture' },
    { id: 'db-fundamentals', name: 'Database Fundamentals', category: 'Databases' },
    { id: 'exception-handling', name: 'Exception Handling', category: 'Programming Languages' },
    { id: 'collections', name: 'Collections', category: 'Programming Languages' },
    { id: 'communication', name: 'Communication', category: 'Professional Skills' },
    { id: 'python', name: 'Python', category: 'Programming Languages' },
    { id: 'django-fastapi', name: 'Django/FastAPI', category: 'Backend Frameworks' },
    { id: 'testing', name: 'Testing & Unit Tests', category: 'Engineering Practices' },
    { id: 'c-lang', name: 'C', category: 'Programming Languages' },
    { id: 'html', name: 'HTML', category: 'Frontend' },
    { id: 'css', name: 'CSS', category: 'Frontend' },
    { id: 'javascript', name: 'JavaScript', category: 'Programming Languages' },
    { id: 'typescript', name: 'TypeScript', category: 'Programming Languages' },
    { id: 'react', name: 'React', category: 'Frontend' },
    { id: 'node-js', name: 'Node.js', category: 'Backend' },
    { id: 'auth', name: 'Authentication & JWT', category: 'Security & Backend' },
    { id: 'deployment', name: 'Deployment & Hosting', category: 'DevOps' },
    { id: 'excel', name: 'Excel', category: 'Analytics' },
    { id: 'statistics', name: 'Statistics', category: 'Mathematics' },
    { id: 'data-viz', name: 'Data Visualization', category: 'Analytics' },
    { id: 'power-bi', name: 'Power BI', category: 'Business Intelligence' },
    { id: 'tableau', name: 'Tableau', category: 'Business Intelligence' },
    { id: 'pandas', name: 'Pandas', category: 'Data Analysis' },
    { id: 'numpy', name: 'NumPy', category: 'Data Analysis' },
    { id: 'ml', name: 'Machine Learning', category: 'AI & Data Science' },
    { id: 'deep-learning', name: 'Deep Learning', category: 'AI & Data Science' },
    { id: 'linear-algebra', name: 'Linear Algebra', category: 'Mathematics' },
    { id: 'tensorflow-pytorch', name: 'TensorFlow/PyTorch', category: 'AI Frameworks' },
    { id: 'gen-ai', name: 'Generative AI', category: 'AI Frameworks' },
    { id: 'networking', name: 'Networking', category: 'Infrastructure' },
    { id: 'linux', name: 'Linux', category: 'Operating Systems' },
    { id: 'cyber-fundamentals', name: 'Cybersecurity Fundamentals', category: 'Security' },
    { id: 'siem', name: 'SIEM', category: 'Security Operations' },
    { id: 'threat-detection', name: 'Threat Detection', category: 'Security Operations' },
    { id: 'incident-response', name: 'Incident Response', category: 'Security Operations' },
    { id: 'cryptography', name: 'Cryptography', category: 'Security' },
    { id: 'firewalls', name: 'Firewalls', category: 'Infrastructure' },
    { id: 'sec-monitoring', name: 'Security Monitoring', category: 'Security Operations' },
    { id: 'docker', name: 'Docker', category: 'DevOps' },
    { id: 'kubernetes', name: 'Kubernetes', category: 'DevOps' },
    { id: 'ci-cd', name: 'CI/CD Pipelines', category: 'DevOps' },
    { id: 'cloud-aws-gcp', name: 'Cloud (AWS/GCP)', category: 'Cloud' },
  ];

  for (const s of skills) {
    db.run('INSERT INTO skills (id, name, category) VALUES (?, ?, ?)', [s.id, s.name, s.category]);
  }

  // Career Skills mapping (required_level, importance)
  // Scale: Beginner = 0.3, Intermediate = 0.6, Advanced = 1.0 (or 0.8 for strong working proficiency)
  const careerSkillsList: Array<{ career_id: string; skill_id: string; required_level: number; importance: number; category: string }> = [
    // Java Developer
    { career_id: 'java-developer', skill_id: 'java', required_level: 0.8, importance: 1.0, category: 'Core Language' },
    { career_id: 'java-developer', skill_id: 'oop', required_level: 0.8, importance: 0.9, category: 'Fundamentals' },
    { career_id: 'java-developer', skill_id: 'spring-boot', required_level: 0.8, importance: 0.95, category: 'Frameworks' },
    { career_id: 'java-developer', skill_id: 'rest-api', required_level: 0.8, importance: 0.9, category: 'Architecture' },
    { career_id: 'java-developer', skill_id: 'sql', required_level: 0.6, importance: 0.85, category: 'Databases' },
    { career_id: 'java-developer', skill_id: 'dsa', required_level: 0.6, importance: 0.8, category: 'Fundamentals' },
    { career_id: 'java-developer', skill_id: 'algorithms', required_level: 0.6, importance: 0.75, category: 'Fundamentals' },
    { career_id: 'java-developer', skill_id: 'git', required_level: 0.6, importance: 0.8, category: 'Tools' },
    { career_id: 'java-developer', skill_id: 'github', required_level: 0.6, importance: 0.7, category: 'Tools' },
    { career_id: 'java-developer', skill_id: 'db-fundamentals', required_level: 0.6, importance: 0.8, category: 'Databases' },
    { career_id: 'java-developer', skill_id: 'exception-handling', required_level: 0.6, importance: 0.7, category: 'Core Language' },
    { career_id: 'java-developer', skill_id: 'collections', required_level: 0.6, importance: 0.75, category: 'Core Language' },
    { career_id: 'java-developer', skill_id: 'communication', required_level: 0.6, importance: 0.6, category: 'Soft Skills' },

    // Python Developer
    { career_id: 'python-developer', skill_id: 'python', required_level: 0.8, importance: 1.0, category: 'Core Language' },
    { career_id: 'python-developer', skill_id: 'oop', required_level: 0.8, importance: 0.85, category: 'Fundamentals' },
    { career_id: 'python-developer', skill_id: 'django-fastapi', required_level: 0.8, importance: 0.95, category: 'Frameworks' },
    { career_id: 'python-developer', skill_id: 'rest-api', required_level: 0.8, importance: 0.9, category: 'Architecture' },
    { career_id: 'python-developer', skill_id: 'sql', required_level: 0.6, importance: 0.8, category: 'Databases' },
    { career_id: 'python-developer', skill_id: 'dsa', required_level: 0.6, importance: 0.8, category: 'Fundamentals' },
    { career_id: 'python-developer', skill_id: 'algorithms', required_level: 0.6, importance: 0.75, category: 'Fundamentals' },
    { career_id: 'python-developer', skill_id: 'git', required_level: 0.6, importance: 0.8, category: 'Tools' },
    { career_id: 'python-developer', skill_id: 'testing', required_level: 0.6, importance: 0.75, category: 'Engineering' },

    // Full Stack Developer
    { career_id: 'full-stack-developer', skill_id: 'javascript', required_level: 0.8, importance: 0.95, category: 'Languages' },
    { career_id: 'full-stack-developer', skill_id: 'react', required_level: 0.8, importance: 0.95, category: 'Frontend' },
    { career_id: 'full-stack-developer', skill_id: 'node-js', required_level: 0.8, importance: 0.9, category: 'Backend' },
    { career_id: 'full-stack-developer', skill_id: 'html', required_level: 0.8, importance: 0.8, category: 'Frontend' },
    { career_id: 'full-stack-developer', skill_id: 'css', required_level: 0.8, importance: 0.8, category: 'Frontend' },
    { career_id: 'full-stack-developer', skill_id: 'rest-api', required_level: 0.8, importance: 0.9, category: 'Architecture' },
    { career_id: 'full-stack-developer', skill_id: 'sql', required_level: 0.6, importance: 0.8, category: 'Databases' },
    { career_id: 'full-stack-developer', skill_id: 'git', required_level: 0.6, importance: 0.8, category: 'Tools' },
    { career_id: 'full-stack-developer', skill_id: 'github', required_level: 0.6, importance: 0.75, category: 'Tools' },
    { career_id: 'full-stack-developer', skill_id: 'auth', required_level: 0.6, importance: 0.8, category: 'Security' },
    { career_id: 'full-stack-developer', skill_id: 'deployment', required_level: 0.6, importance: 0.75, category: 'DevOps' },

    // Web Developer
    { career_id: 'web-developer', skill_id: 'html', required_level: 0.8, importance: 0.95, category: 'Frontend' },
    { career_id: 'web-developer', skill_id: 'css', required_level: 0.8, importance: 0.95, category: 'Frontend' },
    { career_id: 'web-developer', skill_id: 'javascript', required_level: 0.8, importance: 0.95, category: 'Languages' },
    { career_id: 'web-developer', skill_id: 'react', required_level: 0.8, importance: 0.9, category: 'Frontend' },
    { career_id: 'web-developer', skill_id: 'typescript', required_level: 0.6, importance: 0.85, category: 'Languages' },
    { career_id: 'web-developer', skill_id: 'git', required_level: 0.6, importance: 0.8, category: 'Tools' },
    { career_id: 'web-developer', skill_id: 'rest-api', required_level: 0.6, importance: 0.75, category: 'Backend' },

    // Data Analyst
    { career_id: 'data-analyst', skill_id: 'sql', required_level: 0.8, importance: 1.0, category: 'Databases' },
    { career_id: 'data-analyst', skill_id: 'excel', required_level: 0.8, importance: 0.9, category: 'Analytics' },
    { career_id: 'data-analyst', skill_id: 'python', required_level: 0.6, importance: 0.85, category: 'Languages' },
    { career_id: 'data-analyst', skill_id: 'pandas', required_level: 0.6, importance: 0.85, category: 'Data Analysis' },
    { career_id: 'data-analyst', skill_id: 'numpy', required_level: 0.6, importance: 0.75, category: 'Data Analysis' },
    { career_id: 'data-analyst', skill_id: 'statistics', required_level: 0.6, importance: 0.85, category: 'Mathematics' },
    { career_id: 'data-analyst', skill_id: 'data-viz', required_level: 0.8, importance: 0.9, category: 'Visualization' },
    { career_id: 'data-analyst', skill_id: 'power-bi', required_level: 0.6, importance: 0.8, category: 'BI' },
    { career_id: 'data-analyst', skill_id: 'tableau', required_level: 0.6, importance: 0.75, category: 'BI' },
    { career_id: 'data-analyst', skill_id: 'communication', required_level: 0.6, importance: 0.7, category: 'Soft Skills' },

    // Data Scientist
    { career_id: 'data-scientist', skill_id: 'python', required_level: 0.8, importance: 1.0, category: 'Languages' },
    { career_id: 'data-scientist', skill_id: 'statistics', required_level: 0.8, importance: 0.95, category: 'Mathematics' },
    { career_id: 'data-scientist', skill_id: 'ml', required_level: 0.8, importance: 0.95, category: 'AI & Data Science' },
    { career_id: 'data-scientist', skill_id: 'pandas', required_level: 0.8, importance: 0.9, category: 'Data Analysis' },
    { career_id: 'data-scientist', skill_id: 'numpy', required_level: 0.8, importance: 0.85, category: 'Data Analysis' },
    { career_id: 'data-scientist', skill_id: 'sql', required_level: 0.8, importance: 0.85, category: 'Databases' },
    { career_id: 'data-scientist', skill_id: 'linear-algebra', required_level: 0.6, importance: 0.8, category: 'Mathematics' },
    { career_id: 'data-scientist', skill_id: 'deep-learning', required_level: 0.6, importance: 0.8, category: 'AI & Data Science' },

    // AI Engineer
    { career_id: 'ai-engineer', skill_id: 'python', required_level: 0.8, importance: 1.0, category: 'Languages' },
    { career_id: 'ai-engineer', skill_id: 'ml', required_level: 0.8, importance: 0.95, category: 'AI & Data Science' },
    { career_id: 'ai-engineer', skill_id: 'deep-learning', required_level: 0.8, importance: 0.95, category: 'AI & Data Science' },
    { career_id: 'ai-engineer', skill_id: 'gen-ai', required_level: 0.8, importance: 0.95, category: 'AI & Data Science' },
    { career_id: 'ai-engineer', skill_id: 'tensorflow-pytorch', required_level: 0.8, importance: 0.9, category: 'Frameworks' },
    { career_id: 'ai-engineer', skill_id: 'statistics', required_level: 0.6, importance: 0.8, category: 'Mathematics' },
    { career_id: 'ai-engineer', skill_id: 'linear-algebra', required_level: 0.6, importance: 0.8, category: 'Mathematics' },
    { career_id: 'ai-engineer', skill_id: 'numpy', required_level: 0.6, importance: 0.75, category: 'Data Analysis' },
    { career_id: 'ai-engineer', skill_id: 'pandas', required_level: 0.6, importance: 0.75, category: 'Data Analysis' },
    { career_id: 'ai-engineer', skill_id: 'sql', required_level: 0.6, importance: 0.7, category: 'Databases' },
    { career_id: 'ai-engineer', skill_id: 'rest-api', required_level: 0.6, importance: 0.8, category: 'APIs' },

    // Cybersecurity Analyst
    { career_id: 'cybersecurity-analyst', skill_id: 'cyber-fundamentals', required_level: 0.8, importance: 1.0, category: 'Security' },
    { career_id: 'cybersecurity-analyst', skill_id: 'networking', required_level: 0.8, importance: 0.95, category: 'Infrastructure' },
    { career_id: 'cybersecurity-analyst', skill_id: 'linux', required_level: 0.8, importance: 0.9, category: 'Operating Systems' },
    { career_id: 'cybersecurity-analyst', skill_id: 'siem', required_level: 0.8, importance: 0.9, category: 'Security Operations' },
    { career_id: 'cybersecurity-analyst', skill_id: 'threat-detection', required_level: 0.8, importance: 0.9, category: 'Security Operations' },
    { career_id: 'cybersecurity-analyst', skill_id: 'incident-response', required_level: 0.8, importance: 0.85, category: 'Security Operations' },
    { career_id: 'cybersecurity-analyst', skill_id: 'python', required_level: 0.6, importance: 0.75, category: 'Scripting' },
    { career_id: 'cybersecurity-analyst', skill_id: 'cryptography', required_level: 0.6, importance: 0.8, category: 'Security' },
    { career_id: 'cybersecurity-analyst', skill_id: 'firewalls', required_level: 0.6, importance: 0.8, category: 'Infrastructure' },
    { career_id: 'cybersecurity-analyst', skill_id: 'sec-monitoring', required_level: 0.6, importance: 0.85, category: 'Security Operations' },

    // Cloud Engineer
    { career_id: 'cloud-engineer', skill_id: 'cloud-aws-gcp', required_level: 0.8, importance: 1.0, category: 'Cloud' },
    { career_id: 'cloud-engineer', skill_id: 'linux', required_level: 0.8, importance: 0.9, category: 'Operating Systems' },
    { career_id: 'cloud-engineer', skill_id: 'docker', required_level: 0.8, importance: 0.9, category: 'Containers' },
    { career_id: 'cloud-engineer', skill_id: 'networking', required_level: 0.8, importance: 0.85, category: 'Infrastructure' },
    { career_id: 'cloud-engineer', skill_id: 'ci-cd', required_level: 0.6, importance: 0.8, category: 'DevOps' },
    { career_id: 'cloud-engineer', skill_id: 'python', required_level: 0.6, importance: 0.75, category: 'Scripting' },

    // DevOps Engineer
    { career_id: 'devops-engineer', skill_id: 'ci-cd', required_level: 0.8, importance: 1.0, category: 'DevOps' },
    { career_id: 'devops-engineer', skill_id: 'docker', required_level: 0.8, importance: 0.95, category: 'Containers' },
    { career_id: 'devops-engineer', skill_id: 'kubernetes', required_level: 0.8, importance: 0.9, category: 'Containers' },
    { career_id: 'devops-engineer', skill_id: 'linux', required_level: 0.8, importance: 0.9, category: 'Operating Systems' },
    { career_id: 'devops-engineer', skill_id: 'git', required_level: 0.8, importance: 0.85, category: 'Tools' },
    { career_id: 'devops-engineer', skill_id: 'cloud-aws-gcp', required_level: 0.6, importance: 0.85, category: 'Cloud' },
  ];

  for (const cs of careerSkillsList) {
    db.run(
      'INSERT INTO career_skills (career_id, skill_id, required_level, importance, category) VALUES (?, ?, ?, ?, ?)',
      [cs.career_id, cs.skill_id, cs.required_level, cs.importance, cs.category]
    );
  }

  // Skill Relationships for Transferable Skill Intelligence
  const relationships = [
    {
      from_skill: 'Java',
      to_skill: 'Spring Boot',
      relationship_type: 'foundation',
      description: 'Java language syntax and OOP models directly unlock Spring Boot dependency injection and enterprise microservices.'
    },
    {
      from_skill: 'Java',
      to_skill: 'REST API',
      relationship_type: 'application',
      description: 'Java backend knowledge enables building robust RESTful endpoints with Spring Web.'
    },
    {
      from_skill: 'C',
      to_skill: 'Data Structures',
      relationship_type: 'foundation',
      description: 'C memory management and pointers provide strong mental models for implementing linked lists, trees, and heaps.'
    },
    {
      from_skill: 'C',
      to_skill: 'Object-Oriented Programming',
      relationship_type: 'transition',
      description: 'Understanding procedural C paradigms provides the foundational logic to grasp class abstractions and encapsulation in OOP.'
    },
    {
      from_skill: 'SQL',
      to_skill: 'Spring Boot',
      relationship_type: 'integration',
      description: 'Relational query knowledge immediately transfers to Spring Data JPA and Hibernate ORM mappings.'
    },
    {
      from_skill: 'HTML',
      to_skill: 'React',
      relationship_type: 'syntax',
      description: 'HTML markup structure translates into JSX template syntax in modern frontend frameworks.'
    },
    {
      from_skill: 'JavaScript',
      to_skill: 'TypeScript',
      relationship_type: 'enhancement',
      description: 'JavaScript dynamic runtime knowledge forms the base for TypeScript type annotations and interfaces.'
    },
    {
      from_skill: 'JavaScript',
      to_skill: 'Node.js',
      relationship_type: 'runtime',
      description: 'Client-side JS event loops and asynchronous programming directly transfer to server-side Node.js.'
    },
    {
      from_skill: 'Python',
      to_skill: 'Machine Learning',
      relationship_type: 'ecosystem',
      description: 'Python syntax and list comprehensions enable seamless adoption of Scikit-Learn and ML pipelines.'
    },
    {
      from_skill: 'Python',
      to_skill: 'Pandas',
      relationship_type: 'ecosystem',
      description: 'Core Python data structures transition into high-performance tabular DataFrames.'
    },
    {
      from_skill: 'Networking',
      to_skill: 'Cybersecurity Fundamentals',
      relationship_type: 'prerequisite',
      description: 'TCP/IP, subnetting, and port knowledge are required to analyze packet captures and network intrusions.'
    },
    {
      from_skill: 'Linux',
      to_skill: 'Docker',
      relationship_type: 'foundation',
      description: 'Linux cgroups, namespaces, and bash scripting form the core of containerized execution.'
    },
    {
      from_skill: 'Git',
      to_skill: 'CI/CD Pipelines',
      relationship_type: 'workflow',
      description: 'Git branch workflows and commit hooks form the operational triggers for automated CI/CD builds.'
    }
  ];

  for (const r of relationships) {
    db.run(
      'INSERT INTO skill_relationships (from_skill, to_skill, relationship_type, description) VALUES (?, ?, ?, ?)',
      [r.from_skill, r.to_skill, r.relationship_type, r.description]
    );
  }
}

export function getAllCareers(db: Database) {
  const res = db.exec('SELECT id, name, description FROM careers ORDER BY name ASC');
  if (!res.length || !res[0].values) return [];
  return res[0].values.map((row) => ({
    id: row[0] as string,
    name: row[1] as string,
    description: row[2] as string,
  }));
}

export function getCareerByIdOrName(db: Database, identifier: string) {
  const norm = (identifier || '').trim().toLowerCase();
  const aliasMap: Record<string, string> = {
    'frontend developer': 'web-dev',
    'frontend': 'web-dev',
    'front-end developer': 'web-dev',
    'backend developer': 'java-dev',
    'backend': 'java-dev',
    'ml engineer': 'ml-engineer',
    'machine learning': 'ml-engineer',
    'ai': 'ai-engineer',
    'cybersecurity': 'cyber-analyst',
    'cloud': 'cloud-engineer',
    'data analysis': 'data-analyst',
    'data': 'data-analyst',
  };
  const targetId = aliasMap[norm] || identifier;

  const query = 'SELECT id, name, description FROM careers WHERE id = ? OR LOWER(name) = LOWER(?) OR id = ? LIMIT 1';
  const stmt = db.prepare(query);
  stmt.bind([targetId, norm, identifier]);
  if (stmt.step()) {
    const row = stmt.get();
    stmt.free();
    return {
      id: row[0] as string,
      name: row[1] as string,
      description: row[2] as string,
    };
  }
  stmt.free();
  return null;
}

export function getSkillsForCareer(db: Database, careerId: string) {
  const query = `
    SELECT cs.career_id, cs.skill_id, s.name as skill_name, cs.required_level, cs.importance, cs.category
    FROM career_skills cs
    JOIN skills s ON cs.skill_id = s.id
    WHERE cs.career_id = ?
    ORDER BY cs.importance DESC
  `;
  const stmt = db.prepare(query);
  stmt.bind([careerId]);
  const results = [];
  while (stmt.step()) {
    const row = stmt.get();
    results.push({
      career_id: row[0] as string,
      skill_id: row[1] as string,
      skill_name: row[2] as string,
      required_level: row[3] as number,
      importance: row[4] as number,
      category: row[5] as string,
    });
  }
  stmt.free();
  return results;
}

export function getAllSkillRelationships(db: Database) {
  const res = db.exec('SELECT from_skill, to_skill, relationship_type, description FROM skill_relationships');
  if (!res.length || !res[0].values) return [];
  return res[0].values.map((row) => ({
    from_skill: row[0] as string,
    to_skill: row[1] as string,
    relationship_type: row[2] as string,
    description: row[3] as string,
  }));
}
