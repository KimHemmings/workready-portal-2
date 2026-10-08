import type { ModuleData } from '../modulesData';

export const module2: ModuleData = {
  id: 'M02',
  moduleNumber: 2,
  title: 'Professional Communication Across Industries',
  category: 'Workplace Expectations',
  estimatedMins: 20,
  pbasPoints: 5,
  videoScript: "Welcome to Module 2: Professional Communication Across Industries. Professional communication is the cornerstone of every successful Australian workplaceâ€”whether on a civil construction site, in an aged care facility, behind a retail counter, or in a corporate office. In this module, we examine how to master verbal protocols, written standards, active listening, and conflict resolution across multiple sectors.",

  lesson1Title: 'Communication Channels, Workplace Etiquette & Industry Protocols',
  lesson1Content: [
    'Effective communication in Australian workplaces requires choosing the right channel for your specific situation. Every sector operates under distinct communication frameworks: **Retail & Hospitality** rely on roster applications (e.g., Deputy, Tanda) and quick face-to-face handovers; **Health, Aged Care & Disability Support** strictly mandate detailed clinical handover logs and incident reports under legislative compliance; **Trades & Construction** use morning Toolbox Talks, SWMS (Safe Work Method Statements) sign-offs, and UHF radio channels; while **Office & Corporate** environments utilize email, Microsoft Teams, and formal project briefs.',
    'Regardless of the industry, a universal rule governs professional messaging: **urgent operational issues, safety hazards, and sudden shift absences demand real-time direct contact** (a direct phone call or SMS to your immediate supervisor). Routine inquiries, shift swap requests weeks in advance, and general updates belong in formal written channels. When messaging supervisors, maintain a professional structure: use an appropriate greeting, provide concise context, state your requested action or ETA clearly, and close politely without using informal text slang.'
  ],

  graphicCard1: {
    title: 'Industry Communication Matrix & Matching Self-Check',
    bullets: [
      'MATCHING CHALLENGE: Urgent Shift Absence (All Sectors) âž” Call or text supervisor directly at least 30 mins prior.',
      'MATCHING CHALLENGE: Clinical / Care Updates (Aged Care/Health) âž” Complete mandatory shift handover logs & inform RN on duty.',
      'MATCHING CHALLENGE: Site Hazards / Equipment Failure (Trades/Civil) âž” Use UHF radio immediately & report at Toolbox Talk.',
      'MATCHING CHALLENGE: Leave / Shift Swaps (Retail/Hospitality) âž” Submit formal request via roster app (Deputy/Tanda) 2 weeks out.',
      'âŒ ROOKIE MISTAKE: Sending a vague text like "can\'t come in" 5 minutes after your shift started.',
      'âœ… PRO MOVE: "Hi Sarah, my train is delayed due to a signal fault. My revised ETA is 8:20 AM. I will clock in immediately upon arrival."'
    ]
  },

  branchingScenario: {
    id: 'BS-02',
    situation: 'You work across multiple workplace environments (a busy retail floor, an aged care center, and a residential construction site). During a busy afternoon shift, an unexpected operational issue occurs that disrupts workflow and creates a potential safety hazard. What is the correct professional communication protocol?',
    options: [
      {
        id: 'opt1',
        choice: 'Option A: Write a brief note on the staff tearoom whiteboard and return to your regular tasks without speaking to anyone.',
        isCorrect: false,
        feedback: 'Clear explanation of why this causes issues: Passive whiteboard notes do not ensure immediate supervisor awareness, leaving active safety hazards and operational bottlenecks unmanaged.'
      },
      {
        id: 'opt2',
        choice: 'Option B: Verbally notify your direct supervisor immediately, follow up with required written safety or incident logs, and confirm corrective actions before continuing work.',
        isCorrect: true,
        feedback: 'Positive reinforcement detailing why this is the correct approach: Immediate direct verbal notification paired with formal written logging is the compliance standard across healthcare, construction, retail, and administration.'
      },
      {
        id: 'opt3',
        choice: 'Option C: Send a casual text message to a team member on social media asking them to mention it to management tomorrow.',
        isCorrect: false,
        feedback: 'Clear explanation of why this violates standards: Using social media for work issues violates workplace privacy policies, fails to notify the shift supervisor on duty, and breaches safety standards.'
      }
    ]
  },

  lesson2Title: 'Active Listening, Closed-Loop Communication & De-escalating Workplace Misunderstandings',
  lesson2Content: [
    'Miscommunication is one of the leading causes of workplace errors, rework, and safety incidents across Australian industries. Active listening requires full concentration on the speaker, avoiding interruptions, observing non-verbal cues, and validating understanding. In high-risk or fast-paced sectorsâ€”such as administering medication in care settings, operating machinery in trades, or processing high-volume customer orders in retailâ€”using **Closed-Loop Communication** (repeating instructions back) is an essential error-prevention tool.',
    'When workplace misunderstandings or performance feedback occur, handling them professionally requires emotional maturity and structured dialogue. Under **Fair Work guidelines** and standard dispute resolution policies, grievances or instructions should be addressed directly, calmly, and privately at the lowest possible organizational level. If an instruction is unclear, ask targeted clarifying questions (e.g., *"To confirm, do you want me to complete the safety check before or after unloading?"*). Accepting constructive feedback positively demonstrates adaptability and a commitment to professional growth.'
  ],

  practicalReflection: 'Consider a job sector you are aiming to work in (care work, retail, trades, or administration). What is one communication channel or reporting method unique to that industry, and how will you ensure you use it effectively?',
  actionStepTitle: 'Multi-Industry Professional Communication Practice',
  actionStepPrompt: 'Draft two professional communications in your notes: 1) A 3-sentence SMS to a supervisor requesting a 20-minute shift delay due to an emergency, and 2) A short, formal email requesting a shift swap for next week with a colleague.',

  quiz: [
    {
      id: 'Q1',
      question: 'In health, aged care, and disability support, what is the mandatory communication method for transferring client care information between shifts?',
      options: [
        'Formal clinical shift handovers and detailed written client progress logs',
        'Informal verbal chats in the staff parking lot after clocking off',
        'A casual post in an unverified group chat on social media'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why option 1 is correct: Care sectors legally mandate structured handover logs and clinical documentation to guarantee client safety, regulatory compliance, and continuity of care.'
    },
    {
      id: 'Q2',
      question: 'What is the standard rule when deciding between calling your supervisor versus sending an email?',
      options: [
        'Always send emails to avoid phone conversations',
        'Use direct phone calls or SMS for urgent operational issues and delays; use email for routine inquiries and formal documentation',
        'Use social media messaging for all work communication'
      ],
      correctAnswerIndex: 1,
      explanation: 'Detailed feedback explaining the core principle: Matching urgency to the channel ensures immediate operational issues are handled instantly while maintaining accurate written records for routine matters.'
    },
    {
      id: 'Q3',
      question: 'What is the primary operational objective of Closed-Loop Communication (repeating instructions back to the speaker)?',
      options: [
        'To fill time during slow workplace periods',
        'To verify instructions instantly, eliminate assumptions, and prevent costly or unsafe operational mistakes',
        'To pass responsibility for the task back to your supervisor'
      ],
      correctAnswerIndex: 1,
      explanation: 'Detailed feedback explaining why this protocol matters: Paraphrasing key details back ensures both parties share the exact same understanding before physical or administrative action is taken.'
    },
    {
      id: 'Q4',
      question: 'Under Fair Work guidelines and Australian workplace dispute policies, how should minor communication grievances or feedback be handled?',
      options: [
        'Through direct, calm, and private conversation with the direct supervisor or team leader involved',
        'By venting publicly in customer areas or posting on personal social media channels',
        'By immediately resigning from your position without discussing the matter'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed explanation referencing relevant standards: Fair Work frameworks and organizational policies require attempting respectful, direct resolution at the supervisor level before escalating.'
    },
    {
      id: 'Q5',
      question: 'When receiving multi-step instructions in a fast-paced environment (such as a busy retail store or construction site), what is the correct execution method?',
      options: [
        'Nod quickly without listening and guess the steps as you go',
        'Listen actively, repeat key details back to confirm understanding, and take brief written notes if required',
        'Interrupt the supervisor to state that you already know how to perform the work'
      ],
      correctAnswerIndex: 1,
      explanation: 'Detailed summary of the correct execution method: Combining active listening with immediate closed-loop confirmation and note-taking eliminates guesswork and ensures safety and accuracy.'
    }
  ]
};