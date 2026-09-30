import type { ModuleData } from '../modulesData';

export const module20: ModuleData = {
  id: 'M20',
  moduleNumber: 20,
  title: 'Personal Budgeting & Financial Literacy for Jobseekers',
  category: 'Financial Literacy',
  estimatedMins: 20,
  pbasPoints: 5,
  videoScript: "Welcome to Module 20: Personal Budgeting & Financial Literacy for Jobseekers. Transitioning from income support into employment brings financial changes. In this module, we examine how to manage income shifts, build a zero-based cash budget, manage debt, and establish a savings buffer.",

  lesson1Title: 'Navigating Income Transitions & The 50/30/20 Budgeting Rule',
  lesson1Content: [
    'Transitioning into paid employment—whether full-time, part-time, or casual—fundamentally changes your cash flow dynamics. When taking on new shifts, jobseekers must understand how net income (take-home pay after PAYG tax withholding) differs from gross earnings. Calculating your net pay accurately ensures you plan your household expenses around money actually deposited into your bank account.',
    'A practical framework for managing wage earnings is the 50/30/20 Budgeting Rule. Allocate 50% of net income to Needs (rent/mortgage, groceries, utilities, transit costs, and basic phone/internet), 30% to Wants (leisure, eating out, personal hobbies), and 20% to Financial Goals (paying off high-interest debt, building an emergency buffer fund, or investing in work tools and tickets).'
  ],

  graphicCard1: {
    title: 'Financial Management: Pro Move vs. Rookie Mistake',
    bullets: [
      '❌ ROOKIE MISTAKE: Spending your entire first paycheck immediately on luxury goods before paying essential bills or transit costs.',
      '✅ PRO MOVE: Automating bill payments and setting aside emergency savings on payday before discretionary spending.',
      '❌ ROOKIE MISTAKE: Relying on high-interest Buy Now Pay Later (BNPL) services or short-term payday loans for daily living expenses.',
      '✅ PRO MOVE: Building a 1-month "Emergency Buffer Fund" in a high-interest savings account to cover unexpected costs.',
      'MATCHING CHALLENGE: Casual Employment ➔ Set aside a buffer from high-earning weeks to cover slow shifts or public holiday closures.',
      'MATCHING CHALLENGE: ATO Compliance ➔ Claim the Tax-Free Threshold on your primary employer TFN Declaration to maximize take-home pay.'
    ]
  },

  branchingScenario: {
    id: 'BS-20',
    situation: 'You start a new role and receive your first full paycheck of $1,100 net. You have upcoming rent ($400), overdue utility bills ($200), and weekly groceries/transit costs ($250). You also want to purchase a new pair of designer sneakers for $250. What is the correct financial decision?',
    options: [
      {
        id: 'opt1',
        choice: 'Option A: Buy the $250 sneakers first, pay half your rent, and leave the utility bill unpaid until next month.',
        isCorrect: false,
        feedback: 'Clear explanation of why this causes issues: Prioritizing discretionary wants over core living needs creates debt traps, overdue late fees, and potential housing instability.'
      },
      {
        id: 'opt2',
        choice: 'Option B: Pay your rent ($400), utilities ($200), and groceries/transit ($250) first, then allocate $100 to savings and $150 to personal savings toward the sneakers.',
        isCorrect: true,
        feedback: 'Positive reinforcement detailing why this is the correct approach: Securing essential needs and savings targets first ensures financial stability while building sustainable habits.'
      },
      {
        id: 'opt3',
        choice: 'Option C: Take out a high-interest payday loan or BNPL contract to buy the sneakers and cover rent.',
        isCorrect: false,
        feedback: 'Clear explanation of why this violates standards: Using high-interest credit for lifestyle purchases creates compounding debt cycles that erode income.'
      }
    ]
  },

  lesson2Title: 'Managing Debt, Tax-Free Thresholds & Superannuation Growth',
  lesson2Content: [
    'When completing tax paperwork for a new job, selecting the Tax-Free Threshold on your TFN Declaration allows you to earn the first $18,200 of annual income tax-free from your primary employer. If you hold two jobs simultaneously, claim the tax-free threshold on the higher-paying job only to avoid an unexpected tax bill at the end of the financial year.',
    'Superannuation is your long-term wealth engine. Under Australian law, employers contribute a statutory percentage (Super Guarantee) into your nominated super fund. Consolidating multiple old super accounts into a single high-performing, low-fee fund eliminates duplicate insurance fees and maximizes compound returns over your career.'
  ],

  practicalReflection: 'Look at your current monthly expenses. What is one non-essential expense you can reduce this week to build a $500 emergency savings buffer?',
  actionStepTitle: 'Personal Budget Setup & Super Consolidation Task',
  actionStepPrompt: 'Open a spreadsheet or paper budget. 1) List your fixed weekly living costs (Needs), 2) Calculate your target 20% savings buffer, and 3) Log into myGov to check for multiple active superannuation accounts.',

  quiz: [
    {
      id: 'Q1',
      question: 'Under the 50/30/20 budgeting framework, what percentage of your net income should be allocated to core living "Needs"?',
      options: [
        '50% of net income (covering housing, groceries, utilities, and transit)',
        '100% of net income',
        'Needs should only take up 10% of your earnings'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why option 1 is correct: Allocating 50% to needs guarantees that essential living costs are covered before discretionary spending or debt payoffs.'
    },
    {
      id: 'Q2',
      question: 'What is the "Tax-Free Threshold" in Australia, and how should it be claimed on a TFN Declaration?',
      options: [
        'The first $18,200 of annual income is tax-free; claim it on your primary main job only',
        'A tax fee charged to casual workers every pay period',
        'It should be claimed on 5 different jobs simultaneously to avoid paying any tax'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining the core principle: Claiming the $18,200 tax-free threshold on your primary job reduces PAYG tax withholding, maximizing take-home pay.'
    },
    {
      id: 'Q3',
      question: 'Why is consolidating multiple old superannuation accounts into a single chosen fund beneficial?',
      options: [
        'It eliminates multiple administration fees, prevents account erosion, and maximizes long-term compound investment growth',
        'It automatically doubles your current bank account balance',
        'Super consolidation is mandatory every 30 days under Fair Work law'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why this protocol matters: Merging multiple super accounts stops duplicate account fees, keeping more money invested for your retirement.'
    },
    {
      id: 'Q4',
      question: 'What is the primary risk of relying on high-interest Buy Now Pay Later (BNPL) services or short-term payday loans?',
      options: [
        'Compounding interest rates, late fees, and debt accumulation that erode your regular employment wages',
        'They automatically cause your bank account to freeze permanently',
        'There is no risk; BNPL is free money guaranteed by the government'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed explanation referencing relevant standards: High-interest consumer credit creates debt traps that lock workers into financial stress during shift fluctuations.'
    },
    {
      id: 'Q5',
      question: 'Why should casual employees build an "Emergency Savings Buffer" equal to 1 month of living expenses?',
      options: [
        'To protect against income fluctuations during quiet business periods, public holiday closures, or personal illness',
        'Because casual workers are legally required to keep $10,000 in cash at home',
        'To pay for mandatory supervisor gifts every month'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed summary of the correct execution method: An emergency savings buffer provides financial security for casual workers during seasonal shift downturns.'
    }
  ]
};