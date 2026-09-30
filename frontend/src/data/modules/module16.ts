import type { ModuleData } from '../modulesData';

export const module16: ModuleData = {
  id: 'M16',
  moduleNumber: 16,
  title: 'Professional Integrity & Ethical Workplace Conduct',
  category: 'Workplace Expectations',
  estimatedMins: 20,
  pbasPoints: 5,
  videoScript: "Welcome to Module 16: Professional Integrity & Ethical Conduct. Trustworthiness and accountability are non-negotiable qualities in every Australian workplace. In this module, we examine honesty, handling confidential information, preventing conflicts of interest, and maintaining high ethical standards across all industries.",

  lesson1Title: 'Workplace Ethics, Honesty & Protecting Confidentiality',
  lesson1Content: [
    'Professional integrity means doing the right thing, even when no one is watching. In Australian workplaces—whether handling client medical records in care, managing cash registers in retail, processing sensitive files in administration, or handling materials in construction—employers rely on your honesty, reliability, and moral judgment.',
    'A core element of ethical conduct is maintaining **Privacy and Confidentiality**. Under the *Privacy Act 1988*, workers are legally obligated to protect sensitive customer, patient, and company data. Never discuss private client details, financial figures, or internal business operations outside of work or on personal social media platforms. Breaching confidentiality destroys employer trust and can result in immediate termination or legal liability.'
  ],

  graphicCard1: {
    title: 'Ethical Standards: Pro Move vs. Rookie Mistake',
    bullets: [
      '❌ ROOKIE MISTAKE: Taking photos of workplace client records, job sites, or internal documents and posting them on social media.',
      '✅ PRO MOVE: Keeping all client, patient, and proprietary company information strictly confidential at all times.',
      '❌ ROOKIE MISTAKE: Falsifying timesheets, attendance logs, or claiming credit for work completed by a colleague.',
      '✅ PRO MOVE: Recording hours and task records with 100% honesty and accuracy.',
      'MATCHING CHALLENGE: Healthcare & Care ➔ Strictly uphold Privacy Act regulations regarding patient medical records and dignity.',
      'MATCHING CHALLENGE: Retail & Trades ➔ Practice 100% stock integrity, accurate cash handling, and honest tool reporting.'
    ]
  },

  branchingScenario: {
    id: 'BS-16',
    situation: 'You are working at a workplace (a retail store, medical reception, or warehouse) and accidentally damage a piece of equipment or misplace a small stock item worth $150. Nobody else witnessed the mistake. What is the correct ethical procedure?',
    options: [
      {
        id: 'opt1',
        choice: 'Option A: Hide the damaged item in a storage bin and say nothing, hoping someone else gets blamed for it later.',
        isCorrect: false,
        feedback: 'Clear explanation of why this causes issues: Hiding mistakes breaches ethical standards, damages team trust, and can lead to immediate dismissal when discovered.'
      },
      {
        id: 'opt2',
        choice: 'Option B: Report the incident to your direct supervisor immediately, take personal accountability, explain how it occurred, and assist in logging the report.',
        isCorrect: true,
        feedback: 'Positive reinforcement detailing why this is the correct approach: Demonstrating immediate honesty and accountability earns long-term respect from leadership and upholds workplace integrity.'
      },
      {
        id: 'opt3',
        choice: 'Option C: Blame a new team member during the afternoon shift handover.',
        isCorrect: false,
        feedback: 'Clear explanation of why this violates standards: Falsely blaming co-workers violates code-of-conduct policies and demonstrates a severe breach of moral character.'
      }
    ]
  },

  lesson2Title: 'Managing Conflicts of Interest, Gifts & Reporting Misconduct',
  lesson2Content: [
    'A **Conflict of Interest** occurs when your personal interests or relationships interfere with your professional duties to your employer. Examples include hiring a family member without disclosing the relationship, doing secondary paid work for a direct competitor, or accepting personal gifts or cash kickbacks from suppliers. Always disclose potential conflicts of interest to your manager immediately.',
    'Maintaining ethical integrity also involves knowing how to handle workplace misconduct, fraud, or bullying. Most Australian organizations maintain clear **Code of Conduct** and **Whistleblower Policies**. If you witness severe unethical behavior, unsafe practices, or theft on site, report the issue through official internal channels or your Health & Safety Representative (HSR).'
  ],

  practicalReflection: 'Reflect on a situation where maintaining confidentiality or honesty was tested. What principles guided your decision, and how did it affect team trust?',
  actionStepTitle: 'Code of Conduct & Confidentiality Review Task',
  actionStepPrompt: 'Select your target job sector. Write out 3 core privacy or ethical rules unique to that field (e.g., patient data privacy in care, cash accuracy in retail, or tool accountability in trades).',

  quiz: [
    {
      id: 'Q1',
      question: 'Which Australian Commonwealth law regulates the handling of personal and sensitive client, patient, and employee information?',
      options: [
        'The Privacy Act 1988',
        'The Fair Work Act 1909',
        'The Copyright Act 1968'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why option 1 is correct: The Privacy Act 1988 sets strict principles governing how businesses and employees collect, handle, and secure sensitive personal data.'
    },
    {
      id: 'Q2',
      question: 'What is the correct ethical response if you accidentally damage equipment or make an operational mistake on site?',
      options: [
        'Report the mistake to your supervisor immediately, take personal accountability, and assist in logging the issue',
        'Hide the damage and hope a co-worker gets blamed',
        'Leave the site permanently without telling anyone'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining the core principle: Demonstrating immediate honesty and personal accountability builds employer trust and allows safety or operational fixes to occur quickly.'
    },
    {
      id: 'Q3',
      question: 'What defines a "Conflict of Interest" in a professional workplace?',
      options: [
        'A situation where personal interests or relationships interfere with your ability to make impartial, ethical business decisions',
        'Having a polite disagreement with a co-worker about lunch break timing',
        'Working overtime on a public holiday'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why this protocol matters: Conflicts of interest compromise professional objectivity; employees are required to disclose potential conflicts to management.'
    },
    {
      id: 'Q4',
      question: 'Is it acceptable to post photos or videos of your workplace, clients, or internal company documents on personal social media accounts?',
      options: [
        'No; taking and sharing workplace photos or client details breaches privacy laws and company confidentiality policies',
        'Yes, as long as you get more than 10 likes on the post',
        'Yes, provided you do it during your lunch break'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed explanation referencing relevant standards: Posting workplace photos or client data without formal authorization violates privacy legislation and company codes of conduct, leading to termination.'
    },
    {
      id: 'Q5',
      question: 'How should an employee handle receiving an expensive personal gift or cash offer from a supplier or client?',
      options: [
        'Decline politely and report the offer to a supervisor in accordance with company gift policy guidelines',
        'Accept the cash secretly and keep it in your pocket',
        'Demand a larger gift from the supplier'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed summary of the correct execution method: Declining gifts and reporting offers ensures compliance with company anti-bribery policies and avoids conflicts of interest.'
    }
  ]
};