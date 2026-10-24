export const STATS = [
  { id: 'connections', value: 500, suffix: '+', label: 'Student Connections', icon: 'users' },
  { id: 'mentors', value: 100, suffix: '+', label: 'Experienced Mentors', icon: 'graduation-cap' },
  { id: 'interviews', value: 200, suffix: '+', label: 'Interview Experiences', icon: 'briefcase' },
  { id: 'resources', value: 50, suffix: '+', label: 'Career Resources', icon: 'book-open' },
]

export const MENTORS = [
  {
    id: 'aarav',
    name: 'Aarav Sharma',
    college: 'IIT Delhi',
    department: 'Computer Science',
    role: 'Software Development Engineer Intern',
    company: 'Microsoft',
    skills: ['DSA', 'Java', 'Spring Boot'],
    mentorship: ['Coding interviews', 'Backend development'],
    intro: 'Completed two internship cycles and multiple coding rounds. Happy to help with Java backend prep and Microsoft-style interviews.',
    domain: 'Software Development',
    hasInternship: true,
  },
  {
    id: 'priya',
    name: 'Priya Verma',
    college: 'BITS Pilani',
    department: 'Information Systems',
    role: 'Data Analyst Intern',
    company: 'Deloitte',
    skills: ['SQL', 'Python', 'Power BI'],
    mentorship: ['Data analytics', 'Resume building', 'Aptitude preparation'],
    intro: 'Transitioned from campus aptitude tests to analytics roles. I share SQL practice plans and resume feedback for analytics tracks.',
    domain: 'Data Science and Analytics',
    hasInternship: true,
  },
  {
    id: 'rahul',
    name: 'Rahul Singh',
    college: 'VIT Vellore',
    department: 'CSE',
    role: 'Full Stack Developer',
    company: 'Startup Experience',
    skills: ['React', 'Node.js', 'MongoDB'],
    mentorship: ['MERN stack projects', 'Technical interviews'],
    intro: 'Built production MERN apps at an early-stage startup. Can review projects and mock full-stack interview questions.',
    domain: 'Web Development',
    hasInternship: true,
  },
  {
    id: 'ananya',
    name: 'Ananya Gupta',
    college: 'NIT Trichy',
    department: 'CSE',
    role: 'Competitive Programming Enthusiast',
    company: 'Campus Tech Club',
    skills: ['Java', 'DSA', 'Problem Solving'],
    mentorship: ['Coding rounds', 'Problem-solving strategies'],
    intro: 'Regular Codeforces participant. I help juniors structure DSA topics and approach timed coding assessments.',
    domain: 'Competitive Programming',
    hasInternship: false,
  },
  {
    id: 'karan',
    name: 'Karan Mehta',
    college: 'DTU',
    department: 'IT',
    role: 'Cybersecurity Intern',
    company: 'Quick Heal',
    skills: ['Networking', 'Linux', 'Security Fundamentals'],
    mentorship: ['Cybersecurity basics', 'Certification paths'],
    intro: 'Focused on SOC fundamentals and network security labs. Great for students exploring security careers.',
    domain: 'Cybersecurity',
    hasInternship: true,
  },
  {
    id: 'sneha',
    name: 'Sneha Reddy',
    college: 'IIIT Hyderabad',
    department: 'CSE',
    role: 'ML Research Intern',
    company: 'AI Lab',
    skills: ['Python', 'TensorFlow', 'Statistics'],
    mentorship: ['AI/ML projects', 'Higher studies planning'],
    intro: 'Working on NLP projects and publishing workshop papers. Can guide ML portfolio and grad school questions.',
    domain: 'Artificial Intelligence and Machine Learning',
    hasInternship: true,
  },
]

