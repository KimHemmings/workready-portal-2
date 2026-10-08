import type { ModuleData } from '../modulesData';

export const module18: ModuleData = {
  id: 'M18',
  moduleNumber: 18,
  title: 'Career Progression, Upskilling & Retention',
  category: 'Workplace Expectations',
  estimatedMins: 20,
  pbasPoints: 5,
  videoScript: "Welcome to Module 18: Career Progression, Upskilling & Retention. Securing an entry-level position is just the beginning of your professional journey. In this module, we examine how to map out career pathways, acquire accredited industry tickets, build leadership qualities, and advance into higher-paying roles.",

  lesson1Title: 'Career Pathways & Strategic Skill Acquisition',
  lesson1Content: [
    'Long-term job security and wage growth in Australia depend on continuous **Upskilling**. Entry-level roles in civil construction, healthcare, warehousing, hospitality, and corporate administration serve as launchpads for higher-paying positions. For example, a warehouse storeperson can upskill into a Logistics Coordinator or Fleet Dispatcher; an entry-level care worker can progress to a Team Leader or Enrolled Nurse; and a civil laborer can obtain plant tickets to become a Heavy Equipment Operator.',
    'Map out your career trajectory by identifying the specific licences, accredited tickets, or qualifications required for your next target level. Research government-subsidized training schemes (e.g., TAFE Fee-Free courses, User Choice funding, or employer-sponsored training) to acquire higher-level qualifications without incurring heavy personal debt.'
  ],

  graphicCard1: {
    title: 'Career Progression: Pro Move vs. Rookie Mistake',
    bullets: [
      'âŒ ROOKIE MISTAKE: Working in the same entry-level role for 5 years without adding a single new ticket or skill to your resume.',
      'âœ… PRO MOVE: Investing in 1 new accredited ticket or short course every 6 to 12 months to unlock higher pay tiers.',
      'âŒ ROOKIE MISTAKE: Expecting promotions based purely on time served rather than demonstrated skill and leadership.',
      'âœ… PRO MOVE: Volunteering for new site responsibilities, mentoring new staff, and maintaining zero safety incidents.',
      'MATCHING CHALLENGE: Trades & Civil âž” Add White Card âž” Forklift (LF) âž” Rigging/EWP âž” Cert IV in Building & Construction.',
      'MATCHING CHALLENGE: Health & Care âž” Add First Aid/CPR âž” Cert III Care âž” Med Endorsement âž” Diploma / Nursing Degree.'
    ]
  },

  branchingScenario: {
    id: 'BS-18',
    situation: 'You have been working reliably in your role for 12 months with zero safety breaches and excellent attendance. A Senior Leading Hand / Team Leader position opens up within your company. You want to apply, but feel hesitant because you don\'t hold every single preferred qualification listed in the internal advertisement. What is the best strategy?',
    options: [
      {
        id: 'opt1',
        choice: 'Option A: Decide not to apply at all, assuming the company will automatically offer you the job if they want you.',
        isCorrect: false,
        feedback: 'Clear explanation of why this causes issues: Employers expect candidates to demonstrate ambition by formally applying; waiting passively guarantees you will be passed over.'
      },
      {
        id: 'opt2',
        choice: 'Option B: Request a brief meeting with your manager to express your interest in the role, highlight your strong reliability record, and express a proactive commitment to complete any required higher-level tickets.',
        isCorrect: true,
        feedback: 'Positive reinforcement detailing why this is the correct approach: Demonstrating initiative, backing up your internal application with proven reliability, and offering to complete required training makes you a top internal candidate.'
      },
      {
        id: 'opt3',
        choice: 'Option C: Complain to co-workers that management should have automatically given you the role without an application process.',
        isCorrect: false,
        feedback: 'Clear explanation of why this violates standards: Complaining publicly about promotion processes damages your reputation and signals a lack of leadership maturity.'
      }
    ]
  },

  lesson2Title: 'Developing Leadership & Mentorship Qualities',
  lesson2Content: [
    'Advancing into leadership positions requires more than technical competencyâ€”it requires **Emotional Intelligence and Peer Mentorship**. Supervisors look for employees who step up during challenging shifts, maintain high morale, follow safety protocols consistently, and assist newer team members during onboarding.',
    'When requesting a formal promotion or pay review, present a professional business case. Outline your reliable attendance record, your added skills and tickets, any additional responsibilities you have absorbed, and your commitment to company growth. Frame the conversation around mutual value: *"By taking on shift coordination, I can free up management time and keep site productivity high."*'
  ],

  practicalReflection: 'Look at your target industry. What is one specific ticket, licence, or qualification you can complete in the next 12 months that will increase your earning potential?',
  actionStepTitle: '12-Month Upskilling & Career Progression Roadmap',
  actionStepPrompt: 'Open your notes app. Write down: 1) Your current role, 2) Your target role in 2 years, 3) Two specific accredited tickets or courses required to bridge the gap, and 4) One local training provider offering those courses.',

  quiz: [
    {
      id: 'Q1',
      question: 'What is the primary benefit of continuously "upskilling" (acquiring new tickets, licences, and training) in your career?',
      options: [
        'It unlocks higher-paying job roles, increases long-term job security, and expands career progression options',
        'It reduces the number of hours you are required to work each week',
        'It exempts you from having to follow site Work Health & Safety rules'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why option 1 is correct: Continuous upskilling increases your commercial value to employers, making you eligible for higher pay rates and promotional roles.'
    },
    {
      id: 'Q2',
      question: 'How should an employee approach an internal promotion opportunity within their current company?',
      options: [
        'Formally apply, meet with their manager to highlight past reliability, and demonstrate enthusiasm for added responsibilities',
        'Wait silently for management to hand them the role without expressing interest',
        'Threaten to quit unless they are promoted immediately'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining the core principle: Employers value proactive initiative; applying formally and presenting a business case demonstrates leadership readiness.'
    },
    {
      id: 'Q3',
      question: 'What key non-technical quality do managers look for when choosing workers for Team Leader or Supervisor roles?',
      options: [
        'Strong emotional intelligence, peer mentorship, safety compliance, and proactive problem-solving',
        'The ability to work completely isolated without speaking to anyone',
        'A willingness to criticize team members publicly'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why this protocol matters: Leaders must inspire and support teams; emotional intelligence, safety standards, and mentorship are critical for supervisor roles.'
    },
    {
      id: 'Q4',
      question: 'What government training initiatives in Australia can help jobseekers and workers access subsidized skill qualifications?',
      options: [
        'TAFE Fee-Free training programs, User Choice funding, and state vocational subsidy schemes',
        'Personal bank loans with high interest rates',
        'Overseas private lottery schemes'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed explanation referencing relevant standards: Australian state and federal governments offer Fee-Free TAFE and subsidized vocational training to help workers upskill in demand areas.'
    },
    {
      id: 'Q5',
      question: 'What is the most effective way to structure a request for a pay rate review or role advancement during an annual appraisal?',
      options: [
        'Presenting a clear business case highlighting your ticket additions, zero-incident safety record, and expanded responsibilities',
        'Comparing your pay to a co-worker\'s personal bank account',
        'Complaining that life in general has become expensive'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed summary of the correct execution method: Base salary discussions on objective performance data, added qualifications, and tangible value brought to the organization.'
    }
  ]
};