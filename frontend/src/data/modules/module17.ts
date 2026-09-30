import type { ModuleData } from '../modulesData';

export const module17: ModuleData = {
  id: 'M17',
  moduleNumber: 17,
  title: 'Probationary Periods, Performance Reviews & Growth',
  category: 'Workplace Expectations',
  estimatedMins: 20,
  pbasPoints: 5,
  videoScript: "Welcome to Module 17: Probationary Periods, Performance Reviews & Growth. The first 3 to 6 months in a new job are critical for establishing your long-term position. In this module, we examine how probationary periods operate under Fair Work, how to navigate formal performance reviews, and how to turn feedback into professional growth.",

  lesson1Title: 'Navigating Probationary Periods & Fair Work Standards',
  lesson1Content: [
    'In Australia, new employment contracts typically include an initial **Probationary Period** lasting between 3 to 6 months. Under the *Fair Work Act 2009*, probation is a formal timeframe allowing both employer and employee to evaluate whether the working relationship, job fit, skill performance, and team culture are mutually aligned. It is important to note that full employment rights—including minimum award pay rates, superannuation, and health and safety protections—apply from your very first day of employment, regardless of probation status.',
    'During probation, supervisors monitor key performance indicators: punctuality, site safety compliance, accuracy, peer collaboration, and coachability. Passing probation smoothly requires establishing a track record of reliability, asking for clarification when needed, and taking immediate accountability for learning from minor mistakes.'
  ],

  graphicCard1: {
    title: 'Probation Standards: Pro Move vs. Rookie Mistake',
    bullets: [
      '❌ ROOKIE MISTAKE: Assuming probation doesn\'t matter because you\'ve already signed your employment contract.',
      '✅ PRO MOVE: Setting a self-review checkpoint at 30, 60, and 90 days to evaluate your own performance against expectations.',
      '❌ ROOKIE MISTAKE: Becoming defensive or argumentative when a manager points out an area for performance improvement.',
      '✅ PRO MOVE: Listening actively, thanking the manager for feedback, and demonstrating immediate practical adjustments.',
      'MATCHING CHALLENGE: All Sectors ➔ Schedule a proactive 30-day check-in with your leader to ask: "Where can I improve?"',
      'MATCHING CHALLENGE: Care & Trades ➔ Focus heavily on zero safety breaches, compliance logging, and site reliability.'
    ]
  },

  branchingScenario: {
    id: 'BS-17',
    situation: 'You are 6 weeks into a 3-month probationary period at a workplace (a medical clinic, retail logistics hub, or construction site). Your supervisor schedules a brief 1-on-1 check-in and mentions that while your technical work is good, your communication during shift handovers needs to be clearer and more detailed. What is the correct professional action?',
    options: [
      {
        id: 'opt1',
        choice: 'Option A: Argue with the supervisor, stating that your handovers are perfectly fine and other team members are worse.',
        isCorrect: false,
        feedback: 'Clear explanation of why this causes issues: Becoming defensive during performance reviews demonstrates poor coachability and risks failing your probationary review.'
      },
      {
        id: 'opt2',
        choice: 'Option B: Accept the feedback politely, ask for a specific example of what a great handover looks like on site, and implement a structured checklist on your next shift.',
        isCorrect: true,
        feedback: 'Positive reinforcement detailing why this is the correct approach: Accepting constructive feedback maturely and applying immediate improvements proves high adaptability and guarantees probation success.'
      },
      {
        id: 'opt3',
        choice: 'Option C: Stop talking to your supervisor entirely and submit a formal union grievance about minor feedback.',
        isCorrect: false,
        feedback: 'Clear explanation of why this violates standards: Escalate feedback unnecessarily creates toxic team friction and bypasses reasonable performance coaching.'
      }
    ]
  },

  lesson2Title: 'Performance Reviews & The 1-on-1 Coaching Framework',
  lesson2Content: [
    'Formal and informal **Performance Reviews** are standard business tools across Australian companies. Rather than viewing reviews with anxiety, treat them as valuable opportunities to showcase your accomplishments, discuss career development, and request additional training or ticket endorsements.',
    'Prepare for performance reviews by keeping a personal record of your achievements: completed safety tickets, positive client feedback, zero absenteeism streaks, and voluntary overtime support. Structure your review conversation around three focus points: 1) What has gone well, 2) Where you are seeking growth, and 3) What goals or training targets you want to set for the next 6 months.'
  ],

  practicalReflection: 'Think about a piece of constructive criticism you received in the past. How did your reaction influence the final outcome, and how will you approach feedback during your next job?',
  actionStepTitle: '30-Day Probation Goal & Feedback Scripting Task',
  actionStepPrompt: 'Open a document or notepad. Draft a 3-sentence script to ask your supervisor for feedback after 30 days on the job (e.g., "Hi [Manager Name], as I hit my 30-day mark, I\'d love to get your feedback on how I\'m performing...").',

  quiz: [
    {
      id: 'Q1',
      question: 'What is the standard length of an initial employment probationary period under most Australian employment contracts?',
      options: [
        '3 to 6 months',
        '2 years',
        'Probationary periods are illegal under Fair Work law'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why option 1 is correct: Probationary periods in Australia standardly run for 3 to 6 months, providing a mutual window to evaluate job fit and performance.'
    },
    {
      id: 'Q2',
      question: 'Do national minimum pay rates and Work Health & Safety protections apply to employees while they are on probation?',
      options: [
        'Yes, full statutory pay rates, superannuation, and safety rights apply from day one of employment',
        'No, employers can pay half-rates during probation',
        'Safety rights only apply after 12 months of service'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining the core principle: Under Fair Work legislation, all national employment standards, minimum award pay rates, and safety rights take effect immediately upon commencement.'
    },
    {
      id: 'Q3',
      question: 'What is the most effective attitude to demonstrate when receiving constructive performance feedback from a supervisor during probation?',
      options: [
        'Active listening, professionalism, open coachability, and immediate practical application',
        'Immediate defensiveness and blaming team members',
        'Ignoring the advice and doing things your own way'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why this protocol matters: Demonstrating coachability and a willingness to adjust your work methods proves maturity and secures your long-term position.'
    },
    {
      id: 'Q4',
      question: 'How should you prepare for a formal 6-month or annual performance review meeting with your manager?',
      options: [
        'Document your key achievements, review safety/reliability records, and prepare 2 career growth goals',
        'Demand an immediate 50% pay rise without providing evidence of performance',
        'Arrive without taking notes or thinking about your work history'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed explanation referencing relevant standards: Coming prepared with recorded achievements and clear career goals allows you to lead a constructive discussion about advancement.'
    },
    {
      id: 'Q5',
      question: 'What proactive step can you take after 30 days in a new role to ensure you are meeting supervisor expectations?',
      options: [
        'Politely request a brief 5-minute check-in with your supervisor to ask about your performance and areas for improvement',
        'Assume everything is perfect if nobody talks to you',
        'Ask co-workers to evaluate your salary'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed summary of the correct execution method: Requesting a proactive 30-day feedback check-in shows high accountability, initiative, and dedication to job retention.'
    }
  ]
};