export const CAREER_CATEGORIES = [
  {
    id: 'swe',
    title: 'Software Development',
    description: 'System design basics, OOP, languages, and product engineering interview prep from seniors in product companies.',
    icon: 'code-2',
  },
  {
    id: 'ds',
    title: 'Data Science and Analytics',
    description: 'Statistics, SQL, visualization, and case-study interviews explained by students in analytics roles.',
    icon: 'bar-chart-3',
  },
  {
    id: 'web',
    title: 'Web Development',
    description: 'Discover project ideas, technology roadmaps, and practical tips for portfolio-worthy full-stack apps.',
    icon: 'globe',
  },
  {
    id: 'ai',
    title: 'Artificial Intelligence and Machine Learning',
    description: 'Learn project workflows, model basics, and how seniors prepared for ML internships and research roles.',
    icon: 'brain',
  },
  {
    id: 'sec',
    title: 'Cybersecurity',
    description: 'Explore networking, ethical hacking fundamentals, and certification paths with security-focused mentors.',
    icon: 'shield',
  },
  {
    id: 'cp',
    title: 'Competitive Programming',
    description: 'Improve speed, pattern recognition, and contest strategy with active competitive programmers.',
    icon: 'zap',
  },
  {
    id: 'placement',
    title: 'Campus Placements',
    description: 'Learn about aptitude rounds, online assessments, technical interviews, HR interviews, and recruitment strategies.',
    icon: 'building-2',
  },
  {
    id: 'intern',
    title: 'Internship Preparation',
    description: 'Understand how to find opportunities, improve your resume, and approach recruiters effectively.',
    icon: 'rocket',
  },
  {
    id: 'resume',
    title: 'Resume and LinkedIn Optimization',
    description: 'Get feedback on formatting, keywords, project descriptions, and professional online presence.',
    icon: 'file-text',
  },
  {
    id: 'higher',
    title: 'Higher Studies and Career Planning',
    description: 'Compare industry vs. higher studies, shortlist programs, and plan timelines with experienced seniors.',
    icon: 'map',
  },
]

export const INTERVIEW_EXPERIENCES = [
  {
    id: 'tcs-se',
    company: 'TCS',
    role: 'Software Engineer',
    year: 2025,
    rounds: 4,
    difficulty: 'Medium',
    summary:
      'An overview of an on-campus recruitment journey, including online assessment, coding round, technical interview, and HR discussion.',
    skills: ['DSA', 'OOP', 'DBMS', 'SQL', 'Problem Solving'],
    demo: true,
  },
  {
    id: 'infosys-se',
    company: 'Infosys',
    role: 'Systems Engineer',
    year: 2024,
    rounds: 3,
    difficulty: 'Easy',
    summary: 'Digital interview flow with aptitude, technical MCQs, and HR. Emphasis on communication and core CS fundamentals.',
    skills: ['Aptitude', 'DBMS', 'Networking', 'Java'],
    demo: true,
  },
  {
    id: 'cognizant',
    company: 'Cognizant',
    role: 'Programmer Analyst',
    year: 2025,
    rounds: 5,
    difficulty: 'Medium',
    summary: 'Multi-stage process with gamified aptitude, coding test, technical panel, and HR. Tips on time management included.',
    skills: ['DSA', 'SQL', 'Logical Reasoning'],
    demo: true,
  },
  {
    id: 'accenture',
    company: 'Accenture',
    role: 'Associate Software Engineer',
    year: 2024,
    rounds: 4,
    difficulty: 'Medium',
    summary: 'Communication assessment followed by technical and HR. Common questions on projects and teamwork scenarios.',
    skills: ['Communication', 'OOP', 'Projects'],
    demo: true,
  },
  {
    id: 'microsoft',
    company: 'Microsoft',
    role: 'SDE Intern',
    year: 2025,
    rounds: 6,
    difficulty: 'Hard',
    summary: 'Online assessment, multiple coding interviews, and AA focus on DSA, problem-solving approach, and project depth.',
    skills: ['DSA', 'System Design Basics', 'C++', 'Problem Solving'],
    demo: true,
  },
]

