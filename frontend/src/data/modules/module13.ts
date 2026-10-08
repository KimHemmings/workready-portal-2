import type { ModuleData } from '../modulesData';

export const module13: ModuleData = {
  id: 'M13',
  moduleNumber: 13,
  title: 'Goal Setting, Action Planning & PBAS Tracking',
  category: 'Job Searching',
  estimatedMins: 20,
  pbasPoints: 5,
  videoScript: "Welcome to Module 13: Goal Setting, Action Planning & PBAS Tracking. Consistency is the engine of jobsearch success. In this module, we examine how to set SMART employment goals, structure weekly job search action plans, manage your PBAS point requirements, and maintain momentum throughout your career journey.",

  lesson1Title: 'SMART Employment Goals & Weekly Action Cadence',
  lesson1Content: [
    'Job searching without a structured weekly plan leads to frustration, burnout, and missed mutual obligation targets. To maintain continuous momentum, structure your employment efforts using the **SMART Goal Framework**: goals must be **Specific, Measurable, Achievable, Relevant, and Time-bound**. Instead of setting a vague goal like *"I am going to look for jobs this week"*, a SMART goal states: *"I will submit 4 tailored applications, make 2 direct employer cold approaches, and attend 1 recruiter interview by 4:00 PM on Friday."*',
    'Establishing a disciplined daily cadence transforms job searching into a professional routine. Treat your job search like a job itself. Schedule set morning blocks (e.g., 9:00 AM to 12:00 PM) for job ad analysis, application tailoring, and telephone follow-ups. Reserving dedicated afternoon hours for physical site visits, ticket study, and TAFE/training upgrades prevents procrastination and guarantees consistent output.'
  ],

  graphicCard1: {
    title: 'Job Search Discipline: Pro Move vs. Rookie Mistake',
    bullets: [
      'âŒ ROOKIE MISTAKE: Searching for jobs sporadically for 30 minutes once a week right before your Workforce Australia report is due.',
      'âœ… PRO MOVE: Working a disciplined daily 3-hour job search routine (Monday to Friday) with structured target quotas.',
      'âŒ ROOKIE MISTAKE: Failing to record job search details, resulting in missing PBAS points and compliance penalties.',
      'âœ… PRO MOVE: Logging every job application, interview, and module completion immediately in your job search tracking log.',
      'MATCHING CHALLENGE: SMART Goal âž” "Complete 1 learning module and log 3 tailored applications every Tuesday and Thursday."',
      'MATCHING CHALLENGE: PBAS Target âž” Earn mandatory monthly PBAS points by combining job search tasks, study, and module completions.'
    ]
  },

  branchingScenario: {
    id: 'BS-13',
    situation: 'You are setting your job search targets for the upcoming month under your Workforce Australia Points Based Activation System (PBAS) requirements. You need to meet your monthly points target while actively progressing toward a full-time position in your chosen field. What is the most effective structured strategy?',
    options: [
      {
        id: 'opt1',
        choice: 'Option A: Wait until the final 2 days of your reporting month, then rapidly click submit on 20 random online job ads without tailoring your resume.',
        isCorrect: false,
        feedback: 'Clear explanation of why this causes issues: Last-minute panic searching produces low-quality applications, yields zero job interviews, and risks compliance reporting errors.'
      },
      {
        id: 'opt2',
        choice: 'Option B: Create a weekly action calendar that spreads high-quality tailored applications, training module completions (+5 points each), and direct employer approaches evenly across all 4 weeks.',
        isCorrect: true,
        feedback: 'Positive reinforcement detailing why this is the correct approach: Spreading job search tasks evenly ensures consistent quality, eliminates reporting stress, and systematically generates real interview opportunities.'
      },
      {
        id: 'opt3',
        choice: 'Option C: Submit false job search entries into your reporting portal and hope your Employment Services provider does not audit your activity.',
        isCorrect: false,
        feedback: 'Clear explanation of why this violates standards: Falsifying job search reports violates DEWR compliance frameworks, resulting in payment suspensions and formal provider audits.'
      }
    ]
  },

  lesson2Title: 'Managing PBAS Points, Compliance & Maintaining Resilience',
  lesson2Content: [
    'Under Australiaâ€™s **Points Based Activation System (PBAS)** overseen by the Department of Employment and Workplace Relations (DEWR), jobseekers complete a customized monthly points target (typically 100 points per reporting period). Points are earned through diverse job-seeking activities: submitting job applications, attending interviews, participating in provider appointments, completing accredited training, and completing certified vocational learning modules (such as these 24 modules, earning **+5 PBAS points** per completed module with audit verification).',
    'Job search resilience is a critical mindset skill. Facing rejections or slow response times is a natural part of the recruitment process, not a reflection of your worth. Maintain momentum by tracking your progress visually in a job search logbook or spreadsheet. Celebrate small winsâ€”such as completing an updated master resume, tailoring a cover letter, or finishing a learning module. Maintaining physical health, structured routines, and positive community connections keeps your energy high until you land your ideal position.'
  ],

  practicalReflection: 'Look at your weekly routine. What specific 2-hour daily time block can you lock in exclusively for job search tasks, application tailoring, and module learning?',
  actionStepTitle: 'Weekly Action Plan & PBAS Target Spreadsheet Setup',
  actionStepPrompt: 'Open a notepad or digital spreadsheet. Create a weekly job search schedule allocating specific days for: 1) Application tailoring (3 target ads), 2) Direct employer outreach (2 local companies), and 3) Module learning (+5 PBAS points completion).',

  quiz: [
    {
      id: 'Q1',
      question: 'What do the letters in the SMART goal-setting framework stand for?',
      options: [
        'Specific, Measurable, Achievable, Relevant, Time-bound',
        'Fast, Simple, Direct, Automatic, Flexible',
        'Speed, Money, Ambition, Results, Talent'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why option 1 is correct: SMART stands for Specific, Measurable, Achievable, Relevant, and Time-boundâ€”the proven formula for effective goal setting.'
    },
    {
      id: 'Q2',
      question: 'How does Australia\'s Points Based Activation System (PBAS) measure jobseeker compliance each month?',
      options: [
        'By requiring jobseekers to accumulate a customized monthly points target through varied tasks like applications, interviews, and learning modules',
        'By measuring the physical distance walked during a job search',
        'By testing candidates on general academic history every 30 days'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining the core principle: PBAS gives jobseekers flexibility to meet their mutual obligation requirements through a combination of job search activities, learning, and provider appointments.'
    },
    {
      id: 'Q3',
      question: 'What is the primary risk of delaying all job search and reporting tasks until the final two days of your monthly PBAS reporting cycle?',
      options: [
        'It results in low-quality applications, high personal stress, zero interview invitations, and potential payment suspension risks',
        'It automatically doubles the salary offered by employers',
        'There is no risk; employers prefer last-minute applications'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why this protocol matters: Last-minute rushing leads to unformatted, generic applications that fail recruiter screening and increase compliance reporting errors.'
    },
    {
      id: 'Q4',
      question: 'How many PBAS compliance points are awarded upon completing each certified vocational learning module in this app?',
      options: [
        '+5 PBAS Points per completed module with verifiable completion logs',
        '+50 PBAS Points per module',
        'Zero points; modules carry no compliance credit'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed explanation referencing relevant standards: Each completed learning module provides +5 verified PBAS points toward your monthly DEWR mutual obligation target.'
    },
    {
      id: 'Q5',
      question: 'What is the most effective psychological strategy for maintaining long-term motivation during an extended job search?',
      options: [
        'Establishing a disciplined daily routine, tracking application milestones, and focusing on continuous skill improvement',
        'Isolating yourself and stopping all communication with support providers',
        'Applying to jobs in industries you have no interest or qualifications in'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed summary of the correct execution method: Maintaining a daily routine, celebrating progress milestones, and completing skills training builds personal resilience until employment is secured.'
    }
  ]
};