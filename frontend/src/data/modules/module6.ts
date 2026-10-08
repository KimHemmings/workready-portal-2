import type { ModuleData } from '../modulesData';

export const module6: ModuleData = {
  id: 'M06',
  moduleNumber: 6,
  title: 'Digital Applications & Online Professional Presence',
  category: 'Resumes & Applications',
  estimatedMins: 20,
  pbasPoints: 5,
  videoScript: "Welcome to Module 6: Digital Applications & Online Professional Presence. Over 85% of Australian employers screen jobseekers online before extending an interview invitation. In this module, we examine how to manage recruitment portals, optimize LinkedIn profiles, protect your digital footprint, and communicate professionally across online platforms.",

  lesson1Title: 'Navigating Job Portals & Digital Recruitment Systems',
  lesson1Content: [
    'Applying for employment in Australia increasingly takes place through digital job boards (such as SEEK, Indeed, and Jora), corporate career portals (Workday, SuccessFactors), and government recruitment portals (SmartJobs, IWorkforNSW). Modern application management requires maintaining an organized digital filing system on your computer or cloud storage. Keep master PDF versions of your tailored resumes, cover letters, verified tickets, and identification documents named clearly (e.g., *John_Doe_Resume_2026.pdf*) so you can upload accurate files quickly without making submission errors.',
    'When completing digital application forms, ensure every field is filled out accurately. Many online portals use screening algorithms that parse form fields independently of your uploaded resume attachment. Failing to select a required checkbox (such as confirming your Australian work rights, current driver licence status, or willingness to undergo a National Police Check) can result in instant automated filtering before a human recruiter reviews your file.'
  ],

  graphicCard1: {
    title: 'Digital Presence Standards: Pro Move vs. Rookie Mistake',
    bullets: [
      'âŒ ROOKIE MISTAKE: Using an unprofessional or casual email address (e.g., party_animal99@email.com) for job applications.',
      'âœ… PRO MOVE: Creating a dedicated, professional email address using your name (e.g., firstname.lastname@email.com).',
      'âŒ ROOKIE MISTAKE: Leaving personal social media accounts public with inappropriate photos, offensive comments, or public workplace complaints.',
      'âœ… PRO MOVE: Setting personal social media profiles to private and building a clean, professional LinkedIn profile.',
      'MATCHING CHALLENGE: Corporate/Admin âž” Optimize LinkedIn headline, upload clean professional headshot, and connect with local recruiters.',
      'MATCHING CHALLENGE: Trades/Care/Retail âž” Ensure online application form fields match your uploaded PDF tickets and licences exactly.'
    ]
  },

  branchingScenario: {
    id: 'BS-06',
    situation: 'You submit an online application for a customer support / administration role through a major employer portal. Two days later, a hiring manager conducts an online background search and finds your public social media profile, which features public posts complaining about a former supervisor and calling a previous job "a complete waste of time". What is the impact of this digital footprint?',
    options: [
      {
        id: 'opt1',
        choice: 'Option A: No impact, because social media accounts are personal and employers are legally prohibited from looking at public online profiles.',
        isCorrect: false,
        feedback: 'Clear explanation of why this causes issues: Australian recruiters routinely review publicly available information; public posts attacking past employers signal high risk and poor professionalism.'
      },
      {
        id: 'opt2',
        choice: 'Option B: Severe negative impact; the hiring manager views the posts as a major culture and communication risk, leading to immediate rejection of your application.',
        isCorrect: true,
        feedback: 'Positive reinforcement detailing why this is the correct approach: Maintaining a clean digital footprint demonstrates professional judgment. Employers seek reliable candidates who represent their brand positively.'
      },
      {
        id: 'opt3',
        choice: 'Option C: Positive impact, because it shows honesty and transparency about past workplace experiences.',
        isCorrect: false,
        feedback: 'Clear explanation of why this violates standards: Publicly disparaging past employers demonstrates a breach of professional conduct and raises serious red flags regarding team fit.'
      }
    ]
  },

  lesson2Title: 'Building a LinkedIn Profile & Protecting Your Digital Reputation',
  lesson2Content: [
    'A professional LinkedIn profile serves as a digital version of your resume that is accessible 24/7 to Australian recruiters, talent acquisition specialists, and business owners. To build an effective LinkedIn presence: 1) Upload a clear, professional headshot photo with a neutral background, 2) Write a compelling Headline that includes your target job role and key tickets (e.g., *"Warehouse Specialist | LF Forklift Ticket | Logistics & Inventory Management"*), 3) Draft an engaging Summary detailing your background and career goals, and 4) Turn on the **"Open to Work"** setting to alert local hiring managers.',
    'Digital reputation management requires conducting a regular self-audit. Search your full name on major search engines to see what publicly accessible images, comments, or old forum posts appear. Lock down privacy settings on personal platforms (Instagram, Facebook, TikTok) to "Friends Only", and ensure all professional digital correspondenceâ€”including messages sent via Seek or LinkedInâ€”uses formal language, correct grammar, and polite salutations.'
  ],

  practicalReflection: 'Conduct a quick mental or search audit of your current online footprint. What is one public profile setting or email address you need to update today to ensure 100% professional presentation?',
  actionStepTitle: 'Digital Audit & LinkedIn Setup Task',
  actionStepPrompt: 'Open your web browser or social media app. 1) Verify that your personal accounts are set to maximum privacy, 2) Draft a professional 1-sentence LinkedIn Headline showcasing your target job title and primary qualification, and 3) Ensure your application email address uses a clean [Firstname.Lastname] format.',

  quiz: [
    {
      id: 'Q1',
      question: 'Approximately what percentage of Australian employers and recruiters review candidates online or via social media during the hiring process?',
      options: [
        'Over 85% of employers screen candidates online or review public profiles',
        'Less than 5% of employers ever search candidates online',
        'Online screening is strictly illegal and never occurs in Australia'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why option 1 is correct: The vast majority of modern employers conduct online checks to verify candidate background, professional fit, and brand alignment.'
    },
    {
      id: 'Q2',
      question: 'What is the recommended naming convention for digital application files (PDF resumes, cover letters, ticket copies) when uploading to job portals?',
      options: [
        'A clear, professional format such as "Firstname_Lastname_Resume_2026.pdf"',
        'Generic default names like "Document1.pdf" or "resume_final_final.docx"',
        'Random numbers or symbols like "12345_upload.pdf"'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining the core principle: Clear file naming conventions help recruiters organize your documents easily and prevent mix-ups in application tracking systems.'
    },
    {
      id: 'Q3',
      question: 'How should personal social media accounts (Facebook, Instagram, TikTok) be managed while actively searching for work?',
      options: [
        'Leave all personal profiles, photos, and comments set to completely public',
        'Set personal accounts to maximum privacy ("Friends Only") and remove any public content criticizing past employers',
        'Delete all social media accounts permanently from the internet'
      ],
      correctAnswerIndex: 1,
      explanation: 'Detailed feedback explaining why this protocol matters: Setting personal accounts to private protects your personal life while ensuring recruiters only view your professional presentation.'
    },
    {
      id: 'Q4',
      question: 'What information should be prominently featured in your LinkedIn Headline to attract Australian recruiters?',
      options: [
        'Your target job role, key industry tickets/licences, and core area of expertise',
        'Your personal hobbies, political views, and favorite sports teams',
        'A vague quote without mentioning any industry or career focus'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed explanation referencing relevant standards: Featuring your target job title and verified tickets in your headline ensures you appear in recruiter search queries for open roles.'
    },
    {
      id: 'Q5',
      question: 'What risk occurs if you leave required checkboxes (such as Australian Work Rights or Driver Licence status) blank on an online application portal?',
      options: [
        'Automated portal screening algorithms may filter out your application before a human recruiter reviews it',
        'The portal will automatically hire you without an interview',
        'There is no risk; online application forms ignore check boxes'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed summary of the correct execution method: Recruitment portals use mandatory form fields as hard filters; incomplete fields result in automated rejection.'
    }
  ]
};