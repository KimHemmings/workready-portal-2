import type { ModuleData } from '../modulesData';

export const module2: ModuleData = {
  id: 'M02',
  moduleNumber: 2,
  title: 'Professional Communication at Work',
  category: 'Workplace Expectations',
  estimatedMins: 20,
  pbasPoints: 5,
  videoScript: "Welcome to Module 2: Professional Communication at Work. Effective workplace communication relies on clarity, active listening, and selecting the appropriate channel for your message. In this module, we examine how to navigate professional conversations, written messaging, and supervisor interactions within Australian workplaces.",

  lesson1Title: 'Verbal & Written Communication Norms in Australia',
  lesson1Content: [
    'Communication across Australian workplaces is generally approachable and egalitarian, yet grounded in mutual respect and professionalism. Whether communicating in person, via phone, text message, or email, setting an appropriate tone is critical. Written communications—such as emailing a team leader or texting a supervisor regarding shift availability—should always be clear, concise, and structured with a proper greeting, direct context, and a polite closing.',
    'Selecting the correct channel for communication prevents operational misunderstandings. Urgent operational updates, safety hazards, or sudden shift absences require immediate direct contact (a phone call or direct message), whereas routine schedule updates, document submissions, or general inquiries are best handled via email or dedicated workplace management software. Understanding these distinctions ensures your communication remains efficient and professional.'
  ],

  graphicCard1: {
    title: 'Professional Communication Channels & Rules',
    bullets: [
      'Urgent Absences & Safety Alerts: Contact supervisor directly via phone call or SMS at least 30 minutes prior.',
      'Routine Inquiries & Scheduling: Use official company email or employee portal with clear subject lines.',
      'Active Listening Standard: Focus fully without interrupting, and repeat key operational details to confirm accuracy.',
      'Professional Tone: Avoid casual slang, excessive exclamation marks, or text-speak in all workplace messaging.'
    ]
  },

  branchingScenario: {
    id: 'BS-02',
    situation: 'Your team leader sends a group message asking if anyone can cover an extra afternoon shift tomorrow due to an unexpected stock delivery. You are unable to work the shift due to a pre-scheduled appointment.',
    options: [
      {
        id: 'opt1',
        choice: 'Ignore the message completely since you are unavailable and the request was sent to a group.',
        isCorrect: false,
        feedback: 'Incorrect. Ignoring team communications leaves your supervisor uncertain of shift coverage and reflects poorly on your team engagement.'
      },
      {
        id: 'opt2',
        choice: 'Reply promptly to the supervisor stating clearly and politely that you are unavailable due to a prior commitment.',
        isCorrect: true,
        feedback: 'Positive reinforcement detailing why this is the correct approach: Prompt, polite communication allows management to adjust staffing plans quickly and demonstrates reliability.'
      },
      {
        id: 'opt3',
        choice: 'Reply to the group chat complaining that management should organize shift rosters further in advance.',
        isCorrect: false,
        feedback: 'Clear explanation of why this violates standards: Publicly complaining in operational messaging channels damages team morale and breaches professional conduct expectations.'
      }
    ]
  },

  lesson2Title: 'Active Listening, Instruction Following & Constructive Dialogue',
  lesson2Content: [
    'Active listening is a foundational workplace competency that reduces operational errors and safety incidents. When receiving instructions from a team leader or trainer, give your undivided attention, maintain appropriate eye contact, and take notes if multi-step procedures are involved. Repeating key instructions back in your own words (closed-loop communication) verifies that your understanding matches the supervisor\'s intent before work commences.',
    'Navigating workplace feedback and resolving minor miscommunications requires emotional maturity and constructive dialogue. If an instruction is unclear, or if you receive feedback regarding a performance gap, ask clarifying questions rather than making assumptions. Addressing issues directly, calmly, and respectfully with your supervisor ensures problems are resolved at the lowest possible level before impacting site safety or productivity.'
  ],

  practicalReflection: 'Recall a time when an instruction was unclear or miscommunicated. What specific clarifying question could you have asked to ensure complete understanding?',
  actionStepTitle: 'Practical Communication Audit Task',
  actionStepPrompt: 'Draft a template text message and a template email to a supervisor requesting a temporary schedule adjustment. Ensure both drafts contain a formal greeting, concise context, an actionable request, and a polite sign-off.',

  quiz: [
    {
      id: 'Q1',
      question: 'Which communication channel is most appropriate for notifying your supervisor of an sudden transport delay prior to your shift?',
      options: [
        'A direct phone call or immediate SMS to your direct supervisor',
        'A general email sent to the main company reception address',
        'A social media message to a colleague on duty'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why option 1 is correct: Urgent shift delays require real-time direct notification so management can adjust site operations without delay.'
    },
    {
      id: 'Q2',
      question: 'What is the primary benefit of practicing closed-loop communication (repeating instructions back to a supervisor)?',
      options: [
        'It speeds up shift end times',
        'It confirms mutual understanding and prevents operational and safety errors',
        'It eliminates the need for written workplace policies'
      ],
      correctAnswerIndex: 1,
      explanation: 'Detailed feedback explaining the core principle: Paraphrasing instructions back ensures both parties agree on expectations before work begins.'
    },
    {
      id: 'Q3',
      question: 'How should written electronic messaging to supervisors and team members be structured?',
      options: [
        'Using informal text-speak, abbreviations, and missing punctuation',
        'In all capital letters to emphasize urgency',
        'With a professional greeting, concise and clear context, and a polite sign-off'
      ],
      correctAnswerIndex: 2,
      explanation: 'Detailed feedback explaining why this protocol matters: Structured, professional messaging reflects accountability and maintains workplace standards.'
    },
    {
      id: 'Q4',
      question: 'Under Fair Work guidelines and standard Australian workplace policies, how should employee grievances or communication disputes be handled initially?',
      options: [
        'By discussing the issue directly and professionally with the supervisor or HR representative involved',
        'By posting details of the dispute on personal social media accounts',
        'By immediately ceasing work without notifying management'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed explanation referencing relevant standards: Dispute resolution policies mandate attempting direct, respectful resolution at the local level before escalating.'
    },
    {
      id: 'Q5',
      question: 'When receiving complex, multi-step instructions from a supervisor on a busy work site, what is the most effective execution method?',
      options: [
        'Nod quickly and guess any steps you forget later',
        'Listen actively, take brief written notes, and confirm key details before starting',
        'Interrupt the supervisor halfway through to state that you already know what to do'
      ],
      correctAnswerIndex: 1,
      explanation: 'Detailed summary of the correct execution method: Active listening combined with note-taking and confirmation eliminates guesswork and ensures safety and compliance.'
    }
  ]
};