import type { ModuleData } from '../modulesData';

export const module7: ModuleData = {
  id: 'M07',
  moduleNumber: 7,
  title: 'Interview Preparation & Employer Research',
  category: 'Interviews & Selection',
  estimatedMins: 20,
  pbasPoints: 5,
  videoScript: "Welcome to Module 7: Interview Preparation & Employer Research. Landing an interview is a major milestone, but success comes down to how well you prepare before walking through the door. In this module, we examine how to research employers, plan your interview commute, dress appropriately for different industries, and prepare high-impact questions.",

  lesson1Title: 'Company Research, Core Values & Industry Intelligence',
  lesson1Content: [
    'Walking into an Australian workplace interview without researching the business is one of the fastest ways to get disqualified. Employers want to see that you are genuinely interested in their specific organization, not just any job. Spend at least 20â€“30 minutes before your interview exploring the companyâ€™s official website, social media pages, and recent news articles. Focus on three core areas: 1) **What they do** (their primary products, services, or care models), 2) **Who they serve** (their main customer base, clients, or community sectors), and 3) **Their company culture or values** (such as safety, innovation, sustainability, or community care).',
    'Integrating your company research naturally into interview answers immediately sets you apart from other candidates. For example, in an aged care interview, mentioning *"I noticed on your website that you emphasize person-centered care and community engagement, which aligns directly with my support philosophy"* proves you are proactive, detail-oriented, and serious about joining their team.'
  ],

  graphicCard1: {
    title: 'Interview Prep Standards: Pro Move vs. Rookie Mistake',
    bullets: [
      'âŒ ROOKIE MISTAKE: Arriving at an interview without knowing what the company does or asking "So, what does this business actually do?"',
      'âœ… PRO MOVE: Reviewing the company website beforehand and mentioning 2-3 specific facts about their services or values during your interview.',
      'âŒ ROOKIE MISTAKE: Dressing in casual streetwear (hoodies, thongs, ripped jeans) for any job interview, regardless of the industry.',
      'âœ… PRO MOVE: Dressing one step above the daily job uniform (e.g., neat hi-vis/boots for trades, smart business casual for retail/admin/care).',
      'MATCHING CHALLENGE: Civil & Trades âž” Research major active site projects, WH&S policies, and client asset types.',
      'MATCHING CHALLENGE: Health & Care âž” Research accreditation standards, service philosophy, and client demographic focus.'
    ]
  },

  branchingScenario: {
    id: 'BS-07',
    situation: 'You have an interview scheduled for 10:00 AM tomorrow at a major regional logistics depot. You have never visited the site before, and public transport runs infrequently in that industrial area. What is the correct preparation strategy?',
    options: [
      {
        id: 'opt1',
        choice: 'Option A: Leave home at 9:30 AM assuming Google Maps estimates a 25-minute travel time, hoping public transport runs on time.',
        isCorrect: false,
        feedback: 'Clear explanation of why this causes issues: Leaving without a transit buffer exposes you to traffic or bus delays, risking late arrival and making an extremely poor first impression.'
      },
      {
        id: 'opt2',
        choice: 'Option B: Conduct a route audit today, plan an arrival time of 9:45 AM (15 minutes early), identify a secondary travel route, and save the interviewer\'s phone number in your contacts.',
        isCorrect: true,
        feedback: 'Positive reinforcement detailing why this is the correct approach: Planning a 15-minute buffer and secondary route guarantees site readiness, reduces anxiety, and ensures you arrive calm and collected.'
      },
      {
        id: 'opt3',
        choice: 'Option C: Arrive at the site at 9:00 AM (1 hour early) and demand to see the hiring manager immediately to show high enthusiasm.',
        isCorrect: false,
        feedback: 'Clear explanation of why this violates standards: Arriving more than 20 minutes early disrupts the interviewer\'s schedule and demonstrates a lack of respect for workplace boundaries.'
      }
    ]
  },

  lesson2Title: 'Presentation Standards, Logistical Planning & Smart Interview Questions',
  lesson2Content: [
    'First impressions are formed within the first 30 seconds of an interview. Dressing appropriately for your target industry demonstrates respect and professional awareness. A good general rule is to dress **one level above the daily workplace uniform**: for civil/construction roles, wear clean work trousers, a collared shirt, and clean steel-cap boots; for retail, healthcare, hospitality, or office administration, wear neat business-casual attire (such as ironed trousers/skirt, a button-up shirt or blouse, and closed-toe dress shoes). Ensure hair is neat, grooming is clean, and personal hygiene is impeccable.',
    'At the end of almost every Australian job interview, the hiring manager will ask: *"Do you have any questions for us?"* Saying "No, I think you covered everything" misses a major opportunity to showcase your initiative. Prepare 2 or 3 thoughtful questions that highlight your long-term focus, such as: 1) *"What does success look like in this role during the first 90 days?"*, 2) *"What team or site training opportunities are available for new staff?"*, or 3) *"What are the next steps in your recruitment timeline?"*'
  ],

  practicalReflection: 'Think about an upcoming interview or target employer. What are two specific questions you can ask the interviewer at the end of the meeting to show your genuine interest?',
  actionStepTitle: 'Interview Readiness & Employer Research Task',
  actionStepPrompt: 'Select a real local company currently hiring in your area. 1) Write down their core product or service, 2) Identify one company value or recent project, and 3) Write out 2 professional questions you will ask the interviewer.',

  quiz: [
    {
      id: 'Q1',
      question: 'Why is conducting prior research on a company essential before attending a job interview?',
      options: [
        'It allows you to demonstrate genuine interest, align your answers with company values, and stand out from unprepared candidates',
        'It is a legal requirement enforced by the Australian Taxation Office',
        'It replaces the need to bring your resume or identification tickets to the interview'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why option 1 is correct: Researching the employer proves initiative, helps you tailor your answers, and shows you understand their operational goals.'
    },
    {
      id: 'Q2',
      question: 'What is the recommended rule of thumb for choosing interview attire across Australian industries?',
      options: [
        'Dress one level above the daily job uniform (e.g., smart business casual or clean professional workwear)',
        'Always wear a full three-piece tuxedo or formal evening gown regardless of the job',
        'Wear casual loungewear or activewear to show you are relaxed'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining the core principle: Dressing one level above daily workwear shows respect for the employer and demonstrates professional standards without looking out of place.'
    },
    {
      id: 'Q3',
      question: 'How far in advance of your scheduled interview time should you aim to arrive at the interview location?',
      options: [
        '10 to 15 minutes prior to the scheduled start time',
        'At least 2 hours before the start time',
        '5 minutes after the start time so you look busy'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why this protocol matters: Arriving 10-15 minutes early demonstrates punctuality, gives you time to compose yourself, and respects the hiring manager\'s schedule.'
    },
    {
      id: 'Q4',
      question: 'How should you respond when an interviewer asks: "Do you have any questions for us?" at the end of the interview?',
      options: [
        'Ask 2-3 prepared professional questions about role success, team training, or next steps in the hiring timeline',
        'Say "No, I don\'t have any questions, I just want to know how much I get paid"',
        'Ask if you can leave immediately to catch a bus'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed explanation referencing relevant standards: Asking thoughtful questions proves engagement, shows long-term career focus, and provides valuable insight into the workplace culture.'
    },
    {
      id: 'Q5',
      question: 'What physical items should you organize and bring with you to an in-person job interview?',
      options: [
        'Printed copies of your tailored resume, copies of current tickets/licences, photo ID, a pen, and a notebook',
        'Only your personal mobile phone and headphones',
        'No items are required; employers supply everything'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed summary of the correct execution method: Bringing organized physical copies of your resume, tickets, ID, and notepad proves readiness and attention to detail.'
    }
  ]
};