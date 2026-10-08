import type { ModuleData } from '../modulesData';

export const module4: ModuleData = {
  id: 'M04',
  moduleNumber: 4,
  title: 'Building Your Core Master Resume',
  category: 'Resumes & Applications',
  estimatedMins: 20,
  pbasPoints: 5,
  videoScript: "Welcome to Module 4: Building Your Core Master Resume. Your resume is your primary personal marketing tool in the Australian job market. In this module, we examine how to construct a clean, ATS-compliant master resume that clearly communicates your skills, licences, work history, and reliability across any industry.",

  lesson1Title: 'Australian Resume Architecture & ATS Screening Standards',
  lesson1Content: [
    'In the modern Australian job marketâ€”spanning healthcare, warehousing, civil construction, retail, and office administrationâ€”recruiters and employers process hundreds of applications per vacancy. Most medium-to-large Australian businesses utilize **Applicant Tracking Systems (ATS)** software to parse and rank incoming resumes before a human recruiter even views them. To ensure your resume successfully passes automated ATS filters, it must be formatted cleanly in a single-column layout using standard fonts (such as Arial, Calibri, or Inter) without complex visual tables, graphics, text boxes, or embedded image elements.',
    'An Australian standard master resume should strictly run between **2 to 3 pages in length** and be logically structured into core sections: 1) Professional Header & Contact Details, 2) Tailored Professional Summary (3â€“4 lines), 3) Core Skills & Key Competencies, 4) Licences, Tickets & Certifications (placed prominently), 5) Employment History in reverse-chronological order, 6) Education & Training, and 7) Contactable Professional Referees.'
  ],

  graphicCard1: {
    title: 'Australian Resume Standards: Pro Move vs. Rookie Mistake',
    bullets: [
      'âŒ ROOKIE MISTAKE: Including a personal profile photo, date of birth, age, or marital status on your Australian resume.',
      'âœ… PRO MOVE: Excluding personal photos and demographics entirely, focusing strictly on skills, tickets, experience, and reliability.',
      'âŒ ROOKIE MISTAKE: Designing complex dual-column graphical templates with skill progress bars that ATS software cannot read.',
      'âœ… PRO MOVE: Using a clean, single-column document layout saved as a standard PDF or Word (.docx) file.',
      'MATCHING CHALLENGE: Trades & Civil âž” Highlight White Card, Forklift (LF), First Aid, and Machinery Tickets right on Page 1.',
      'MATCHING CHALLENGE: Care & Health âž” Highlight NDIS Worker Screening, Working With Children Check (WWCC), and CPR certifications.'
    ]
  },

  branchingScenario: {
    id: 'BS-04',
    situation: 'You are updating your resume after taking a 12-month career break to care for a family member while also undertaking informal community volunteering. You want to present your recent background professionally to Australian recruiters. What is the correct strategy?',
    options: [
      {
        id: 'opt1',
        choice: 'Option A: Leave a blank 12-month gap in your work history without explanation, hoping employers will not notice during the screening process.',
        isCorrect: false,
        feedback: 'Clear explanation of why this causes issues: Unexplained employment gaps raise immediate red flags for ATS software and recruiters, often leading to automatic rejection.'
      },
      {
        id: 'opt2',
        choice: 'Option B: Include a short, professional entry in your employment history detailing your volunteer work and key transferable skills gained during the period (such as scheduling, budget management, and care coordination).',
        isCorrect: true,
        feedback: 'Positive reinforcement detailing why this is the correct approach: Framing career gaps constructively with volunteer experience or informal skill development demonstrates continuous initiative, transparency, and practical capability.'
      },
      {
        id: 'opt3',
        choice: 'Option C: Invent a fictitious company and job title to fill the 12-month period so your resume appears completely uninterrupted.',
        isCorrect: false,
        feedback: 'Clear explanation of why this violates standards: Falsifying work history on an Australian job application constitutes fraud, resulting in instant disqualification or summary dismissal during background checks.'
      }
    ]
  },

  lesson2Title: 'Action-Oriented Bullet Points & Licences Showcase',
  lesson2Content: [
    'When detailing past work duties, avoid passive or vague descriptions like *"responsible for customer service"* or *"helped out around site"*. Instead, use **Action Verbs paired with Measurable Outcomes** to demonstrate impact. For example: *"Operated high-reach forklifts safely, processing 40+ pallet dispatches per shift while maintaining zero WH&S incidents"* or *"Managed point-of-sale transactions and handled high-volume customer inquiries while maintaining accurate cash balances."*',
    'Holding valid Australian licences, tickets, and clearances is one of the strongest competitive advantages a candidate can possess. In sectors like civil construction, disability care, transport, and hospitality, employers cannot legally place you on site without verified tickets. Ensure your licences (e.g., Driver Licence, White Card, RSA/RCG, NDIS Check, First Aid) are prominently displayed near the top of Page 1 with current expiry dates.'
  ],

  practicalReflection: 'Review your current work history or informal experience. What is one specific achievement or daily duty you can rewrite using an active verb and a measurable result?',
  actionStepTitle: 'Master Resume Licensing & Summary Audit',
  actionStepPrompt: 'Open a document or notes app. Draft a 3-line Professional Summary showcasing your core industry focus, key strengths, and an itemized bulleted list of all valid tickets, licences, and certifications you currently hold.',

  quiz: [
    {
      id: 'Q1',
      question: 'Why should complex visual tables, graphics, and dual-column layouts be avoided on Australian resumes?',
      options: [
        'They cause Applicant Tracking System (ATS) screening software to misread or corrupt your text, leading to automatic rejection',
        'Australian employers only accept hand-written paper resumes',
        'Visual elements increase the file size beyond email sending limits'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why option 1 is correct: Automated ATS software parses resume text sequentially from top to bottom; complex columns and graphic boxes disrupt text parsing.'
    },
    {
      id: 'Q2',
      question: 'What is the standard recommended length for a professional resume in Australia?',
      options: [
        'Strictly 1 single page regardless of experience',
        '2 to 3 concise, structured pages detailing relevant experience and tickets',
        'At least 6 to 10 pages long'
      ],
      correctAnswerIndex: 1,
      explanation: 'Detailed feedback explaining the core principle: A 2-to-3 page resume provides sufficient detail on work history, tickets, and achievements without overwhelming recruiters.'
    },
    {
      id: 'Q3',
      question: 'Which of the following personal details should strictly BE EXCLUDED from an Australian resume under Fair Work and equal opportunity standards?',
      options: [
        'Your mobile phone number and professional email address',
        'Your profile photo, age, date of birth, marital status, and religion',
        'Your current licences, tickets, and educational qualifications'
      ],
      correctAnswerIndex: 1,
      explanation: 'Detailed feedback explaining why this protocol matters: Excluding demographics and photos protects against unconscious bias and focuses selection purely on merit and capability.'
    },
    {
      id: 'Q4',
      question: 'How should past work duties be formatted under employment entries to create maximum impact?',
      options: [
        'In long, dense paragraphs without bullet points or spacing',
        'Using bullet points starting with strong Action Verbs combined with measurable outcomes or operational duties',
        'Listing only the company name without describing any duties or achievements'
      ],
      correctAnswerIndex: 1,
      explanation: 'Detailed explanation referencing relevant standards: Bullet points with active verbs (e.g., "Coordinated", "Operated", "Managed") allow recruiters to quickly assess your real-world capability.'
    },
    {
      id: 'Q5',
      question: 'Where should verified industry tickets, licences, and safety clearances (e.g., White Card, NDIS Check, First Aid) be located on your resume?',
      options: [
        'Prominently on Page 1 within a dedicated Licences & Qualifications section',
        'Hidden at the very bottom of the final page in small font',
        'Omitted entirely from the resume and only mentioned during an interview'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed summary of the correct execution method: Placing verified tickets prominently on Page 1 immediately proves compliance and site-readiness to recruiters.'
    }
  ]
};