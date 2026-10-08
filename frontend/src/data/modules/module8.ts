import type { ModuleData } from '../modulesData';

export const module8: ModuleData = {
  id: 'M08',
  moduleNumber: 8,
  title: 'STAR Method Interview Technique',
  category: 'Interviews & Selection',
  estimatedMins: 20,
  pbasPoints: 5,
  videoScript: "Welcome to Module 8: STAR Method Interview Technique. Behavioral interview questions like 'Tell me about a time you handled a difficult workplace situation' are standard across Australian hiring. In this module, we examine how to structure compelling, real-world answers using the STAR formula: Situation, Task, Action, and Result.",

  lesson1Title: 'Mastering Behavioral Questions & The STAR Framework',
  lesson1Content: [
    'Australian employers across civil trades, healthcare, hospitality, retail, and corporate admin rely heavily on **Behavioral Interview Questions**. These questions operate on a simple premise: past performance predicts future workplace behavior. When an interviewer asks *"Tell me about a time when..."* or *"Give me an example of how you..."*, they are not looking for general opinionsâ€”they want a specific, real-world story that proves you possess key workplace capabilities like safety awareness, problem-solving, teamwork, or resilience.',
    'To answer behavioral questions clearly without rambling, use the **STAR Framework**. STAR breaks your story down into four distinct steps: 1) **Situation** (set the brief contextâ€”where and when), 2) **Task** (explain the specific challenge or objective), 3) **Action** (detail the specific steps **YOU** took to resolve itâ€”this is the longest part of your answer), and 4) **Result** (share the positive outcome, key learning, or measurable impact achieved).'
  ],

  graphicCard1: {
    title: 'STAR Interview Method: Pro Move vs. Rookie Mistake',
    bullets: [
      'âŒ ROOKIE MISTAKE: Giving vague general statements like "I am a great multi-tasker and I always handle pressure well."',
      'âœ… PRO MOVE: Using the STAR formula to give a 90-second concrete example detailing a specific incident and how you resolved it.',
      'âŒ ROOKIE MISTAKE: Spending 80% of your response explaining the background situation and forgetting to detail your personal actions.',
      'âœ… PRO MOVE: Keeping the Situation & Task brief (20%) and focusing 60% of your answer on YOUR specific Actions and 20% on the Result.',
      'MATCHING CHALLENGE: Care & Health âž” Frame STAR stories around patient safety, empathy, and clear shift handover communication.',
      'MATCHING CHALLENGE: Trades & Civil âž” Frame STAR stories around WH&S hazard identification, teamwork, and task completion deadlines.'
    ]
  },

  branchingScenario: {
    id: 'BS-08',
    situation: 'During an interview for a team position, the interviewer asks: "Tell me about a time you had a conflict or disagreement with a co-worker on duty. How did you handle it?" Which response demonstrates high professional competence?',
    options: [
      {
        id: 'opt1',
        choice: 'Option A: "I never have conflicts or disagreements with anyone at work; I get along with every single person 100% of the time."',
        isCorrect: false,
        feedback: 'Clear explanation of why this causes issues: Claiming you never experience conflict sounds unrealistic and fails to demonstrate your actual conflict resolution and emotional intelligence skills.'
      },
      {
        id: 'opt2',
        choice: 'Option B: Use STAR: Describe a minor working disagreement (Situation), explain the need to maintain site safety/service (Task), detail how you spoke privately and respectfully to the peer to find common ground (Action), and explain how work continued smoothly (Result).',
        isCorrect: true,
        feedback: 'Positive reinforcement detailing why this is the correct approach: Using the STAR method provides concrete evidence of your communication skills, emotional maturity, and commitment to workplace safety and team goals.'
      },
      {
        id: 'opt3',
        choice: 'Option C: Detail a major physical argument you had with a past co-worker, explaining at length why the other person was completely wrong and uneducated.',
        isCorrect: false,
        feedback: 'Clear explanation of why this violates standards: Blaming co-workers and highlighting aggressive arguments raises major red flags regarding anti-bullying compliance and team risk.'
      }
    ]
  },

  lesson2Title: 'Deconstructing the STAR Formula: Action & Result Focus',
  lesson2Content: [
    'The most common trap candidates fall into when using STAR is focusing too much on "we" instead of "I". While teamwork is critical, the recruiter is interviewing **you**. In the **Action** section of your story, explicitly highlight your personal contribution using strong active verbs: *"I identified the hazard...", "I suggested a shift adjustment...", "I calculated the required materials...", "I called the site supervisor directly..."*',
    'The **Result** section is your closing punchlineâ€”and where most applicants stop short. Always complete your story with a positive, professional outcome. Where possible, quantify your results with numbers, time saved, zero safety incidents, or supervisor praise (e.g., *"As a result, we cleared the backlog 20 minutes ahead of schedule and the supervisor complimented our team coordination"*). If the situation was a mistake, explain what you learned and how it made you a sharper, safer worker.'
  ],

  practicalReflection: 'Think about a challenging situation from a past job, volunteer role, or training program. What were the specific Actions YOU took to resolve the issue?',
  actionStepTitle: 'STAR Method Story Builder Exercise',
  actionStepPrompt: 'Select a common behavioral question (e.g., "Tell me about a time you had to deal with a tight deadline or high-stress situation"). Write out a 4-bullet STAR response covering: Situation (1 sentence), Task (1 sentence), Action (3 sentences), and Result (1 sentence).',

  quiz: [
    {
      id: 'Q1',
      question: 'What do the letters in the STAR interview framework stand for?',
      options: [
        'Situation, Task, Action, Result',
        'Speed, Teamwork, Attitude, Reliability',
        'Skills, Training, Attendance, Respect'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why option 1 is correct: STAR stands for Situation, Task, Action, and Resultâ€”the standard behavioral response framework across Australian hiring.'
    },
    {
      id: 'Q2',
      question: 'Why do Australian interviewers ask behavioral questions starting with "Tell me about a time when...?"',
      options: [
        'Because past performance and real-world actions are the strongest predictors of future workplace behavior',
        'To test how quickly you can memorize textbook definitions',
        'To see if you can quote Australian employment legislation from memory'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining the core principle: Behavioral questions evaluate your real-world decision-making, safety awareness, and problem-solving capabilities based on past actions.'
    },
    {
      id: 'Q3',
      question: 'Which section of a STAR response should receive the most time and focus during your interview answer?',
      options: [
        'The Action section (detailing the specific steps YOU took to solve the problem)',
        'The Situation section (explaining background history for 5 minutes)',
        'The Task section (complaining about how difficult the task was)'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why this protocol matters: Recruiters want to know what YOU specifically did. The Action phase should comprise roughly 60% of your total answer.'
    },
    {
      id: 'Q4',
      question: 'How should you describe your contributions during the "Action" phase of a STAR response?',
      options: [
        'Using "I" statements and active verbs to clearly state your specific individual responsibilities and choices',
        'Attributing all work vaguely to "we" without mentioning your own role',
        'Explaining what your supervisor should have done differently'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed explanation referencing relevant standards: Using clear "I" statements ensures the recruiter understands your individual skills and personal accountability.'
    },
    {
      id: 'Q5',
      question: 'What makes a "Result" section in a STAR response most effective and memorable to an interviewer?',
      options: [
        'Ending with a clear, positive outcome, quantifiable data (e.g., time saved, zero incidents), or key professional learnings',
        'Ending abruptly without explaining how the story finished',
        'Explaining that you quit the job shortly after the event occurred'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed summary of the correct execution method: Concluding with measurable success, safety compliance, or positive team outcomes proves the value you bring to a workplace.'
    }
  ]
};