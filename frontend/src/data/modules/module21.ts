import type { ModuleData } from '../modulesData';

export const module21: ModuleData = {
  id: 'M21',
  moduleNumber: 21,
  title: 'Managing Work-Related Expenses & Tax Deductions',
  category: 'Financial Literacy',
  estimatedMins: 20,
  pbasPoints: 5,
  videoScript: "Welcome to Module 21: Managing Work-Related Expenses & Tax Deductions. Starting work often involves upfront expenses for tools, uniforms, and tickets. In this module, we examine how ATO work-related tax deductions operate, tracking receipts, claiming home office expenses, and leveraging support programs.",

  lesson1Title: 'ATO Tax Deduction Rules & Work-Related Expense Basics',
  lesson1Content: [
    'When purchasing items required for your jobâ€”such as compulsory branded uniforms, steel-cap boots, protective safety gear, trade tools, or industry ticket renewalsâ€”you may be eligible to claim them as Work-Related Tax Deductions through the Australian Taxation Office (ATO). Claiming legitimate tax deductions reduces your annual taxable income, potentially increasing your tax refund at the end of the financial year.',
    'To claim a work-related deduction under ATO regulations, you must meet Three Golden Rules: 1) You must have spent the money yourself and not been reimbursed by your employer, 2) The expense must be directly related to earning your income in your current job, and 3) You must have a record to prove it (such as a digital receipt, invoice, or bank statement).'
  ],

  graphicCard1: {
    title: 'Tax Deductions: Pro Move vs. Rookie Mistake',
    bullets: [
      'âŒ ROOKIE MISTAKE: Claiming plain everyday clothing (e.g., standard black jeans, plain shirts) as work uniform deductions.',
      'âœ… PRO MOVE: Claiming occupation-specific clothing (e.g., hi-vis with company logos, chef pants, steel-cap boots, medical scrubs).',
      'âŒ ROOKIE MISTAKE: Losing paper receipts and relying on vague memory when completing your annual tax return.',
      'âœ… PRO MOVE: Using the official ATO app myDeductions to take photos of receipts immediately upon purchase.',
      'MATCHING CHALLENGE: Trades & Civil âž” Deduct trade tools, safety gear, White Card renewals, and vehicle transit between job sites.',
      'MATCHING CHALLENGE: Care & Health âž” Deduct professional registrations, protective aprons/gloves, and First Aid course fees.'
    ]
  },

  branchingScenario: {
    id: 'BS-21',
    situation: 'You start a new role in logistics, trades, care, or retail. You spend $180 buying safety boots and $120 on plain black pants required for the dress code. You want to know what can be legally claimed on your tax return. What is the correct ATO guidance?',
    options: [
      {
        id: 'opt1',
        choice: 'Option A: Claim both the safety boots ($180) and the plain black pants ($120) because both are worn at work.',
        isCorrect: false,
        feedback: 'Clear explanation of why this causes issues: Plain, everyday clothing (even if required by a dress code) cannot be claimed under ATO rules; claiming conventional clothing risks tax audit penalties.'
      },
      {
        id: 'opt2',
        choice: 'Option B: Claim the protective safety boots ($180) with a digital receipt, and exclude the plain black pants from your tax return.',
        isCorrect: true,
        feedback: 'Positive reinforcement detailing why this is the correct approach: Protective safety footwear is a valid work deduction; plain conventional clothing is strictly non-deductible under ATO laws.'
      },
      {
        id: 'opt3',
        choice: 'Option C: Claim $2,000 in random estimated expenses without keeping any receipts or proof of purchase.',
        isCorrect: false,
        feedback: 'Clear explanation of why this violates standards: Claiming unverified expenses without proof breaches tax law, resulting in ATO fines and interest penalties.'
      }
    ]
  },

  lesson2Title: 'Receipt Tracking Systems & Government Transition Support',
  lesson2Content: [
    'Maintaining clean digital expense records eliminates tax-time stress. Use free digital tracking tools like the ATO myDeductions feature inside the myGov app. Whenever you purchase a work-related tool, safety gear, or ticket renewal, snap a clear photo of the tax receipt immediately. The app categorizes the expense and syncs directly into your myTax return at tax time.',
    'Jobseekers transitioning into work can also access upfront government financial support. Programs such as the Workforce Australia Employment Fund (managed by your Employment Services Provider) can assist with upfront costs like work boots, police checks, White Cards, driver licensing fees, or initial transit passes. Always speak to your provider before paying out-of-pocket for mandatory pre-start gear.'
  ],

  practicalReflection: 'Think about expenses you might incur when starting work. How will you store and track your digital receipts to ensure tax compliance?',
  actionStepTitle: 'ATO myDeductions Setup & Expense Tracking Task',
  actionStepPrompt: 'Download the ATO app or open your phone camera. Practice taking a digital scan of a receipt, save it to a dedicated Tax 2026 folder, and list 2 work items valid for your target industry.',

  quiz: [
    {
      id: 'Q1',
      question: 'What are the ATO\'s "Three Golden Rules" for claiming a work-related tax deduction in Australia?',
      options: [
        'You spent the money yourself without reimbursement; it directly relates to earning your income; and you have a record to prove it',
        'You bought the item at a discount; your friend approved it; and you paid in cash',
        'The item was purchased overseas; it cost over $5,000; and you lost the receipt'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why option 1 is correct: Under ATO law, deductions require out-of-pocket expenditure directly linked to income earning with written proof.'
    },
    {
      id: 'Q2',
      question: 'Can plain, conventional everyday clothing (such as standard black pants or plain white shirts) be claimed as a tax deduction if required by an employer?',
      options: [
        'No, plain everyday clothing is non-deductible, even if your employer mandates it as a dress code',
        'Yes, any clothes worn during work hours are 100% tax deductible',
        'Yes, but only if purchased during a retail sale'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining the core principle: The ATO strictly classifies conventional everyday clothing as a private expense; only protective or branded uniform gear is deductible.'
    },
    {
      id: 'Q3',
      question: 'Which tool provided by the ATO allows jobseekers and workers to digitally scan and store receipts for tax time?',
      options: [
        'The myDeductions tool inside the official ATO / myGov mobile application',
        'The Social Media Photo Library',
        'The Local Council Library Portal'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why this protocol matters: The myDeductions tool allows users to photograph receipts and auto-populate their end-of-year tax return securely.'
    },
    {
      id: 'Q4',
      question: 'How can Employment Services Providers assist jobseekers with upfront work-related expenses through the Employment Fund?',
      options: [
        'By funding mandatory pre-start items like steel-cap boots, White Cards, police checks, or initial transit passes',
        'By buying jobseekers personal luxury vehicles',
        'The Employment Fund cannot be used for work equipment under any circumstances'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed explanation referencing relevant standards: Providers utilize the DEWR Employment Fund to remove financial barriers, paying for essential work gear and tickets upfront.'
    },
    {
      id: 'Q5',
      question: 'Can everyday travel from your home to your regular principal workplace be claimed as a work-related car expense?',
      options: [
        'No, standard home-to-work travel is considered a private commute and is non-deductible',
        'Yes, all personal transit between home and work is 100% tax deductible',
        'Yes, but only on rainy days'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed summary of the correct execution method: ATO regulations classify standard commutes as private travel; car expenses are only deductible when transporting heavy tools or travelling between job sites.'
    }
  ]
};