export const COMMUNITY_POSTS = [
  {
    id: 'post-1',
    author: 'Riya Kapoor',
    year: '3rd Year CSE',
    title: 'How I Prepared for My First Coding Assessment',
    description:
      'Here is the preparation strategy I followed for my first online assessment, including daily DSA practice, aptitude revision, mock tests, and the topics I focused on during the final week.',
    tags: ['Placements', 'DSA', 'Preparation'],
    likes: 42,
    comments: 8,
    time: '2 hours ago',
  },
  {
    id: 'post-2',
    author: 'Dev Patel',
    year: '4th Year IT',
    title: 'Best Resources to Learn Backend Development',
    description:
      'I am compiling useful resources for students who want to start backend development with Node.js, Express.js, REST APIs, and MongoDB. Feel free to share your recommendations.',
    tags: ['Backend', 'MERN', 'Learning Resources'],
    likes: 67,
    comments: 15,
    time: '5 hours ago',
  },
  {
    id: 'post-3',
    author: 'Meera Joshi',
    year: '2nd Year CSE',
    title: 'What Should I Prepare Before My First Technical Interview?',
    description:
      'I have started preparing for campus placements and would appreciate advice on the most important topics in OOP, DBMS, operating systems, networking, and problem solving.',
    tags: ['Interview Preparation', 'Career Advice'],
    likes: 31,
    comments: 22,
    time: '1 day ago',
  },
]

export const TRENDING_TOPICS = [
  { label: 'Campus Placements 2025', count: 128 },
  { label: 'Microsoft Intern Experiences', count: 86 },
  { label: 'MERN Project Ideas', count: 74 },
  { label: 'Aptitude Shortcuts', count: 61 },
  { label: 'Resume Reviews', count: 53 },
]

export const RESOURCES = [
  {
    id: 'dsa',
    title: 'Data Structures and Algorithms',
    description: 'Practice fundamental data structures, algorithmic patterns, coding problems, and interview-level questions.',
    duration: '8–12 weeks',
    icon: 'binary',
  },
  {
    id: 'core',
    title: 'Core Computer Science',
    description: 'Strengthen your understanding of DBMS, operating systems, computer networks, and object-oriented programming.',
    duration: '6–8 weeks',
    icon: 'cpu',
  },
  {
    id: 'web-roadmap',
    title: 'Web Development Roadmap',
    description: 'Learn frontend, backend, databases, APIs, authentication, deployment, and full-stack project development.',
    duration: '10–14 weeks',
    icon: 'layers',
  },
  {
    id: 'portfolio',
    title: 'Resume and Portfolio Building',
    description: 'Showcase projects, highlight technical skills, improve your resume, and build a professional portfolio.',
    duration: '2–3 weeks',
    icon: 'folder-kanban',
  },
  {
    id: 'aptitude',
    title: 'Aptitude and Assessment Preparation',
    description: 'Prepare for quantitative aptitude, logical reasoning, verbal ability, and company-specific online assessments.',
    duration: '4–6 weeks',
    icon: 'calculator',
  },
  {
    id: 'mock',
    title: 'Mock Interview Preparation',
    description: 'Practice explaining projects, answering technical questions, and presenting your thought process confidently.',
    duration: 'Ongoing',
    icon: 'mic',
  },
]

