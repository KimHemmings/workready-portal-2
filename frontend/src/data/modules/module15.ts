import type { ModuleData } from '../modulesData';

export const module15: ModuleData = {
  id: 'M15',
  moduleNumber: 15,
  title: 'Workplace Trials & Demonstrating Value',
  category: 'Interviews & Selection',
  estimatedMins: 20,
  pbasPoints: 5,
  videoScript: "Welcome to Module 15: Workplace Trials & Demonstrating Value. Practical skills tests and workplace trials are increasingly used by Australian employers to evaluate candidate suitability. In this module, we examine legal trial guidelines under Fair Work, safety expectations during trials, and strategies to showcase your initiative.",

  lesson1Title: 'Understanding Work Trials & Fair Work Legal Protections',
  lesson1Content: [
    'Workplace skill assessments and practical trials are common across Australian hospitality, retail, trades, automotive, and care sectors. However, candidates must understand their legal protections under the *Fair Work Act*. A **Unpaid Skill Demonstration** is only lawful if: 1) It is strictly for the purpose of evaluating your practical skills, 2) It lasts only for the duration necessary to demonstrate those skills (typically 1 to 4 hours depending on the industry), and 3) You are directly supervised throughout the evaluation.',
    'If an employer asks you to perform actual productive work beyond a brief skills evaluationâ€”such as working an entire 8-hour operational shift, covering for an absent staff member, or working unsupervisedâ€”the trial **must be paid** at the appropriate Modern Award hourly rate. Knowing the difference between a legitimate skills assessment and unlawful unpaid work protects your rights while demonstrating professional industry awareness.'
  ],

  graphicCard1: {
    title: 'Workplace Trial Rules: Pro Move vs. Rookie Mistake',
    bullets: [
      'âŒ ROOKIE MISTAKE: Agreeing to work a full 5-day "unpaid trial" doing regular productive shifts without pay or contract.',
      'âœ… PRO MOVE: Participating enthusiastically in brief, supervised 2-hour skill evaluations while knowing Fair Work pay rules.',
      'âŒ ROOKIE MISTAKE: Arriving at a practical work trial without correct safety gear or standing around waiting to be told what to do.',
      'âœ… PRO MOVE: Bringing mandatory PPE, listening carefully to site safety briefings, and showing proactive work ethic.',
      'MATCHING CHALLENGE: Hospitality/Retail âž” Demonstrate POS operation, customer engagement, and clean workstation upkeep.',
      'MATCHING CHALLENGE: Trades & Care âž” Demonstrate pre-start checks, proper manual handling technique, and WH&S awareness.'
    ]
  },

  branchingScenario: {
    id: 'BS-15',
    situation: 'You are invited to a 2-hour practical skills trial at a local business (e.g., demonstrating espresso machine operation in hospitality, a forklift load check in logistics, or a manual handling technique in care). Midway through the trial, the manager walks away and leaves you alone to run the section for the next 3 hours. What is the appropriate response?',
    options: [
      {
        id: 'opt1',
        choice: 'Option A: Say nothing and work the rest of the day unpaid without supervision, hoping they will eventually hire you.',
        isCorrect: false,
        feedback: 'Clear explanation of why this causes issues: Working extended unsupervised operational shifts unpaid breaches Fair Work standards and exposes you to unmanaged workplace injury risks.'
      },
      {
        id: 'opt2',
        choice: 'Option B: Complete your scheduled 2-hour skill assessment, then politely check in with the shift supervisor to summarize your completed tasks and confirm next steps in the hiring process.',
        isCorrect: true,
        feedback: 'Positive reinforcement detailing why this is the correct approach: Re-engaging the supervisor at the conclusion of your agreed evaluation period maintains professional boundaries and prompts a clear recruitment decision.'
      },
      {
        id: 'opt3',
        choice: 'Option C: Stop working abruptly, yell at staff that the business is breaking the law, and walk out.',
        isCorrect: false,
        feedback: 'Clear explanation of why this violates standards: Reacting aggressively ruins candidate rapport and eliminates job opportunities; compliance boundaries should be managed calmly and professionally.'
      }
    ]
  },

  lesson2Title: 'Showcasing Initiative, Safety Standards & Value Creation',
  lesson2Content: [
    'To stand out during a practical work trial, focus on three key pillars: **Safety Compliance, Attention to Detail, and Proactive Work Ethic**. Before handling any machinery or performing tasks, ask for site-specific safety instructions. Demonstrating that safety is your top priority instantly builds trust with supervisors.',
    'Show initiative by keeping work areas clean, observing established workflows, and asking constructive questions during downtime. For example, if you complete a assigned trial task early, say: *"I\'ve finished prepping Bay 1. Would you like me to tidy the packaging station or assist with the next delivery?"* This proactive drive separates top candidates from passive applicants.'
  ],

  practicalReflection: 'Think about a practical skill in your target job field. How can you demonstrate high safety awareness and attention to detail while performing that skill in front of an evaluator?',
  actionStepTitle: 'Practical Trial Readiness Checklist',
  actionStepPrompt: 'Open your notes app. Write down 3 key practical skills for your target role, list the required PPE needed to demonstrate them safely, and draft a 1-sentence proactive line you can say to an evaluator upon finishing a task.',

  quiz: [
    {
      id: 'Q1',
      question: 'Under Fair Work Ombudsman guidelines, what condition makes a brief unpaid job trial lawful in Australia?',
      options: [
        'It is strictly limited to the time necessary to demonstrate practical skills (typically 1â€“4 hours) and is directly supervised',
        'The employer can keep you on unpaid trial for up to 3 months as long as they provide lunch',
        'Unpaid trials are mandatory for all workers for the first 30 days of employment'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why option 1 is correct: Unpaid trials are only lawful if limited to brief skill demonstrations necessary to evaluate candidate suitability under direct supervision.'
    },
    {
      id: 'Q2',
      question: 'What must occur if an employer requires a candidate to work regular, unsupervised productive shifts beyond a brief skills test?',
      options: [
        'The candidate must be formally employed and paid the appropriate minimum award rate for all hours worked',
        'The candidate must pay the employer a training fee',
        'The hours are logged as voluntary community work with zero pay'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining the core principle: Productive work that yields commercial output for an employer must be paid under relevant Modern Award rates.'
    },
    {
      id: 'Q3',
      question: 'What is the most critical element to demonstrate first during any practical skills assessment on a job site?',
      options: [
        'Strict adherence to Work Health & Safety (WH&S) procedures and correct PPE usage',
        'Working at maximum speed without looking at safety manuals',
        'Telling the evaluator how to improve their business operations'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why this protocol matters: Demonstrating safety awareness and proper PPE usage proves site-readiness and protects against workplace accidents.'
    },
    {
      id: 'Q4',
      question: 'How should you communicate with an evaluator when you complete an assigned trial task ahead of time?',
      options: [
        'Inform them politely that the task is complete and ask where you can assist next',
        'Sit down and check social media until someone notices you',
        'Leave the worksite immediately without telling anyone'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed explanation referencing relevant standards: Communicating task completion and asking for the next assignment highlights high initiative and strong work ethic.'
    },
    {
      id: 'Q5',
      question: 'What physical items should you bring when attending a practical work trial in trades, logistics, or care sectors?',
      options: [
        'All required industry PPE (e.g., steel-caps, hi-vis, non-slip shoes), physical ticket copies, notebook, and pen',
        'Casual beach wear and headphones',
        'No items are required; employers supply personal footwear and clothing'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed summary of the correct execution method: Arriving fully equipped with industry-compliant PPE and tickets proves professional readiness and respect for site standards.'
    }
  ]
};