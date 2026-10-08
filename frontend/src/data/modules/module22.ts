import type { ModuleData } from '../modulesData';

export const module22: ModuleData = {
  id: 'M22',
  moduleNumber: 22,
  title: 'Navigating Workplace Change & Adaptability',
  category: 'Workplace Expectations',
  estimatedMins: 20,
  pbasPoints: 5,
  videoScript: "Welcome to Module 22: Navigating Workplace Change & Adaptability. Modern Australian workplaces evolve constantly through new technology, updated safety protocols, and changing client needs. In this module, we examine how to embrace change, master digital tools, remain resilient during restructuring, and showcase adaptability.",

  lesson1Title: 'The Growth Mindset & Adapting to New Workplace Technology',
  lesson1Content: [
    'Workplaces across civil construction, health and care, retail logistics, and corporate administration are continuously transformed by technologyâ€”such as digital roster apps (Deputy, Tanda), electronic health records, RF inventory scanners, automated machinery, and AI-driven management software. Employees who demonstrate a Growth Mindsetâ€”viewing new tools as opportunities to upskill rather than threatsâ€”are highly valued by employers.',
    'When your employer introduces new software, operational procedures, or equipment, avoid resisting or complaining. Instead, approach the change with curiosity: participate fully in training sessions, take written notes, practice using the system, and ask experienced colleagues for tips. Adaptable workers who master new systems quickly become indispensable team members.'
  ],

  graphicCard1: {
    title: 'Workplace Adaptability: Pro Move vs. Rookie Mistake',
    bullets: [
      'âŒ ROOKIE MISTAKE: Complaining about new software or processes and insisting on doing things the old way.',
      'âœ… PRO MOVE: Embracing new systems, attending training sessions enthusiastically, and helping co-workers adapt.',
      'âŒ ROOKIE MISTAKE: Panicking or spreading negative rumors during company restructures or shift changes.',
      'âœ… PRO MOVE: Remaining calm, seeking clear information from supervisors, and focusing on high personal performance.',
      'MATCHING CHALLENGE: Healthcare & Care âž” Adapt quickly to updated digital care logs, telehealth tools, and medication systems.',
      'MATCHING CHALLENGE: Retail & Trades âž” Master digital POS terminals, automated dispatch software, and electronic SWMS logs.'
    ]
  },

  branchingScenario: {
    id: 'BS-22',
    situation: 'Your company transitions from paper-based shift logs and rosters to a new digital mobile app. Several senior colleagues complain about the change and refuse to download the app. What is the correct professional approach?',
    options: [
      {
        id: 'opt1',
        choice: 'Option A: Join your colleagues in complaining and refuse to use the app until forced by management.',
        isCorrect: false,
        feedback: 'Clear explanation of why this causes issues: Resisting company digital adoption demonstrates poor adaptability and signals risk to management.'
      },
      {
        id: 'opt2',
        choice: 'Option B: Download the app promptly, complete the online tutorial, master the features, and offer polite help to struggling co-workers.',
        isCorrect: true,
        feedback: 'Positive reinforcement detailing why this is the correct approach: Mastering new tools quickly and supporting peers highlights digital literacy and leadership potential.'
      },
      {
        id: 'opt3',
        choice: 'Option C: Falsify your app login details and tell your manager the app crashed your phone.',
        isCorrect: false,
        feedback: 'Clear explanation of why this violates standards: Dishonesty regarding operational tools breaches workplace integrity policies.'
      }
    ]
  },

  lesson2Title: 'Managing Operational Restructuring & Shift Flexibility',
  lesson2Content: [
    'Operational changesâ€”such as roster reallocations, team restructuring, or supervisor changesâ€”occur frequently in fast-paced industries. Demonstrating flexibility regarding shift rotations, site locations, or task assignments makes you a flexible asset to your team.',
    'If a workplace change impacts your duties or personal schedule, manage the transition professionally. Request a brief meeting with your team leader to seek clarification, understand the operational reasons behind the decision, and discuss how you can align your work with the updated goals.'
  ],

  practicalReflection: 'Think about a major change you experienced recently. How did your attitude impact your ability to adapt, and what strategy will you use when facing change at work?',
  actionStepTitle: 'Digital Skill Audit & Adaptability Action Plan',
  actionStepPrompt: 'Identify 1 digital workplace tool commonly used in your target sector (e.g., MS Teams, Deputy, RF Scanners, or CareLog). Watch a 10-minute online tutorial to familiarize yourself with its features.',

  quiz: [
    {
      id: 'Q1',
      question: 'What defines a "Growth Mindset" when new technology or operational procedures are introduced at work?',
      options: [
        'Viewing new systems as valuable opportunities to learn, upskill, and improve workplace efficiency',
        'Refusing to learn new systems and demanding to use outdated paper logs',
        'Assuming new technology is designed to make workers fail'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why option 1 is correct: A growth mindset embraces change as a learning process, allowing workers to build digital literacy and advance.'
    },
    {
      id: 'Q2',
      question: 'How should an employee respond when an employer introduces new digital management software?',
      options: [
        'Participate fully in training, take notes, practice features, and adapt to the new workflow',
        'Complain publicly in the tearoom and ignore training emails',
        'Delete the software from company computers'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining the core principle: Proactively adopting company software shows adaptability and technical reliability.'
    },
    {
      id: 'Q3',
      question: 'Why is operational flexibility (such as adjusting to roster changes or new tasks) highly valued by Australian employers?',
      options: [
        'Flexible employees keep business operations running smoothly during unexpected workflow shifts or staffing shortages',
        'It allows employers to stop paying overtime rates permanently',
        'Flexibility is a legal requirement enforced by the police'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why this protocol matters: Adaptable workers resolve operational bottlenecks, making them key candidates for job retention.'
    },
    {
      id: 'Q4',
      question: 'What is the most constructive action to take if a company restructuring affects your daily duties?',
      options: [
        'Request a brief meeting with your manager to clarify updated expectations and align your work with new targets',
        'Stop attending shifts without telling anyone',
        'Spread unverified rumors to co-workers during lunch breaks'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed explanation referencing relevant standards: Seeking clear information from management reduces ambiguity and ensures performance standards are maintained.'
    },
    {
      id: 'Q5',
      question: 'How can you assist team members who are struggling to adapt to a new workplace tool or software?',
      options: [
        'Offer patient, constructive guidance and share practical tips you learned during training',
        'Mock them publicly in front of management',
        'Complete their work secretly without telling them how to use the tool'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed summary of the correct execution method: Supporting peers through change builds team cohesion and highlights supervisor potential.'
    }
  ]
};