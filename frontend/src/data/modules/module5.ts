import type { ModuleData } from '../modulesData';

export const module5: ModuleData = {
  id: 'M05',
  moduleNumber: 5,
  title: 'Tailoring Applications & Keyword Alignment',
  category: 'Resumes & Applications',
  estimatedMins: 20,
  pbasPoints: 5,
  videoScript: "Welcome to Module 5: Tailoring Applications & Keyword Alignment. Sending the exact same generic resume to 50 different job ads rarely yields results. In this module, we examine how to analyze job advertisements, extract critical employer keywords, tailor your application materials, and write concise, compelling cover letters.",

  lesson1Title: 'Decoding Job Advertisements & ATS Keyword Matching',
  lesson1Content: [
    'When Australian employers draft job advertisements—whether seeking a store person in logistics, a support worker in healthcare, an administrative assistant in corporate, or a plant operator in civil construction—they build specific requirements into the listing. These include mandatory licences, specialized software experience, key physical capabilities, and behavioral attributes. Automated ATS software and human recruiters scan incoming applications specifically searching for these exact key terms.',
    'Tailoring your application does not mean fabricating experience; it means adjusting the vocabulary, skill highlights, and personal summary of your master resume to align directly with the employer\'s requested terminology. If a job ad specifically requests *"experience in high-volume stock dispatch and RF scanning"*, ensuring those exact words appear in your skills list and work history dramatically increases your match percentage score.'
  ],

  graphicCard1: {
    title: 'Application Tailoring: Pro Move vs. Rookie Mistake',
    bullets: [
      '❌ ROOKIE MISTAKE: Sending an identical generic resume to 30 completely different job postings with one click.',
      '✅ PRO MOVE: Spending 10 minutes analyzing the job ad, highlighting 4-5 core keywords, and integrating them into your resume summary.',
      '❌ ROOKIE MISTAKE: Ignoring mandatory licence requirements listed in the advertisement (e.g., applying without a White Card when strictly required).',
      '✅ PRO MOVE: Placing required licences prominently at the very top of your resume and addressing your current status in your cover letter.',
      'MATCHING CHALLENGE: Healthcare/Care Ads ➔ Mirror terms like "NDIS compliance", "patient advocacy", and "medication administration".',
      'MATCHING CHALLENGE: Retail/Admin Ads ➔ Mirror terms like "POS reconciliation", "customer engagement", and "MS Office proficiency".'
    ]
  },

  branchingScenario: {
    id: 'BS-05',
    situation: 'You are applying for a position that lists "Strong verbal communication skills and experience using inventory management software" as key requirements. You have used inventory software in a past role, but your master resume currently just says "general warehouse work". What is the correct application adjustment?',
    options: [
      {
        id: 'opt1',
        choice: 'Option A: Submit your master resume as-is without changes, assuming the employer will know what warehouse work involves.',
        isCorrect: false,
        feedback: 'Clear explanation of why this causes issues: ATS software and recruiters look for explicit keyword matches; vague descriptions get screened out automatically.'
      },
      {
        id: 'opt2',
        choice: 'Option B: Update your skills section and bullet points to explicitly specify "Inventory Management Software Operation" and highlight your verbal communication experience in team environments.',
        isCorrect: true,
        feedback: 'Positive reinforcement detailing why this is the correct approach: Directly mirroring requested keywords proves you meet the specific requirements and ensures ATS compliance.'
      },
      {
        id: 'opt3',
        choice: 'Option C: Copy and paste the entire job advertisement text directly into your resume in white font to trick the automated screening system.',
        isCorrect: false,
        feedback: 'Clear explanation of why this violates standards: "White fonting" tricks are easily flagged by modern ATS software, resulting in permanent blacklisting from company candidate databases.'
      }
    ]
  },

  lesson2Title: 'Crafting High-Impact, Short Australian Cover Letters',
  lesson2Content: [
    'A professional Australian cover letter should be a concise, targeted 1-page document (3 to 4 paragraphs) that introduces who you are, explains why you are drawn to the company, and directly connects your key experience to their advertisement. Avoid long, repetitive personal essays; hiring managers want a clear business case explaining how you add value to their team from Day 1.',
    'Structure your cover letter using the 4-Block Formula: 1) **Professional Salutation & Target Role Title** (addressing the manager or company directly), 2) **The Value Pitch** (highlighting 2-3 core skills or tickets relevant to their ad), 3) **Proof of Fit** (a brief real-world example of past reliability or achievement), and 4) **Professional Call to Action** (expressing enthusiasm for an interview and providing contact details).'
  ],

  practicalReflection: 'Find a recent job ad in a sector you want to work in. What are 3 specific keywords or required qualifications listed in the ad that you need to highlight on your application?',
  actionStepTitle: 'Job Ad Keyword Extraction & Cover Letter Exercise',
  actionStepPrompt: 'Select a real job advertisement online. Extract 3 core skill keywords from the ad, and write a 3-paragraph tailored cover letter introducing yourself and matching your skills to those 3 keywords.',

  quiz: [
    {
      id: 'Q1',
      question: 'What is the primary operational objective of tailoring your resume keywords to a specific job advertisement?',
      options: [
        'To match automated ATS scanning algorithms and demonstrate immediate, explicit alignment with employer requirements',
        'To make your resume look longer than other applicants',
        'To hide gaps in your educational background'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why option 1 is correct: Mirroring ad keywords ensures ATS software and recruiters recognize your direct capability for the specific role.'
    },
    {
      id: 'Q2',
      question: 'What is the standard recommended length for an Australian professional cover letter?',
      options: [
        'Strictly 1 page consisting of 3 to 4 targeted, structured paragraphs',
        '3 to 4 pages detailing your entire life history',
        'A single sentence saying "please see attached resume"'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining the core principle: A concise 1-page cover letter respects recruiter time while delivering a focused pitch on why you fit the role.'
    },
    {
      id: 'Q3',
      question: 'What is the "white fonting" technique, and why is it strictly advised against in Australian job applications?',
      options: [
        'Using white background paper for printed resumes',
        'Pasting hidden job ad text in white font to fool ATS software; it causes automatic system flagging and blacklisting',
        'Writing your cover letter in a light grey font color'
      ],
      correctAnswerIndex: 1,
      explanation: 'Detailed feedback explaining why this protocol matters: Modern ATS platforms detect hidden text tricks easily, leading to candidate disqualification and database blacklisting.'
    },
    {
      id: 'Q4',
      question: 'How should a professional cover letter salutation be addressed if the specific hiring manager\'s name is not listed on the job ad?',
      options: [
        'Address it professionally to "Dear Hiring Team," or "Dear [Company Name] Recruitment Team,"',
        'Use informal greetings like "Hey mate," or "To whom it may concern,"',
        'Leave the salutation blank and start writing immediately'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed explanation referencing relevant standards: Addressing the specific company recruitment team maintains a professional tone when individual manager names are unlisted.'
    },
    {
      id: 'Q5',
      question: 'What should you do if a job advertisement lists a qualification as "desirable" (preferred, but not mandatory) that you currently do not hold?',
      options: [
        'Falsify your application by stating you hold the qualification',
        'Highlight your core transferable skills and express a clear willingness to undertake the qualification upon appointment',
        'Withdraw your application completely without applying'
      ],
      correctAnswerIndex: 1,
      explanation: 'Detailed summary of the correct execution method: Highlighting strong transferable skills alongside a proactive commitment to learning builds trust while addressing desirable criteria.'
    }
  ]
};