export const SUCCESS_STORIES = [
  {
    id: 'story-1',
    name: 'Vikram Desai',
    achievement: 'From DSA Practice to Placement Preparation',
    skills: ['DSA', 'Core CS', 'Mock Interviews'],
    approach: 'Daily 2-hour DSA blocks, weekend core subject revision, and bi-weekly peer mock interviews.',
    lesson: 'Consistency beats cramming—tracking weak topics mattered more than solving random hard problems.',
    demo: true,
  },
  {
    id: 'story-2',
    name: 'Isha Malhotra',
    achievement: 'Breaking Into Data Analytics Internships',
    skills: ['SQL', 'Python', 'Case Studies'],
    approach: 'Built three analytics mini-projects, documented them on GitHub, and practiced SQL daily on real datasets.',
    lesson: 'Portfolio projects that tell a story helped recruiters understand my thinking quickly.',
    demo: true,
  },
  {
    id: 'story-3',
    name: 'Arjun Nair',
    achievement: 'Full Stack Portfolio That Got Callbacks',
    skills: ['React', 'Node.js', 'MongoDB'],
    approach: 'Shipped one MERN app end-to-end with auth, deployed on cloud, and wrote clear README walkthroughs.',
    lesson: 'Deploying working software impressed mentors and interviewers more than unfinished feature lists.',
    demo: true,
  },
]

export const WHY_CHOOSE = [
  {
    title: 'Achievement-Based Mentor Discovery',
    description: 'Find seniors by exploring their skills, experience, accomplishments, and career interests.',
    icon: 'search',
  },
  {
    title: 'Personalized Peer Guidance',
    description: 'Ask questions and receive guidance that relates to your individual learning goals.',
    icon: 'message-circle',
  },
  {
    title: 'Real-Time Communication',
    description: 'Connect directly through an integrated messaging experience.',
    icon: 'messages-square',
  },
  {
    title: 'Authentic Interview Insights',
    description: 'Learn from shared placement journeys, interview questions, and preparation strategies.',
    icon: 'clipboard-list',
  },
  {
    title: 'Collaborative Learning',
    description: 'Discover resources, exchange ideas, and participate in discussions with other students.',
    icon: 'users-round',
  },
  {
    title: 'One Centralized Platform',
    description: 'Access mentorship, networking, community discussions, and career resources in one place.',
    icon: 'layout-grid',
  },
]

export const INNOVATION_POINTS = [
  'Achievement-based matching helps students discover relevant mentors.',
  'Real-time messaging supports immediate peer-to-peer communication.',
  'A centralized interview experience hub organizes practical recruitment insights.',
  'Community discussions encourage collaborative learning.',
  'Career-oriented profiles help students discover relevant skills and experience.',
  'A unified platform reduces the need to search across disconnected student groups.',
]

export const TECH_STACK = [
  'React.js',
  'Node.js',
  'Express.js',
  'MongoDB',
  'Socket.IO',
  'JWT Authentication',
  'REST APIs',
]

export const CHAT_CONVERSATIONS = [
  {
    id: 'c1',
    name: 'Aarav Sharma',
    status: 'online',
    preview: 'Start with arrays, strings, hashing...',
    time: '10:24 AM',
    unread: 0,
  },
  {
    id: 'c2',
    name: 'Priya Verma',
    status: 'offline',
    preview: 'Happy to review your resume draft.',
    time: 'Yesterday',
    unread: 2,
  },
  {
    id: 'c3',
    name: 'Rahul Singh',
    status: 'online',
    preview: 'Let us plan your MERN project milestones.',
    time: 'Mon',
    unread: 0,
  },
]

export const CHAT_MESSAGES_DEMO = [
  {
    id: 'm1',
    from: 'junior',
    text: 'Hi! I am preparing for campus placements. Could you suggest how I should start my DSA preparation?',
    time: '10:18 AM',
  },
  {
    id: 'm2',
    from: 'senior',
    text: 'Of course! Start with arrays, strings, hashing, and basic recursion. Practice consistently, revise OOP concepts, and solve questions based on the companies you are targeting.',
    time: '10:20 AM',
  },
  {
    id: 'm3',
    from: 'junior',
    text: 'Thanks! How should I balance DSA with core CS subjects?',
    time: '10:22 AM',
  },
  {
    id: 'm4',
    from: 'senior',
    text: 'Create a weekly plan that includes DSA practice and dedicated revision time for DBMS, OS, and computer networks. Take mock tests regularly.',
    time: '10:24 AM',
  },
]
