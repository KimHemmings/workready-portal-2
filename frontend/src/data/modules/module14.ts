import type { ModuleData } from '../modulesData';

export const module14: ModuleData = {
  id: 'M14',
  moduleNumber: 14,
  title: 'Workplace Onboarding & Day 1 Success',
  category: 'Workplace Expectations',
  estimatedMins: 20,
  pbasPoints: 5,
  videoScript: "Welcome to Module 14: Workplace Onboarding & Day 1 Success. Securing a job offer is a major milestone, but your first week sets the trajectory for your long-term employment. In this module, we examine onboarding documentation, site inductions, establishing professional rapport, and making a powerful first impression on Day 1.",

  lesson1Title: 'Onboarding Compliance Documentation & Pre-Start Readiness',
  lesson1Content: [
    'Before stepping foot on site for your first shift in Australia—whether in healthcare, civil construction, logistics, retail, or administration—you must complete mandatory employment onboarding paperwork. Employers require these completed documents to establish your legal payroll, tax withholding, superannuation contributions, and site safety compliance under Fair Work and ATO regulations.',
    'Ensure you organize and submit your onboarding compliance pack prior to Day 1. This pack must include: 1) Tax File Number (TFN) Declaration form, 2) Superannuation Standard Choice form, 3) Verified bank account details for direct deposit, 4) Certified copies of valid licences/tickets (Driver Licence, White Card, First Aid, NDIS Check), and 5) Signed Employment Contract and Fair Work Information Statement acknowledgment.'
  ],

  graphicCard1: {
    title: 'Day 1 Execution: Pro Move vs. Rookie Mistake',
    bullets: [
      '❌ ROOKIE MISTAKE: Arriving on Day 1 without banking details, TFN, or required safety tickets, delaying your onboarding and pay setup.',
      '✅ PRO MOVE: Submitting all tax, super, and licence documentation 48 hours prior to your start date.',
      '❌ ROOKIE MISTAKE: Showing up right on shift start time without knowing where to report, who to meet, or where to park.',
      '✅ PRO MOVE: Conducting a dry-run commute the day before, arriving 15 minutes early, and asking for your supervisor by name.',
      'MATCHING CHALLENGE: Trades & Logistics ➔ Bring personal steel-caps, hi-vis, hard hat, and physical ticket copies.',
      'MATCHING CHALLENGE: Health & Care ➔ Bring certified police check, NDIS screening card, immunization records, and uniform.'
    ]
  },

  branchingScenario: {
    id: 'BS-14',
    situation: 'It is your first day at a new workplace (a medical clinic, building site, or retail distribution center). During morning site induction, your supervisor gives a fast-paced overview of site hazard reporting and emergency assembly points, but you miss where the emergency eyewash station and incident logbook are located. What is the correct professional action?',
    options: [
      {
        id: 'opt1',
        choice: 'Option A: Say nothing and nod politely, assuming you will eventually figure out where safety gear is located if an emergency happens.',
        isCorrect: false,
        feedback: 'Clear explanation of why this causes issues: Remaining silent about missed safety information creates severe risk for yourself and co-workers during an emergency.'
      },
      {
        id: 'opt2',
        choice: 'Option B: Wait until the supervisor finishes the main briefing, then ask a clear clarifying question to confirm the location of the eyewash station and incident log.',
        isCorrect: true,
        feedback: 'Positive reinforcement detailing why this is the correct approach: Asking clarifying questions during induction demonstrates safety awareness, high engagement, and professional responsibility.'
      },
      {
        id: 'opt3',
        choice: 'Option C: Interrupt the supervisor mid-sentence to complain that the induction is moving too quickly.',
        isCorrect: false,
        feedback: 'Clear explanation of why this violates standards: Interrupting formal inductions aggressively creates unnecessary tension with leadership and impacts group training.'
      }
    ]
  },

  lesson2Title: 'Navigating Site Inductions, First Impressions & Proactive Learning',
  lesson2Content: [
    'A **Workplace Site Induction** is a mandatory legal requirement under Work Health & Safety legislation. It introduces new staff to site-specific hazards, emergency evacuation routes, first aid officers, break procedures, and company policies. Approach your induction with 100% focus: take written notes, listen carefully to site-specific rules, and ensure you sign the official induction register upon completion.',
    'Your first two weeks represent your probationary baseline. Build strong workplace relationships by maintaining an approachable attitude, listening actively, and observing team dynamics. Introduce yourself politely to co-workers, follow established break schedules, keep shared tearooms clean, and ask constructive questions when receiving task instructions.'
  ],

  practicalReflection: 'Think about starting a new job. What are 3 specific questions you should ask your supervisor on Day 1 to ensure you perform your duties correctly and safely?',
  actionStepTitle: 'Onboarding Document Checklist & Preparation Task',
  actionStepPrompt: 'Open your digital files or physical binder. Create an "Onboarding Ready Pack" containing digital copies of your TFN, bank details, super fund details, photo ID, and verified industry tickets.',

  quiz: [
    {
      id: 'Q1',
      question: 'Which mandatory ATO tax document must be submitted to your employer upon commencing work to ensure correct pay withholding rates?',
      options: [
        'Tax File Number (TFN) Declaration form',
        'Annual Tax Assessment Notice from 5 years ago',
        'A copy of your personal utility bill'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why option 1 is correct: Submitting a completed TFN Declaration ensures your employer withhold tax at correct statutory rates, preventing higher emergency tax rates.'
    },
    {
      id: 'Q2',
      question: 'What is the primary operational purpose of a mandatory Workplace Site Induction on Day 1?',
      options: [
        'To inform new staff of site-specific hazards, emergency evacuation procedures, WH&S policies, and operational rules',
        'To test how fast new employees can run',
        'To reduce employee hourly pay rates during the first month'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining the core principle: Site inductions are legal safety requirements designed to protect worker health, explain hazard protocols, and ensure operational compliance.'
    },
    {
      id: 'Q3',
      question: 'When should onboarding documentation (banking, superannuation, TFN, ticket copies) ideally be provided to a new employer?',
      options: [
        'Prior to or on Day 1 of employment',
        '6 months after starting the job',
        'Only after you resign from the company'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why this protocol matters: Providing onboarding paperwork promptly ensures payroll setup is complete and guarantees on-time pay processing.'
    },
    {
      id: 'Q4',
      question: 'What is the most effective approach when receiving new task instructions during your first week on the job?',
      options: [
        'Listen actively, take brief notes if multi-step, and repeat key details back to confirm understanding',
        'Pretend you understand everything even if you are completely confused',
        'Refuse to perform tasks until you have worked at the company for 6 months'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed explanation referencing relevant standards: Active listening combined with brief confirmation eliminates errors, prevents safety hazards, and proves coachability.'
    },
    {
      id: 'Q5',
      question: 'How should you manage personal mobile phone usage during your first week on a new job site?',
      options: [
        'Store your phone in your bag or locker and check it strictly during designated meal breaks',
        'Keep your phone in your hand texting while receiving instructions',
        'Take personal video calls while operating machinery or attending to clients'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed summary of the correct execution method: Storing mobile devices away during operational hours shows respect, prevents distractions, and complies with workplace safety policies.'
    }
  ]
};