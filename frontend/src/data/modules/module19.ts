import type { ModuleData } from '../modulesData';

export const module19: ModuleData = {
  id: 'M19',
  moduleNumber: 19,
  title: 'Workplace Mental Health, Resilience & Wellbeing',
  category: 'Workplace Expectations',
  estimatedMins: 20,
  pbasPoints: 5,
  videoScript: "Welcome to Module 19: Workplace Mental Health, Resilience & Wellbeing. Maintaining psychological health and personal resilience is vital for long-term career success. In this module, we examine workplace stress management, psychological safety under WH&S law, accessing Employee Assistance Programs (EAP), and maintaining work-life balance.",

  lesson1Title: 'Psychological Safety & Managing Workplace Stress',
  lesson1Content: [
    'Workplace health encompasses both physical safety and **Psychological Safety**. Under updated Australian Work Health and Safety (WH&S) regulations, employers have a statutory duty of care to manage psychosocial hazards in the workplace (such as workplace bullying, excessive workload pressure, lack of role clarity, or harassment). Every employee has the right to perform their duties in an environment free from psychological harm.',
    'Experiencing stress during busy operational periods—such as handling complex care clients, managing high customer volume in retail, meeting tight pour deadlines in construction, or processing urgent data in administration—is common. Developing healthy personal resilience strategies (such as structured sleep routines, regular exercise, setting clear work-life boundaries, and practicing mindfulness) helps prevent burnout and keeps your operational performance high.'
  ],

  graphicCard1: {
    title: 'Workplace Wellbeing: Pro Move vs. Rookie Mistake',
    bullets: [
      '❌ ROOKIE MISTAKE: Bottling up severe mental health stress or interpersonal conflict until it leads to an explosive workplace outburst.',
      '✅ PRO MOVE: Recognizing early signs of burnout and accessing confidential workplace support services like your Employee Assistance Program (EAP).',
      '❌ ROOKIE MISTAKE: Engaging in workplace gossip, exclusion, or aggressive behavior that breaches anti-bullying policies.',
      '✅ PRO MOVE: Fostering a supportive team culture where colleagues treat each other with respect, dignity, and empathy.',
      'SUPPORT RESOURCE: Employee Assistance Program (EAP) ➔ Free, confidential professional counseling provided by many employers.',
      'SUPPORT RESOURCE: Beyond Blue / Lifeline ➔ 24/7 national mental health support services (Call 13 11 14).'
    ]
  },

  branchingScenario: {
    id: 'BS-19',
    situation: 'You have been working long hours across demanding shifts in a high-pressure workplace (care, civil trades, or retail). You notice you are feeling constantly exhausted, irritable, and struggling to sleep, which is beginning to affect your focus on site safety. What is the healthiest, most professional action?',
    options: [
      {
        id: 'opt1',
        choice: 'Option A: Ignore the symptoms, rely on excessive caffeine or energy drinks, and push through until a major safety mistake happens.',
        isCorrect: false,
        feedback: 'Clear explanation of why this causes issues: Ignoring severe exhaustion compromises safety awareness, increases error risks, and leads to severe burnout or injury.'
      },
      {
        id: 'opt2',
        choice: 'Option B: Speak privately with your supervisor or HR, utilize your company\'s confidential EAP service, and consult a GP for a mental health plan.',
        isCorrect: true,
        feedback: 'Positive reinforcement detailing why this is the correct approach: Proactively managing mental wellbeing via confidential EAP or GP support protects your health, maintains site safety, and demonstrates high self-awareness.'
      },
      {
        id: 'opt3',
        choice: 'Option C: Post a angry rant on social media detailing how terrible your employer\'s management team is.',
        isCorrect: false,
        feedback: 'Clear explanation of why this violates standards: Publicly attacking employers on social media breaches conduct policies and damages your career prospects.'
      }
    ]
  },

  lesson2Title: 'Employee Assistance Programs (EAP) & Anti-Bullying Protections',
  lesson2Content: [
    'Many medium-to-large Australian companies provide access to an **Employee Assistance Program (EAP)**. An EAP is a free, confidential professional counseling service funded by the employer to assist staff with personal or work-related issues (including stress, financial anxiety, family challenges, or grief). EAP consultations are completely independent—your employer receives no information regarding who accesses the service or what is discussed.',
    'Australian workplace law strictly prohibits workplace bullying, harassment, and discrimination under the *Fair Work Act* and state WH&S legislation. If you experience or witness unreasonable repeated behavior directed toward a worker that creates a risk to health and safety, address it through official workplace channels: 1) Speak directly to the person if safe to do so, 2) Report the conduct to your supervisor, HR, or Health & Safety Representative (HSR), and 3) Keep factual written records of incidents.'
  ],

  practicalReflection: 'Think about how you handle high-pressure days. What is one positive coping strategy or boundary you can implement to protect your mental energy after a difficult shift?',
  actionStepTitle: 'Mental Health & Support Network Plan',
  actionStepPrompt: 'Open your notes app. Write down: 1) The phone number for Lifeline (13 11 14) and Beyond Blue (1300 22 4636), 2) Check if your target employer offers an EAP, and 3) List two personal activities that help you reset after work.',

  quiz: [
    {
      id: 'Q1',
      question: 'Do Australian employers have a legal obligation under Work Health & Safety (WH&S) laws to manage psychological risks and hazards in the workplace?',
      options: [
        'Yes, employers have a statutory duty of care to manage psychosocial risks and provide a psychologically safe environment',
        'No, WH&S legislation only applies to physical broken bones',
        'Psychological safety is strictly voluntary'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why option 1 is correct: Modern Australian WH&S frameworks mandate that employers manage both physical and psychological safety risks on site.'
    },
    {
      id: 'Q2',
      question: 'What is an Employee Assistance Program (EAP) in an Australian workplace context?',
      options: [
        'A free, confidential professional counseling and support service paid for by the employer to help staff with personal or work challenges',
        'A mandatory physical fitness test conducted every Monday morning',
        'A tax audit conducted by the ATO'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining the core principle: EAPs provide completely confidential, professional support to help employees manage mental health, stress, and life challenges without employer oversight.'
    },
    {
      id: 'Q3',
      question: 'How is workplace bullying defined under Fair Work and WH&S guidelines?',
      options: [
        'Repeated, unreasonable behavior directed towards a worker that creates a risk to health and safety',
        'A manager giving reasonable, constructive performance feedback in a polite manner',
        'Having a single polite disagreement about shift rostering'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why this protocol matters: Bullying requires repeated, unreasonable behavior that poses a risk to safety; reasonable management feedback delivered respectfully is not bullying.'
    },
    {
      id: 'Q4',
      question: 'Is your employer notified if you access a confidential Employee Assistance Program (EAP) service?',
      options: [
        'No; EAP services are strictly confidential under privacy law, and personal details are never shared with employers',
        'Yes, the counselor sends a full transcript of your conversation to your manager',
        'Yes, it is posted on the company noticeboard'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed explanation referencing relevant standards: EAP consultations operate under strict medical confidentiality regulations; employers receive zero identifying information.'
    },
    {
      id: 'Q5',
      question: 'What is the most effective personal approach to preventing long-term workplace burnout?',
      options: [
        'Establishing clear work-life boundaries, practicing healthy stress habits, and accessing EAP or GP support early when needed',
        'Working 80 hours a week without sleeping or taking rest breaks',
        'Relying on alcohol or energy drinks to cope with chronic exhaustion'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed summary of the correct execution method: Proactive self-care, healthy daily routines, and early professional support maintain long-term personal resilience and career performance.'
    }
  ]
};