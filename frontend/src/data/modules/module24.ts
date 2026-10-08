import type { ModuleData } from '../modulesData';

export const module24: ModuleData = {
  id: 'M24',
  moduleNumber: 24,
  title: 'Master Curriculum Capstone & Career Readiness Audit',
  category: 'Job Searching',
  estimatedMins: 20,
  pbasPoints: 5,
  videoScript: "Welcome to Module 24: Master Curriculum Capstone & Career Readiness Audit. Congratulations on reaching the final module of the 24-part digital learning curriculum! In this capstone module, we consolidate your core competencies, conduct a final site-readiness audit, assemble your portfolio, and activate your long-term employment action plan.",

  lesson1Title: 'Curriculum Consolidation & The Jobseeker Capability Audit',
  lesson1Content: [
    'Completing this 24-module curriculum represents a significant milestone in your professional journey. Across the course, you have developed critical capabilities across four key pillars: 1) Workplace Expectations (punctuality, WH&S standards, rights under Fair Work, communication, and adaptability), 2) Resumes & Applications (ATS optimization, keyword tailoring, cover letters, and digital presence), 3) Interviews & Selection (employer research, STAR behavioral messaging, post-interview follow-ups, and trial readiness), and 4) Financial & Career Mastery (budgeting, tax deductions, upskilling, and mental health resilience).',
    'Before launching into high-volume applications, conduct a final Site-Readiness Audit. Verify that your job search portfolio contains all verified assets: 1) Clean, ATS-compliant Master Resume, 2) Tailored Cover Letter templates, 3) Verified copies of all active tickets and licences (White Card, Driver Licence, First Aid, NDIS Check, LF Forklift, RSA, etc.), 4) Proof of completed learning modules (+120 total PBAS points earned), and 5) Contactable professional references.'
  ],

  graphicCard1: {
    title: 'Career Capstone Checklist: Pro Move vs. Rookie Mistake',
    bullets: [
      'âŒ ROOKIE MISTAKE: Finishing training modules without updating your resume or applying to real-world vacancies.',
      'âœ… PRO MOVE: Adding your completed 24-module Vocational Certificate to your resume and executing a daily application plan.',
      'âŒ ROOKIE MISTAKE: Entering job interviews without rehearsed STAR stories or verified ticket documentation.',
      'âœ… PRO MOVE: Approaching every interview with researched company knowledge, rehearsed STAR answers, and full ticket copies.',
      'PORTFOLIO ASSETS: Master Resume, Tailored Cover Letter, Verified Tickets, Professional Referees, PBAS Audit Log.',
      'NEXT MILESTONE: Submit 5 tailored applications weekly, make 2 direct employer contacts, and log all PBAS points.'
    ]
  },

  branchingScenario: {
    id: 'BS-24',
    situation: 'You have completed all 24 learning modules and updated your master resume and tickets. You receive a call from a local employer inviting you to an interview in 48 hours for your ideal job role. How do you execute your final preparation plan?',
    options: [
      {
        id: 'opt1',
        choice: 'Option A: Do no preparation, assuming that completing the modules alone guarantees you will get hired on the spot.',
        isCorrect: false,
        feedback: 'Clear explanation of why this causes issues: Modules provide the knowledge, but executing employer research and rehearsing STAR answers is required to succeed in the interview room.'
      },
      {
        id: 'opt2',
        choice: 'Option B: Research the company values/services, practice 3 STAR interview stories, audit your commute route, organize physical copies of your tickets/resume, and prepare 3 questions for the panel.',
        isCorrect: true,
        feedback: 'Positive reinforcement detailing why this is the correct approach: Combining research, STAR rehearsal, route planning, and organized ticket folders represents total interview readiness.'
      },
      {
        id: 'opt3',
        choice: 'Option C: Call the employer and ask if they can skip the interview entirely because you completed training modules.',
        isCorrect: false,
        feedback: 'Clear explanation of why this violates standards: Requesting to skip recruitment steps demonstrates poor professionalism and leads to immediate disqualification.'
      }
    ]
  },

  lesson2Title: 'Activating Your 90-Day Employment Action Plan & Long-Term Success',
  lesson2Content: [
    'Your final step is activating your 90-Day Employment Action Plan. Break your ongoing job search into clear weekly targets: maintain a disciplined 3-hour daily job search routine, submit 4â€“5 tailored applications weekly, engage with 2 local employers directly, register with 2 specialist recruitment agencies, and log all completed activities for your monthly PBAS mutual obligation reporting.',
    'Remember that securing employment is a journey that rewards consistency, resilience, and professionalism. Every application tailored, every follow-up email sent, and every interview attended brings you closer to long-term financial independence and career success. You now possess the tools, knowledge, and compliance verification needed to thrive in the Australian workforce.'
  ],

  practicalReflection: 'Reflect on your growth across these 24 modules. What is the single most valuable strategy you learned, and how will you apply it in your job search this week?',
  actionStepTitle: 'Master Career Portfolio Activation Task',
  actionStepPrompt: 'Open your master resume file. Add a new section titled Professional Development and list: Completed 24-Module Australian Workplace & Jobseeker Readiness Curriculum (Covering WH&S, Fair Work, ATS Resumes, STAR Method, and Financial Literacy) - 2026.',

  quiz: [
    {
      id: 'Q1',
      question: 'What are the four core capability pillars covered across this 24-module digital learning curriculum?',
      options: [
        'Workplace Expectations, Resumes & Applications, Interviews & Selection, and Financial & Career Mastery',
        'Mathematics, World History, Creative Art, and Foreign Languages',
        'Video Gaming, Social Media Management, Retail Shopping, and Travel Planning'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why option 1 is correct: The curriculum is structured across 4 essential pillars designed to take jobseekers from foundational readiness to long-term career success.'
    },
    {
      id: 'Q2',
      question: 'Where on your master resume should you record the successful completion of this 24-module vocational learning program?',
      options: [
        'Under a dedicated "Professional Development & Training" section on Page 1 or 2',
        'Hidden in a footnote on the final page in tiny font',
        'Training achievements should never be listed on a resume'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining the core principle: Listing accredited professional development and job-readiness training on your resume proves continuous learning and initiative to recruiters.'
    },
    {
      id: 'Q3',
      question: 'What five verified assets must be organized inside your Jobseeker Site-Readiness Portfolio before attending interviews?',
      options: [
        'ATS Master Resume, Tailored Cover Letter, Verified Licences/Tickets, Professional References, and PBAS Audit Log',
        'Personal passport, high school art projects, old utility bills, social media handles, and sports trophies',
        'A single hand-written note with your phone number'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why this protocol matters: An organized candidate portfolio ensures you can provide instant proof of identity, licences, and work history to hiring managers.'
    },
    {
      id: 'Q4',
      question: 'What is the recommended weekly application cadence when executing a disciplined 90-Day Employment Action Plan?',
      options: [
        'Submitting 4-5 high-quality, tailored applications weekly paired with direct employer contact and agency networking',
        'Applying to 100 jobs randomly in 5 minutes once a month',
        'Waiting passively for employers to find your phone number'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed explanation referencing relevant standards: Consistent, high-quality tailored applications combined with direct outreach generate sustainable interview pipelines.'
    },
    {
      id: 'Q5',
      question: 'How many total PBAS mutual obligation points are earned upon completing all 24 modules in this curriculum?',
      options: [
        '120 verified PBAS Points (+5 points per completed module with audit hash tracking)',
        '10 PBAS Points total',
        'Zero points'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed summary of the correct execution method: Each of the 24 modules awards +5 verifiable PBAS points upon completion, totaling 120 points toward your DEWR mutual obligation target.'
    }
  ]
};