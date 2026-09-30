import type { ModuleData } from '../modulesData';

export const module3: ModuleData = {
  id: 'M03',
  moduleNumber: 3,
  title: 'Teamwork & Problem Solving Across Industries',
  category: 'Workplace Expectations',
  estimatedMins: 20,
  pbasPoints: 5,
  videoScript: "Welcome to Module 3: Teamwork & Problem Solving Across Industries. Every Australian business relies on reliable team players who solve problems proactively rather than passing the buck. In this module, we examine how to collaborate effectively, manage workplace bottlenecks, resolve peer conflicts, and present constructive solutions to supervisors.",

  lesson1Title: 'High-Performing Team Dynamics & Cross-Industry Collaboration',
  lesson1Content: [
    'In Australian workplaces, high-performing teams are built on mutual accountability, clear role execution, and proactive support. Whether you are part of a nursing team managing patient admissions in a hospital, a crew pouring concrete on a civil site, a kitchen team handling a dinner rush in hospitality, or an administrative squad executing a product launch, your individual reliability directly impacts the workload and safety of your colleagues.',
    'Effective teamwork requires pulling your weight while actively watching for team bottlenecks. When your assigned primary tasks are complete, standard practice in Australian industry is not to sit idle, but to offer immediate assistance to teammates who are under pressure. Understanding how your individual output connects to the broader team workflow creates an environment of trust, safety, and operational excellence.'
  ],

  graphicCard1: {
    title: 'Teamwork Standards: Pro Move vs. Rookie Mistake',
    bullets: [
      '❌ ROOKIE MISTAKE: Stopping work or taking an unscheduled break the moment your personal task list is finished while colleagues are swamped.',
      '✅ PRO MOVE: Checking in with your shift leader or peers: "My section is prepped and clean—where can I jump in to help?"',
      '❌ ROOKIE MISTAKE: Complaining openly about a teammate\'s working speed or style to others in the staff tearoom.',
      '✅ PRO MOVE: Offering direct, practical assistance or speaking privately to your team leader if a workflow delay creates a safety hazard.',
      'MATCHING CHALLENGE: Civil/Trades ➔ Sharing tool setups and maintaining clean access ways for trailing trades.',
      'MATCHING CHALLENGE: Retail/Care ➔ Covering peer break times promptly so customer service or client care remains seamless.'
    ]
  },

  branchingScenario: {
    id: 'BS-03',
    situation: 'You are working a busy shift across one of your target industries (a retail floor during a sale, an aged care wing during meal delivery, or a construction site before a pour). You notice a colleague struggling to complete a heavy physical task, which is causing a queue to back up and creating a potential safety hazard. Your own assigned tasks are finished. What is the correct professional procedure?',
    options: [
      {
        id: 'opt1',
        choice: 'Option A: Sit down in the break room or check your phone since your assigned work is complete and it is not your official job role.',
        isCorrect: false,
        feedback: 'Clear explanation of why this causes issues: Ignoring a teammate struggling with a bottleneck damages team morale, increases risk of injury, and demonstrates a lack of initiative.'
      },
      {
        id: 'opt2',
        choice: 'Option B: Approach your colleague politely, ask if they would like a hand, and assist them in clearing the immediate bottleneck safely.',
        isCorrect: true,
        feedback: 'Positive reinforcement detailing why this is the correct approach: Stepping in to assist colleagues safely clears operational bottlenecks, prevents injuries, and builds a strong professional reputation as a team player.'
      },
      {
        id: 'opt3',
        choice: 'Option C: Openly criticize the colleague in front of customers or co-workers for moving too slowly.',
        isCorrect: false,
        feedback: 'Clear explanation of why this violates standards: Publicly criticizing colleagues violates workplace anti-bullying policies, damages team trust, and creates an unprofessional environment.'
      }
    ]
  },

  lesson2Title: 'Structured Problem Solving & The "Solution-First" Framework',
  lesson2Content: [
    'Unforeseen problems—such as missing stock, broken equipment, roster gaps, or difficult client interactions—occur daily across all industries. The difference between an average worker and a valuable employee is how they respond to these disruptions. Instead of panicking or bringing problems to a supervisor without context, high-performing employees use the **3-Step Solution-First Framework**.',
    'The Solution-First approach involves: 1) **Identifying the core root problem** clearly (e.g., *"We are out of size M safety gloves in Bay 2"*), 2) **Formulating 1 or 2 practical, safe options** (e.g., *"I checked the central store and there is an unopened box we can unpack, or we can borrow from Bay 4"*), and 3) **Presenting the issue AND recommendations** to your supervisor (e.g., *"Hey Sarah, Bay 2 is out of size M gloves. I can grab the unopened box from central store now if you approve?"*). This approach saves supervisor time and demonstrates high-level operational leadership.'
  ],

  practicalReflection: 'Think about a time when a project or daily task was disrupted by an unexpected issue. How would applying the 3-Step Solution-First Framework have resolved the situation faster?',
  actionStepTitle: 'Practical Solution-First Scripting Exercise',
  actionStepPrompt: 'Select a hypothetical workplace issue in your chosen sector (e.g., POS terminal failure in retail, missing equipment on a work site, or a delayed delivery in hospitality). Write out a 2-sentence script following the Solution-First formula to present to your manager.',

  quiz: [
    {
      id: 'Q1',
      question: 'What is the standard professional expectation in Australian workplaces when you finish your assigned tasks ahead of schedule?',
      options: [
        'Proactively check in with your supervisor or peers to offer help where bottlenecks exist',
        'Take an unscheduled extended break in the tearoom until your shift officially ends',
        'Clock off early and leave the site without telling anyone'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why option 1 is correct: Offering assistance once your tasks are finished demonstrates initiative, supports site productivity, and builds team trust.'
    },
    {
      id: 'Q2',
      question: 'What are the three steps of the "Solution-First" workplace problem-solving framework?',
      options: [
        'Ignore the issue, wait for someone else to notice, and blame your teammate',
        'Identify the root problem clearly, formulate 1-2 practical solutions, and present both problem and recommendations to your supervisor',
        'Stop all work immediately, complain to customers, and demand a team meeting'
      ],
      correctAnswerIndex: 1,
      explanation: 'Detailed feedback explaining the core principle: Presenting a problem alongside actionable, practical solutions saves management time and highlights your professional maturity.'
    },
    {
      id: 'Q3',
      question: 'How should personal differences or minor working style clashes between teammates be handled professionally?',
      options: [
        'By gossiping about the co-worker with other staff members during lunch breaks',
        'By focusing on shared operational goals, maintaining polite communication, and addressing major issues privately with leadership if safety is compromised',
        'By refusing to speak to or work alongside the team member'
      ],
      correctAnswerIndex: 1,
      explanation: 'Detailed feedback explaining why this protocol matters: Professionalism requires putting personal differences aside to achieve team objectives safely and respectfully.'
    },
    {
      id: 'Q4',
      question: 'Under Australian Work Health and Safety (WH&S) legislation, what is an individual employee\'s legal duty of care regarding teamwork and safety?',
      options: [
        'To take reasonable care for their own safety AND ensure their actions do not adversely affect the health and safety of co-workers',
        'Safety is 100% the employer\'s responsibility; workers have no legal obligations',
        'To only care about safety if a safety inspector is actively standing on site'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed explanation referencing relevant standards: WH&S legislation mandates that every worker must take reasonable care for their own safety and the safety of colleagues on site.'
    },
    {
      id: 'Q5',
      question: 'When presenting a workplace problem to a busy shift supervisor, what is the most effective communication approach?',
      options: [
        'Interrupt a client meeting to yell out that something is broken',
        'State the problem clearly, explain the operational impact, and offer a sensible solution for approval',
        'Send a vague text message saying "there is a big problem" with no details'
      ],
      correctAnswerIndex: 1,
      explanation: 'Detailed summary of the correct execution method: Combining clear problem identification with a suggested fix allows supervisors to make fast, informed decisions without halting work.'
    }
  ]
};