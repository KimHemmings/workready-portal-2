import type { ModuleData } from '../modulesData';

export const module11: ModuleData = {
  id: 'M11',
  moduleNumber: 11,
  title: 'Work Health & Safety (WH&S) Standards',
  category: 'Workplace Expectations',
  estimatedMins: 20,
  pbasPoints: 5,
  videoScript: "Welcome to Module 11: Work Health & Safety Standards. Safety is the top operational priority across every Australian industry. In this module, we examine WH&S legislation, your legal duty of care, hazard identification, Personal Protective Equipment (PPE) compliance, and your statutory right to cease unsafe work.",

  lesson1Title: 'Work Health & Safety Frameworks & Personal Duty of Care',
  lesson1Content: [
    'Work Health and Safety (WH&S) laws across Australian states and territories (regulated by agencies such as SafeWork NSW, WorkSafe Victoria, Workplace Health and Safety Queensland, etc.) operate on a clear legal obligation: every person in a workplace shares responsibility for safety. Employers (Persons Conducting a Business or Undertaking - PCBUs) have a primary duty of care to provide a safe work environment, safe machinery, proper training, and adequate welfare facilities.',
    'As an individual worker, you also hold a strict **Legal Duty of Care** under WH&S legislation. You are legally required to: 1) Take reasonable care for your own health and safety, 2) Ensure your actions or omissions do not adversely affect the health and safety of others, 3) Comply with any reasonable safety instruction given by the employer, and 4) Co-operate with any reasonable WH&S policy or procedure (such as wearing mandatory PPE and participating in site inductions or Toolbox Talks).'
  ],

  graphicCard1: {
    title: 'WH&S Safety Standards: Pro Move vs. Rookie Mistake',
    bullets: [
      '❌ ROOKIE MISTAKE: Ignoring a visible slip hazard or damaged electrical cable because "it\'s not my job to fix it."',
      '✅ PRO MOVE: Reporting the hazard immediately to your supervisor, placing temporary warning signs, and logging the incident.',
      '❌ ROOKIE MISTAKE: Removing or modifying Personal Protective Equipment (PPE) because it feels hot or uncomfortable.',
      '✅ PRO MOVE: Wearing all mandatory PPE correctly at all times and requesting replacement gear if equipment is damaged.',
      'MATCHING CHALLENGE: Construction/Trades ➔ Steel-cap boots, hi-vis, hard hat, safety glasses, and White Card compliance.',
      'MATCHING CHALLENGE: Care & Health ➔ Non-slip shoes, proper manual handling lifts, gloves/aprons, and sharp disposal procedures.'
    ]
  },

  branchingScenario: {
    id: 'BS-11',
    situation: 'You are working on a busy shift in a warehouse, retail store, care facility, or building site. Your supervisor instructs you to quickly move a heavy 30kg pallet or equipment item by yourself without using mechanical lifting gear or asking for help, stating "we are running late, just hurry up and lift it." What is the correct compliance action?',
    options: [
      {
        id: 'opt1',
        choice: 'Option A: Attempt to lift the 30kg load alone as fast as possible to impress your manager, risking serious spinal injury.',
        isCorrect: false,
        feedback: 'Clear explanation of why this causes issues: Unsafe manual handling violates WH&S lifting guidelines, risking permanent musculoskeletal injury and breaching safety duty of care.'
      },
      {
        id: 'opt2',
        choice: 'Option B: Politely pause, inform your supervisor that the load exceeds safe manual handling limits, and request either a team lift or appropriate lifting equipment (e.g., trolley or pallet jack).',
        isCorrect: true,
        feedback: 'Positive reinforcement detailing why this is the correct approach: Exercising your safety duty of care by requesting proper lifting aids or assistance prevents severe workplace injuries while upholding statutory safety laws.'
      },
      {
        id: 'opt3',
        choice: 'Option C: Walk off the job site without saying anything and go home for the day.',
        isCorrect: false,
        feedback: 'Clear explanation of why this violates standards: Abandoning a workplace without raising safety concerns directly with management or safety reps leaves hazards unresolved and breaches professional expectations.'
      }
    ]
  },

  lesson2Title: 'Hazard Identification, Hierarchy of Controls & Ceasing Unsafe Work',
  lesson2Content: [
    'Proactive hazard management relies on recognizing risks before injuries occur. A **hazard** is anything with the potential to cause harm (e.g., wet floors, exposed wiring, chemical spills, cluttered access ways, or repetitive strain), while a **risk** is the likelihood and severity of harm occurring from that hazard. Australian industries manage hazards using the **Hierarchy of Controls**: 1) *Elimination* (remove hazard completely), 2) *Substitution* (replace with safer option), 3) *Engineering Controls* (isolate people from hazard), 4) *Administrative Controls* (change work procedures/signs), and 5) *PPE* (protective gear as the last line of defense).',
    'Under Australian WH&S law, every worker has a statutory right to **Cease or Refuse Unsafe Work**. If you have a reasonable concern that carrying out a task would expose you or others to an immediate or serious risk to health and safety, you have the legal right to stop the work. You must immediately notify your supervisor or Health and Safety Representative (HSR) and remain available to perform suitable alternative safe work.'
  ],

  practicalReflection: 'Look around your current environment or think of a past workplace. What is one physical or ergonomic hazard you can identify, and which level of the Hierarchy of Controls would best manage it?',
  actionStepTitle: 'Site Safety & PPE Audit Task',
  actionStepPrompt: 'Select your target industry (Care, Trades, Retail, Admin, or Logistics). List all mandatory PPE items required for entry level roles on that site, and write out a 2-step process for reporting a damaged piece of safety gear to a supervisor.',

  quiz: [
    {
      id: 'Q1',
      question: 'Under Australian Work Health & Safety (WH&S) legislation, who holds a legal duty of care for workplace safety?',
      options: [
        'Both employers (PCBUs) AND individual employees share legal duties of care for safety',
        'Safety is 100% the employer\'s duty; individual workers have no legal obligations',
        'Only external SafeWork inspectors are responsible for safety on job sites'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why option 1 is correct: Australian WH&S law mandates shared duty of care—employers must provide safe systems, and workers must follow safety procedures and protect themselves and peers.'
    },
    {
      id: 'Q2',
      question: 'What is Personal Protective Equipment (PPE) considered under the Hierarchy of Hazard Controls?',
      options: [
        'The last line of defense against workplace hazards, used after other controls are applied or as additional protection',
        'The absolute first and only control measure that ever needs to be used',
        'An optional accessory that workers can choose not to wear'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining the core principle: PPE sits at the bottom of the Hierarchy of Controls as a final protective barrier; higher controls like elimination or engineering are preferred first.'
    },
    {
      id: 'Q3',
      question: 'What legal right does an Australian worker have if assigned a task that poses an immediate, serious risk to their health and safety?',
      options: [
        'The statutory right to cease or refuse unsafe work, notify a supervisor immediately, and perform alternative safe duties',
        'The right to destroy company machinery in protest',
        'No legal right; employees must obey all orders regardless of danger'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why this protocol matters: WH&S legislation explicitly protects workers\' legal rights to refuse work that presents an immediate or serious hazard to life or safety.'
    },
    {
      id: 'Q4',
      question: 'What is the fundamental difference between a "hazard" and a "risk" in WH&S terminology?',
      options: [
        'A hazard is something with potential to cause harm; a risk is the likelihood and severity of that harm occurring',
        'A hazard only applies to chemical spills, while a risk only applies to fall heights',
        'There is no difference; the words mean exact same thing'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed explanation referencing relevant standards: Identifying hazards (the source of harm) allows workers to assess and control risk (the probability and impact of injury).'
    },
    {
      id: 'Q5',
      question: 'How should damaged or faulty safety equipment (e.g., frayed harness, cracked hard hat, broken lifting gear) be handled on site?',
      options: [
        'Tag the equipment out of service immediately, report it to your supervisor, and obtain a compliant replacement before working',
        'Continue using the damaged gear quietly until it breaks completely',
        'Hide the equipment in a cupboard so nobody finds it'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed summary of the correct execution method: Tagging out faulty gear prevents co-workers from using unsafe tools and ensures equipment is repaired or replaced promptly.'
    }
  ]
};