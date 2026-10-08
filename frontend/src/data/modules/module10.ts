import type { ModuleData } from '../modulesData';

export const module10: ModuleData = {
  id: 'M10',
  moduleNumber: 10,
  title: 'Workplace Rights, Modern Awards & Fair Work',
  category: 'Workplace Expectations',
  estimatedMins: 20,
  pbasPoints: 5,
  videoScript: "Welcome to Module 10: Workplace Rights, Modern Awards & Fair Work. Understanding your statutory employment rights is essential for every Australian jobseeker. In this module, we examine the National Employment Standards, Modern Awards, payslip compliance, casual loading, and how the Fair Work Ombudsman protects your entitlements.",

  lesson1Title: 'National Employment Standards (NES) & Modern Award Basics',
  lesson1Content: [
    'In Australia, every employee is covered by a legal safety net designed to protect baseline workplace conditions. At the core of this system are the **11 National Employment Standards (NES)** mandated under the *Fair Work Act 2009*. The NES guarantees minimum entitlements for all national system employees, covering maximum weekly working hours (38 hours plus reasonable additional hours), flexible working arrangement rights, parental leave, public holiday entitlements, and mandatory notice of termination or redundancy pay.',
    'In addition to the NES, most Australian jobs fall under a **Modern Award** or an **Enterprise Agreement (EA)**. Modern Awards are legally binding industry standards (e.g., *Fast Food Industry Award*, *General Retail Industry Award*, *Building and Construction General On-site Award*, or *Aged Care Award*) that set minimum pay rates, penalty rates for weekends or public holidays, overtime thresholds, shift allowances, and rest breaks. Employers cannot contract out of these minimum legal standards.'
  ],

  graphicCard1: {
    title: 'Workplace Rights Standards: Pro Move vs. Rookie Mistake',
    bullets: [
      'âŒ ROOKIE MISTAKE: Accepting "cash-in-hand" pay below award minimum rates without payslips or tax withholding.',
      'âœ… PRO MOVE: Ensuring you receive an itemized electronic payslip within 1 working day of pay day detailing rate, hours, and superannuation.',
      'âŒ ROOKIE MISTAKE: Assuming casual employees receive paid annual leave or paid sick leave.',
      'âœ… PRO MOVE: Understanding that casuals receive a 25% pay loading in place of paid leave entitlements.',
      'MATCHING CHALLENGE: Full-Time / Part-Time âž” Entitled to paid annual leave (4 weeks/yr) and paid personal/carer\'s leave.',
      'MATCHING CHALLENGE: Casual Employment âž” Higher hourly rate (25% casual loading) + 2 days unpaid carer\'s leave per occasion.'
    ]
  },

  branchingScenario: {
    id: 'BS-10',
    situation: 'You start a new role in retail, care, or hospitality. At the end of your first pay period, your supervisor pays you in cash, does not issue a payslip, and states: "We don\'t do formal payslips or superannuation tax reporting here, it\'s easier for both of us." What is the correct professional and compliance response?',
    options: [
      {
        id: 'opt1',
        choice: 'Option A: Accept the cash silently and say nothing, assuming this is normal practice for small businesses in Australia.',
        isCorrect: false,
        feedback: 'Clear explanation of why this causes issues: Cash-in-hand without payslips deprives you of superannuation, tax credits, and legal protection under Fair Work legislation.'
      },
      {
        id: 'opt2',
        choice: 'Option B: Politely explain to your employer that under Australian law, all workers must receive itemized payslips within 1 day of payment and superannuation contributions, and request formal processing.',
        isCorrect: true,
        feedback: 'Positive reinforcement detailing why this is the correct approach: Asserting your legal right to formal payslips ensures tax compliance, guarantees superannuation contributions, and protects your Fair Work rights.'
      },
      {
        id: 'opt3',
        choice: 'Option C: Immediately post about the business on public review sites and threaten the owner on social media.',
        isCorrect: false,
        feedback: 'Clear explanation of why this violates standards: Threatening employers on social media breaches conduct standards; workplace pay issues should be raised directly or via the Fair Work Ombudsman.'
      }
    ]
  },

  lesson2Title: 'Payslip Compliance, Superannuation & Raising Pay Inquiries',
  lesson2Content: [
    'Under the *Fair Work Act*, your employer is legally required to issue an itemized payslip within **1 working day** of paying you. A compliant Australian payslip must detail: employer name and ABN, employee name, pay period dates, gross and net pay amounts, ordinary hourly rates, worked hours, penalty rates or allowances, tax withheld (PAYG), and superannuation contribution details. Your employer must contribute a mandatory statutory percentage (Super Guarantee) into your nominated superannuation fund.',
    'If you notice a discrepancy on your payslipâ€”such as missing penalty rates, incorrect recorded hours, or uncredited superannuationâ€”handle it using a professional, structured approach. Check your shift records against your relevant Modern Award first. Then, send a polite, clear written inquiry to your manager or payroll department stating: *"Hi [Manager Name], I noticed my payslip for period ending [Date] reflects 25 ordinary hours, but my roster record shows 30 hours including Sunday penalty rates. Could you please review this when you have a moment?"*'
  ],

  practicalReflection: 'Review a past payslip or sample Australian payslip. What are three mandatory details that must be clearly listed on every legal payslip under Fair Work standards?',
  actionStepTitle: 'Fair Work Pay Rate & Award Check Task',
  actionStepPrompt: 'Open a web browser or Fair Work PACT tool. Look up the minimum award pay rate for an entry-level position in your target industry (e.g., Retail Level 1, Construction Worker Level 1, or Aged Care Employee Level 2) and record the hourly base rate and casual loading rate.',

  quiz: [
    {
      id: 'Q1',
      question: 'Which statutory body in Australia regulates federal employment laws, enforces minimum awards, and protects worker rights?',
      options: [
        'The Fair Work Ombudsman / Fair Work Commission',
        'The Australian Taxation Office (ATO) Executive Board',
        'SafeWork Australia'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why option 1 is correct: The Fair Work Ombudsman is the national agency responsible for regulating Australian workplace laws, enforcing Modern Awards, and protecting employee rights.'
    },
    {
      id: 'Q2',
      question: 'Within what timeframe must an employer issue an itemized payslip to an employee following payday under the Fair Work Act?',
      options: [
        'Within 1 working day of pay day',
        'Within 30 days after pay day',
        'Payslips are optional and only required if requested in writing'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining the core principle: Australian workplace law mandates that itemized payslips must be issued electronically or on paper within 1 working day of payment.'
    },
    {
      id: 'Q3',
      question: 'What is "casual loading" under Australian Modern Awards?',
      options: [
        'An additional percentage added to a casual employee\'s base hourly rate (usually 25%) in lieu of paid annual and sick leave',
        'A tax fee deducted from casual workers\' wages to pay for uniform laundering',
        'An extra payment given to workers who arrive early to their shifts'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why this protocol matters: Casual loading compensates casual employees for the lack of paid annual leave, paid personal/sick leave, and redundancy entitlements.'
    },
    {
      id: 'Q4',
      question: 'What are the National Employment Standards (NES)?',
      options: [
        '11 minimum employment entitlements guaranteed by law to all national system employees in Australia',
        'Voluntary guidelines that employers can choose to ignore during busy retail periods',
        'A set of rules for operating heavy machinery on civil construction sites'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed explanation referencing relevant standards: The NES forms the legal safety net under the Fair Work Act, providing minimum standards for leave, hours, notice periods, and public holidays.'
    },
    {
      id: 'Q5',
      question: 'What is the most professional initial step to take if you identify a pay discrepancy or missing hours on your payslip?',
      options: [
        'Check your roster records against your award, then send a polite, clear written query to your supervisor or payroll officer',
        'Refuse to attend your next shift without telling anyone',
        'Demand immediate cash from the register during opening hours'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed summary of the correct execution method: Raising payroll queries politely in writing with supporting roster evidence allows management to correct errors quickly while maintaining professional relationships.'
    }
  ]
};