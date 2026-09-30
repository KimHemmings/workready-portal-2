import type { ModuleData } from '../modulesData';

export const module1: ModuleData = {
  id: 'M01',
  moduleNumber: 1,
  title: 'Understanding Employer Expectations & Workplace Culture',
  category: 'Workplace Expectations',
  estimatedMins: 20,
  pbasPoints: 5,
  videoScript: "Welcome to Module 1: Understanding Employer Expectations & Workplace Culture. Succeeding in any Australian job requires more than technical skill—it requires mastering professional punctuality, understanding implicit site culture, knowing your Fair Work rights, and receiving feedback like a pro. Let's get you job-ready across every industry.",

  lesson1Title: 'Punctuality, Site Readiness & Explicit vs. Implicit Workplace Culture',
  lesson1Content: [
    'In Australian workplaces—whether on a civil construction site, inside an aged care facility, behind a busy retail counter, or in a corporate office—punctuality is viewed as a direct measurement of your professional integrity and respect for your team. Arriving 10 minutes prior to your scheduled shift is an industry operational standard. This buffer window ensures you can complete mandatory sign-ins, put on required Personal Protective Equipment (PPE), undergo shift briefings or clinical handovers, and be 100% operational at your start time.',
    'Every organization functions on a combination of **Explicit Rules** (written policies, employment contracts, SWMS, and safety manuals) and **Implicit Cultural Norms** (unwritten expectations regarding team dynamics, break etiquette, communication channels, and mobile phone usage). Recognizing and adapting to these cultural nuances during your first 14 days builds strong professional trust with supervisors and peers alike.'
  ],

  graphicCard1: {
    title: 'Workplace Standards: Pro Move vs. Rookie Mistake',
    bullets: [
      '❌ ROOKIE MISTAKE: Arriving right on shift time or 5 minutes late, forcing teammates to cover your duties while you get ready.',
      '✅ PRO MOVE: Arriving 10 minutes early on site to sign in, set up PPE, and review shift notes so you hit the floor running.',
      '❌ ROOKIE MISTAKE: Checking personal social media or texting on your phone while on duty in customer, clinical, or active work zones.',
      '✅ PRO MOVE: Keeping personal mobile devices stored in your locker/bag, accessing them strictly during designated meal breaks.',
      '❌ ROOKIE MISTAKE: Assuming unwritten rules don\'t matter because they aren\'t explicitly printed in the employee handbook.',
      '✅ PRO MOVE: Observing how experienced team members handle shift handovers, tea room etiquette, and supervisor updates during week one.'
    ]
  },

  branchingScenario: {
    id: 'BS-01',
    situation: 'You are commuting to a shift across one of three settings (a retail store, a medical clinic, or a building site) when a major traffic incident delays public transport by 25 minutes. Your revised arrival time will be 15 minutes past your scheduled start time. What is the correct professional procedure?',
    options: [
      {
        id: 'opt1',
        choice: 'Option A: Wait until you arrive at the worksite to explain the situation in person so you do not distract your manager while they are setting up.',
        isCorrect: false,
        feedback: 'Clear explanation: Arriving late without prior notice disrupts team task allocation, forces colleagues to cover your workload, and damages your professional credibility.'
      },
      {
        id: 'opt2',
        choice: 'Option B: Contact your direct supervisor immediately via phone call or SMS, explain the specific cause of delay, provide a realistic ETA, and apologize for the inconvenience.',
        isCorrect: true,
        feedback: 'Positive reinforcement: Excellent! Proactive communication allows management to reallocate resources or adjust shift duties. It demonstrates accountability, transparency, and respect for site operations.'
      },
      {
        id: 'opt3',
        choice: 'Option C: Send a private text message to a co-worker asking them to sign the attendance sheet or clock in on your behalf.',
        isCorrect: false,
        feedback: 'Clear explanation: Asking a colleague to falsify attendance or safety records violates company compliance policy and can result in summary dismissal for both employees.'
      }
    ]
  },

  lesson2Title: 'National Employment Standards, Duty of Care & The Feedback Loop',
  lesson2Content: [
    'Workplace expectations are a balanced, two-way relationship. Under the **National Employment Standards (NES)** enforced by the **Fair Work Ombudsman**, every Australian worker is entitled to minimum conditions, safe working environments under Work Health and Safety (WH&S) legislation, fair remuneration under modern awards, protection against unlawful discrimination, and transparent workplace policies.',
    'A critical factor in job retention is your capacity to receive, process, and apply constructive feedback. Supervisors evaluate new employees on their adaptability, coachability, and willingness to learn. When receiving constructive advice, view it as professional coaching rather than personal criticism. Practicing **Active Listening**—maintaining eye contact, taking notes, asking clarifying questions, and adjusting your performance—signals high professional maturity.'
  ],

  practicalReflection: 'Reflect on a past employment, educational, or team experience where miscommunication occurred. What specific active listening or confirmation technique could have eliminated the error?',
  actionStepTitle: 'Multi-Industry Punctuality & Commute Audit Task',
  actionStepPrompt: 'Identify a target workplace location in your area (e.g., retail center, hospital, office park, or industrial estate). Research primary and secondary transit routes, calculate peak-hour traffic buffers, and write down a personal site arrival target time that guarantees you are present 10 minutes prior to start.',

  quiz: [
    {
      id: 'Q1',
      question: 'Why is arriving 10 minutes prior to your official shift start time considered an operational standard across Australian industries?',
      options: [
        'It ensures safety sign-ins, PPE setup, and shift briefings are complete so paid work begins promptly at start time',
        'Employers use this extra time to reduce the overall length of mandatory rest breaks',
        'It is a mandatory taxation requirement enforced by the Australian Taxation Office'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why option 1 is correct: Arriving 10 minutes early allows all necessary administrative, safety, and preparation tasks to be completed without encroaching on operational time.'
    },
    {
      id: 'Q2',
      question: 'How do implicit workplace cultural norms differ from explicit written policies?',
      options: [
        'Explicit policies are legally binding state laws, while implicit norms are voluntary government guidelines',
        'Explicit policies are formal written rules, whereas implicit norms represent unwritten social standards, etiquette, and team expectations',
        'Implicit cultural norms are documented in union agreements, while explicit policies are verbal instructions'
      ],
      correctAnswerIndex: 1,
      explanation: 'Detailed feedback explaining the core principle: Explicit policies define formal operational and legal rules, while implicit cultural norms govern day-to-day team communication, etiquette, and informal behaviors.'
    },
    {
      id: 'Q3',
      question: 'What is the required professional protocol if an unexpected delay occurs during your commute to work?',
      options: [
        'Wait until you arrive on site to explain the delay in person to avoid bothering your manager',
        'Contact your supervisor as early as possible with a clear explanation and an updated, accurate arrival ETA',
        'Request that a co-worker sign the attendance register on your behalf'
      ],
      correctAnswerIndex: 1,
      explanation: 'Detailed feedback explaining why this protocol matters: Prompt communication allows management to reallocate tasks and maintain operational productivity while demonstrating personal accountability.'
    },
    {
      id: 'Q4',
      question: 'Which Australian statutory agency is responsible for enforcing minimum employment standards, award rates, and workplace rights?',
      options: [
        'The Fair Work Ombudsman / Fair Work Commission',
        'SafeWork Australia',
        'The Australian Human Rights Commission'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed explanation referencing relevant standards: The Fair Work Ombudsman regulates compliance with Australian workplace laws, National Employment Standards, and modern awards.'
    },
    {
      id: 'Q5',
      question: 'What is the primary objective of applying active listening when receiving performance feedback from a manager?',
      options: [
        'To defend your previous actions and explain why mistakes were unavoidable',
        'To fully comprehend the performance expectation, confirm key instructions, and apply necessary adjustments immediately',
        'To show polite agreement while continuing to use your preferred working methods'
      ],
      correctAnswerIndex: 1,
      explanation: 'Detailed summary of the correct execution method: Active listening ensures complete clarity on expectations, eliminates recurring errors, and demonstrates a professional commitment to continuous skill improvement.'
    }
  ]
};