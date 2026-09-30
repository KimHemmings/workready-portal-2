import type { ModuleData } from '../modulesData';

export const module1: ModuleData = {
  id: 'M01',
  moduleNumber: 1,
  title: 'Understanding Employer Expectations & Workplace Culture',
  category: 'Workplace Expectations',
  estimatedMins: 20,
  pbasPoints: 5,
  videoScript: "Welcome to Module 1: Understanding Employer Expectations and Workplace Culture. Transitioning into a new employment role requires more than technical skill—it requires an understanding of professional standards, workplace etiquette, communication protocols, and employee rights. In this module, we explore how to establish credibility, demonstrate reliability, and navigate Australian workplace culture from day one.",
  lesson1Title: 'Punctuality, Site Readiness & Unwritten Workplace Rules',
  lesson1Content: [
    'In Australian workplaces, punctuality is viewed as a direct measurement of your reliability, professional integrity, and respect for team operations. Arriving 10 minutes prior to your scheduled shift is an industry standard across logistics, civil construction, healthcare, retail, and administration. This buffer period allows you to complete site sign-ins, put on required Personal Protective Equipment (PPE), receive shift handovers, and be fully ready to perform duties at your official start time.',
    'Every organization functions on a combination of explicit written policies (such as employment contracts, safety manuals, and code of conduct documents) and implicit cultural norms (unwritten expectations). Implicit norms include respecting informal break schedules, maintaining clean shared facilities, following unwritten communication hierarchies, and managing mobile phone usage discreetly. Recognizing and adapting to these cultural nuances during your first 14 days builds strong professional trust with supervisors and peers.'
  ],
  graphicCard1: {
    title: 'Workplace Standards: Explicit Policies vs. Implicit Cultural Norms',
    bullets: [
      'Attendance & Shift Start: Arrive on site at 7:50 AM to settle in, sign in, and put on PPE before paid shift starts at 8:00 AM.',
      'Absence & Delays: Contact your direct supervisor at least 30 minutes prior via call or SMS if delayed.',
      'Mobile Phone Usage: Keep phone in locker/bag during operational hours; avoid personal browsing.',
      'Feedback & Problem Solving: Attempt initial self-troubleshooting or ask a trusted peer before escalating minor issues.'
    ]
  },
  branchingScenario: {
    id: 'BS-01',
    situation: 'You are commuting to your shift when a major traffic incident causes a 20-minute delay on public transport. Your revised arrival time will be 10 minutes past your scheduled start time. What is the correct professional procedure?',
    options: [
      {
        id: 'opt1',
        choice: 'Wait until you arrive at the worksite to explain the situation in person so you do not interrupt your supervisor while they are busy.',
        isCorrect: false,
        feedback: 'Incorrect. Arriving late without prior notice disrupts team task allocation, forces colleagues to cover your workload, and damages your professional credibility.'
      },
      {
        id: 'opt2',
        choice: 'Contact your direct supervisor immediately via phone or SMS, explain the specific cause of delay, provide a realistic ETA, and apologize for the disruption.',
        isCorrect: true,
        feedback: 'Correct! Proactive communication allows management to reallocate resources or adjust shift duties. It demonstrates accountability, transparency, and respect for site operations.'
      },
      {
        id: 'opt3',
        choice: 'Send a private text message to a team member asking them to clock you in or cover your position until you arrive.',
        isCorrect: false,
        feedback: 'Incorrect. Asking a colleague to falsify attendance or safety records violates company compliance policy and can result in formal disciplinary action for both employees.'
      }
    ]
  },
  lesson2Title: 'National Employment Standards, Duty of Care & Professional Feedback',
  lesson2Content: [
    'Workplace expectations are a balanced, two-way relationship. Under the National Employment Standards (NES) overseen by the Fair Work Ombudsman, every Australian worker is entitled to minimum conditions, safe working environments under Work Health and Safety (WH&S) legislation, fair remuneration under modern awards, protection against unlawful discrimination, and transparent workplace policies.',
    'A critical factor in long-term employment retention is your capacity to receive, process, and apply constructive feedback. Supervisors evaluate new employees on their adaptability, coachability, and willingness to learn. When receiving constructive advice, view it as professional guidance rather than personal criticism. Practicing active listening—maintaining eye contact, taking notes, asking clarifying questions, and adjusting your performance—signals high professional maturity.'
  ],
  practicalReflection: 'Reflect on a past employment, educational, or team experience where miscommunication occurred. What specific active listening or confirmation technique could have eliminated the error?',
  actionStepTitle: 'Commute Buffer & Route Optimization Audit',
  actionStepPrompt: 'Identify a target employment location or upcoming appointment. Research primary and secondary transit routes, calculate peak-hour traffic buffers, and document an arrival target time that guarantees you are on site 10 minutes prior to start time.',
  quiz: [
    {
      id: 'Q1',
      question: 'Why is arriving 10 minutes prior to official shift start time considered an operational standard in Australian industries?',
      options: [
        'It ensures safety sign-ins, PPE setup, and shift briefings are complete so paid work begins promptly at start time',
        'Employers use this extra time to reduce the overall length of mandatory rest breaks',
        'It is a mandatory taxation requirement enforced by the Australian Taxation Office'
      ],
      correctAnswerIndex: 0,
      explanation: 'Arriving 10 minutes early allows all necessary administrative, safety, and preparation tasks to be completed without encroaching on operational time.'
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
      explanation: 'Explicit policies define formal operational and legal rules, while implicit cultural norms govern day-to-day team communication, etiquette, and informal behaviors.'
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
      explanation: 'Prompt communication allows management to reallocate tasks and maintain operational productivity while demonstrating personal accountability.'
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
      explanation: 'The Fair Work Ombudsman regulates compliance with Australian workplace laws, National Employment Standards, and modern awards.'
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
      explanation: 'Active listening ensures complete clarity on expectations, eliminates recurring errors, and demonstrates a professional commitment to continuous skill improvement.'
    }
  ]
};