import type { ModuleData } from '../modulesData';

export const module9: ModuleData = {
  id: 'M09',
  moduleNumber: 9,
  title: 'Post-Interview Follow-Up & Feedback',
  category: 'Interviews & Selection',
  estimatedMins: 20,
  pbasPoints: 5,
  videoScript: "Welcome to Module 9: Post-Interview Follow-Up & Feedback. The job application process doesn't end when you walk out of the interview room. In this module, we examine how to send professional thank-you communications, follow up on pending decisions politely, handle job offers or rejections constructively, and turn feedback into fuel for your next opportunity.",

  lesson1Title: 'The 24-Hour Follow-Up & Professional Email Courtesy',
  lesson1Content: [
    'Sending a professional thank-you email within 24 hours of an interview is a simple yet powerful strategy that sets high-performing jobseekers apart in Australia. It reinforces your interest in the position, demonstrates exceptional business etiquette, and keeps your name fresh in the hiring manager’s mind while they evaluate candidates. Your message should be concise (3 to 4 sentences), thanking the interviewer for their time, referencing a specific topic discussed during the interview, and reiterating your enthusiasm for the role.',
    'Timing and professional etiquette are critical when following up on a pending recruitment decision. Always respect the recruiter’s stated hiring timeline. If an interviewer mentions they will make a decision by Friday, wait until the following Monday or Tuesday before sending a polite check-in email or making a brief phone call. This demonstrates patience, respect for their operational workload, and strong professional self-awareness.'
  ],

  graphicCard1: {
    title: 'Post-Interview Etiquette: Pro Move vs. Rookie Mistake',
    bullets: [
      '❌ ROOKIE MISTAKE: Calling or emailing the hiring manager daily demanding to know if you got the job.',
      '✅ PRO MOVE: Sending a polished thank-you email within 24 hours, then waiting until the agreed decision date passes before checking in.',
      '❌ ROOKIE MISTAKE: Ghosting or sending an angry reply if you receive a polite rejection email.',
      '✅ PRO MOVE: Replying professionally to thank them for the opportunity and politely requesting constructive feedback for future growth.',
      'MATCHING CHALLENGE: All Sectors ➔ A 24-hour thank-you note reiterates key licences (e.g., White Card, NDIS, LF Ticket) and enthusiasm.',
      'MATCHING CHALLENGE: Agency/Recruiter ➔ Check in via phone 5 days post-interview to ask if the client requires additional documentation.'
    ]
  },

  branchingScenario: {
    id: 'BS-09',
    situation: 'You interviewed for a role 8 days ago. During the interview, the panel stated they would contact shortlisted candidates within 5 business days. You have not received any email or call yet. What is the most professional follow-up action?',
    options: [
      {
        id: 'opt1',
        choice: 'Option A: Show up at the workplace reception unannounced and ask to speak directly to the manager who interviewed you.',
        isCorrect: false,
        feedback: 'Clear explanation of why this causes issues: Arriving unannounced disrupts workplace operations, puts staff on the spot, and shows a lack of respect for professional boundaries.'
      },
      {
        id: 'opt2',
        choice: 'Option B: Send a polite, concise follow-up email to the interviewer referencing the job title, stating your continued interest, and politely asking if they have an updated recruitment timeline.',
        isCorrect: true,
        feedback: 'Positive reinforcement detailing why this is the correct approach: A concise, structured email demonstrates professional initiative, respects the hiring manager’s schedule, and keeps your application top-of-mind.'
      },
      {
        id: 'opt3',
        choice: 'Option C: Post a complaint on social media naming the company for bad communication and ghosting candidates.',
        isCorrect: false,
        feedback: 'Clear explanation of why this violates standards: Publicly complaining about employers permanently damages your reputation across the industry and results in immediate blacklisting.'
      }
    ]
  },

  lesson2Title: 'Handling Offers, Negotiating Terms & Processing Rejection',
  lesson2Content: [
    'When you receive a job offer, review the formal employment contract carefully before signing. Verify core details including employment classification (full-time, part-time, or casual), hourly base rate or annual salary against relevant modern awards, work location, rostered hours, and superannuation contributions. If you need 24 to 48 hours to review the agreement or consult your family, communicate this politely to the hiring manager: *"Thank you so much for this offer! I am very excited about the opportunity. May I take 24 hours to review the formal contract details before confirming?"*',
    'Receiving a rejection email can be disappointing, but resilient jobseekers treat rejections as valuable learning opportunities. Never burn bridges by reacting emotionally or sending defensive replies. Instead, respond with a professional 3-sentence note: 1) Thank them for the opportunity to interview, 2) Request any specific constructive feedback regarding how you can improve your candidate profile, and 3) Ask to be kept in mind for future vacancies. Recruiters frequently revisit runner-up candidates when new roles open up.'
  ],

  practicalReflection: 'Think about a past rejection or missed opportunity in your career or education. How could asking for constructive feedback have helped you prepare for your next success?',
  actionStepTitle: 'Thank-You & Follow-Up Email Scripting Task',
  actionStepPrompt: 'Open a document or notes app. Draft two 3-sentence templates: 1) A 24-hour Post-Interview Thank-You Email, and 2) A polite Follow-Up Email to send 5 days after an interview if you have not received an update.',

  quiz: [
    {
      id: 'Q1',
      question: 'Within what timeframe should a post-interview thank-you email ideally be sent to the hiring manager or interview panel?',
      options: [
        'Within 24 hours of completing the interview',
        'At least two weeks after the interview',
        'Thank-you emails should never be sent under any circumstances'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why option 1 is correct: Sending a thank-you note within 24 hours demonstrates high professional courtesy, enthusiasm, and attention to detail while candidate evaluations are underway.'
    },
    {
      id: 'Q2',
      question: 'What is the correct protocol if an employer’s stated decision deadline passes without any update on your application?',
      options: [
        'Send a concise, polite follow-up email or call 1 to 2 business days after the deadline has passed',
        'Call the company phone line continuously every 15 minutes until someone answers',
        'Assume you got the job and show up ready to work on Monday morning'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining the core principle: Waiting 1-2 days past the agreed deadline before sending a polite check-in shows respect for manager workloads while maintaining clear communication.'
    },
    {
      id: 'Q3',
      question: 'How should a candidate handle receiving a job rejection email from a company they were eager to join?',
      options: [
        'Respond politely, thank them for the opportunity, and ask for constructive feedback to improve future applications',
        'Send an angry email arguing that the interview panel made a terrible mistake',
        'Ignore the email completely and block the company’s phone number'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why this protocol matters: Remaining professional and requesting constructive feedback builds rapport with recruiters, who often re-contact strong secondary candidates for future roles.'
    },
    {
      id: 'Q4',
      question: 'Which key details should you verify in an Australian employment contract before signing a formal job offer?',
      options: [
        'Employment type (casual, permanent), pay rate/award classification, rostered hours, and superannuation terms',
        'The manager’s personal home address and personal hobbies',
        'Only the company logo design on the front page'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed explanation referencing relevant standards: Verifying pay rates, award standards, employment status, and superannuation ensures your rights under the Fair Work Act are fully protected before work commences.'
    },
    {
      id: 'Q5',
      question: 'Is it acceptable to request 24 to 48 hours to review a formal written job offer before signing?',
      options: [
        'Yes, it is standard professional practice to request a short, reasonable window to review contract terms thoroughly',
        'No, you must sign any contract within 30 seconds of receiving it or go to jail',
        'No, asking to read a contract is considered extremely disrespectful in Australia'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed summary of the correct execution method: Requesting a 24-to-48-hour review period is standard, professional, and protects both candidate and employer by ensuring clear mutual agreement.'
    }
  ]
};