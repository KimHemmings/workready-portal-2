import type { ModuleData } from '../modulesData';

export const module12: ModuleData = {
  id: 'M12',
  moduleNumber: 12,
  title: 'Job Search Strategies & Hidden Job Market Networking',
  category: 'Job Searching',
  estimatedMins: 20,
  pbasPoints: 5,
  videoScript: "Welcome to Module 12: Job Search Strategies & Hidden Job Market Networking. Did you know up to 70% of Australian job vacancies are never advertised on public job boards? In this module, we examine how to tap into the hidden job market, leverage recruitment agencies, approach employers directly, and build a high-impact personal referral network.",

  lesson1Title: 'The Hidden Job Market & Cold Outreach Strategies',
  lesson1Content: [
    'Many jobseekers rely exclusively on public job boards like SEEK, Indeed, and Jora. However, recruitment industry data shows that up to 70% of roles in Australia are filled through internal referrals, direct employer approaches, and recruitment agency talent pools before ever being publicly advertised. Unadvertised vacancies represent the **Hidden Job Market**. Tapping into this space dramatically reduces candidate competition and accelerates employment placement.',
    'Accessing the hidden job market requires an active, direct approach. Identify medium-to-large businesses in your local area across your target sector (such as logistics hubs, healthcare facilities, civil contractors, or retail centers). Research the relevant Operations Manager, Site Supervisor, or Recruitment Lead. Reach out via a concise email, LinkedIn message, or in-person site visit to present a professional 30-second introduction, highlight your key tickets/licences, and inquire about upcoming unadvertised staffing needs.'
  ],

  graphicCard1: {
    title: 'Job Search Execution: Pro Move vs. Rookie Mistake',
    bullets: [
      '❌ ROOKIE MISTAKE: Applying to 50 public job board ads per week with a generic resume and waiting passively for phone calls.',
      '✅ PRO MOVE: Combining online applications with direct employer cold outreach, recruiter registration, and local industry networking.',
      '❌ ROOKIE MISTAKE: Walking onto an active construction site, care facility, or office unannounced without neat attire or physical ticket copies.',
      '✅ PRO MOVE: Arriving neatly dressed, asking for the hiring manager, and leaving a clean resume with a printed list of current tickets.',
      'MATCHING CHALLENGE: Trades & Civil ➔ Cold-approach site offices directly; register with specialized labor-hire recruitment agencies.',
      'MATCHING CHALLENGE: Care & Community ➔ Attend local disability/aged care provider expos; connect with facility coordinators on LinkedIn.'
    ]
  },

  branchingScenario: {
    id: 'BS-12',
    situation: 'You are targeting an entry-level position in logistics, healthcare, or retail. Public job ads in your local suburban area are scarce this week. What is the most effective proactive strategy to unlock job opportunities?',
    options: [
      {
        id: 'opt1',
        choice: 'Option A: Stop your job search activity entirely for the week and wait until new job advertisements are posted on public job sites.',
        isCorrect: false,
        feedback: 'Clear explanation of why this causes issues: Passive searching relies strictly on advertised roles, missing 70% of hidden employment opportunities and prolonging unemployment periods.'
      },
      {
        id: 'opt2',
        choice: 'Option B: Research 10 local businesses in your target sector, make professional direct contact to present your tickets/skills, and register with 2 specialized local recruitment agencies.',
        isCorrect: true,
        feedback: 'Positive reinforcement detailing why this is the correct approach: Proactive direct outreach and recruiter registration place your profile directly in front of hiring managers before roles are publicly advertised.'
      },
      {
        id: 'opt3',
        choice: 'Option C: Post a frantic plea on personal social media channels complaining that no employers in your suburb are hiring.',
        isCorrect: false,
        feedback: 'Clear explanation of why this violates standards: Publicly complaining about a lack of jobs damages your professional brand and signals a lack of strategic jobsearch initiative.'
      }
    ]
  },

  lesson2Title: 'Leveraging Recruitment Agencies & Professional Networking',
  lesson2Content: [
    'Recruitment agencies and labor-hire firms play a massive role in the Australian workforce, particularly across civil trades, warehousing, healthcare, administration, and hospitality. Working with recruitment consultants gives you an insider advocate who actively matches your skill profile to commercial client vacancies. When contacting labor-hire agencies, treat your initial phone interview with the recruiter as a formal job interview: maintain high professionalism, state your ticket availability clearly, and confirm your reliable transport status.',
    'Networking is simply building mutually beneficial professional relationships. Inform your existing personal network—former colleagues, TAFE trainers, sporting coaches, neighbors, and community leaders—that you are actively seeking work in a specific sector. Personal word-of-mouth recommendations carry immense weight with Australian small-to-medium business owners, often skipping initial screening hurdles entirely.'
  ],

  practicalReflection: 'Identify 3 people in your existing personal or community network (former supervisors, TAFE instructors, family friends in business). How can you contact them this week to let them know you are job-ready?',
  actionStepTitle: 'Hidden Job Market Target & Agency Registration Task',
  actionStepPrompt: 'Identify 3 local businesses in your target industry that are within a 30-minute commute. Find their phone number or recruitment contact email, and register your resume with 2 local labor-hire or specialist recruitment agencies.',

  quiz: [
    {
      id: 'Q1',
      question: 'Approximately what percentage of employment vacancies in Australia are filled through the "Hidden Job Market" rather than public job ads?',
      options: [
        'Up to 70% of job roles are unadvertised and filled through direct outreach, agency pools, and referrals',
        'Less than 5% of jobs are unadvertised',
        '100% of Australian jobs must legally be advertised on public job boards'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why option 1 is correct: Up to 70% of vacancies are filled via direct networking, recruiter talent pools, and internal referrals before reaching public job boards.'
    },
    {
      id: 'Q2',
      question: 'What is the primary advantage of registering your resume directly with labor-hire and specialist recruitment agencies?',
      options: [
        'Recruiters actively advocate for your profile and match your skills directly to open client vacancies across multiple companies',
        'Recruitment agencies pay you a daily wage even if you are not working on a assignment',
        'Agency registration automatically guarantees a permanent government job'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining the core principle: Recruitment agencies maintain direct commercial relationships with dozens of hiring managers, giving you priority access to short-term and permanent vacancies.'
    },
    {
      id: 'Q3',
      question: 'How should you treat an initial phone call or screening chat with a recruitment agency consultant?',
      options: [
        'With the exact same high level of professionalism, clear communication, and presentation as a formal employer interview',
        'As an informal, casual chat using text slang and missing details',
        'By complaining about how difficult previous employers were to work with'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why this protocol matters: Recruiters evaluate candidate reliability during initial contact; treating agency screeners professionally ensures they confidently advocate for you to clients.'
    },
    {
      id: 'Q4',
      question: 'What is the most effective approach when making direct, unadvertised contact with a local business in your target sector?',
      options: [
        'Present a brief, polished summary of your background, highlight valid tickets/licences, and express genuine interest in upcoming opportunities',
        'Demand an immediate paid shift on the spot from the receptionist',
        'Drop off an unformatted hand-written note without your phone number'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed explanation referencing relevant standards: Providing a concise overview of your site-readiness and valid tickets allows employers to add your details directly to their active candidate backup file.'
    },
    {
      id: 'Q5',
      question: 'How does personal word-of-mouth networking assist in securing employment in Australian regional and suburban areas?',
      options: [
        'Employers trust personal recommendations from respected community or industry contacts, often fast-tracking candidates to interviews',
        'Networking eliminates the need to ever hold safety tickets or driver licences',
        'It forces employers to bypass mandatory pre-employment background checks'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed summary of the correct execution method: Word-of-mouth recommendations establish trust quickly, encouraging employers to interview endorsed candidates before advertising publicly.'
    }
  ]
};