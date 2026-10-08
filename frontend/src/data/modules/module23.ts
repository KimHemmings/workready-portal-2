import type { ModuleData } from '../modulesData';

export const module23: ModuleData = {
  id: 'M23',
  moduleNumber: 23,
  title: 'Cultural Safety, Diversity & Inclusion',
  category: 'Workplace Expectations',
  estimatedMins: 20,
  pbasPoints: 5,
  videoScript: "Welcome to Module 23: Cultural Safety, Diversity & Inclusion. Australian workplaces are among the most culturally diverse in the world. In this module, we examine cultural safety, Indigenous reconciliation, anti-discrimination laws under the Human Rights Commission, and building inclusive teams.",

  lesson1Title: 'Cultural Safety, Indigenous Respect & Australian Diversity',
  lesson1Content: [
    'Australiaâ€™s workforce brings together people from hundreds of diverse cultural, linguistic, religious, and social backgroundsâ€”including First Nations (Aboriginal and Torres Strait Islander) peoples, migrant communities, and individuals of all gender identities and abilities. Cultural Safety means creating a workplace environment where everyone feels respected, valued, and safe to express their identity without fear of judgment, bias, or discrimination.',
    'Demonstrating cultural respect involves acknowledging Aboriginal and Torres Strait Islander traditional ownership of land (through Welcome to Country or Acknowledgement of Country protocols), using respectful language, and valuing diverse perspectives. In sectors like healthcare, community services, education, and civil construction, cultural competence is vital for providing quality services and building strong team harmony.'
  ],

  graphicCard1: {
    title: 'Workplace Inclusion: Pro Move vs. Rookie Mistake',
    bullets: [
      'âŒ ROOKIE MISTAKE: Making stereotypical assumptions, insensitive jokes, or using derogatory language about co-workers or clients.',
      'âœ… PRO MOVE: Using respectful, inclusive language, listening actively, and treating all colleagues with dignity.',
      'âŒ ROOKIE MISTAKE: Excluding team members from discussions or social interactions based on background, age, or background.',
      'âœ… PRO MOVE: Actively inviting input from diverse team members and celebrating inclusive workplace achievements.',
      'LEGAL FRAMEWORK: Sex Discrimination Act, Racial Discrimination Act, Disability Discrimination Act, Age Discrimination Act.',
      'COMPLIANCE STANDARD: Zero tolerance for harassment, vilification, or discriminatory exclusion across all industries.'
    ]
  },

  branchingScenario: {
    id: 'BS-23',
    situation: 'During a shift break in the tearoom, a team member makes an offensive joke targeting a co-worker\'s cultural background or religion. The co-worker looks visibly uncomfortable. What is the correct professional action?',
    options: [
      {
        id: 'opt1',
        choice: 'Option A: Laugh along with the joke to avoid making things awkward in the tearoom.',
        isCorrect: false,
        feedback: 'Clear explanation of why this causes issues: Laughing at discriminatory jokes condones harassment and breaches workplace anti-discrimination policies.'
      },
      {
        id: 'opt2',
        choice: 'Option B: Refuse to join in, state calmly that the comment is inappropriate, check in on your co-worker, and report discriminatory behavior if it continues.',
        isCorrect: true,
        feedback: 'Positive reinforcement detailing why this is the correct approach: Standing up against discriminatory comments enforces cultural safety, protects team members, and upholds Australian anti-harassment laws.'
      },
      {
        id: 'opt3',
        choice: 'Option C: Record a video of the incident and post it on social media naming the business.',
        isCorrect: false,
        feedback: 'Clear explanation of why this violates standards: Posting workplace conflicts online breaches privacy and social media policies; issues must be reported through proper internal management channels.'
      }
    ]
  },

  lesson2Title: 'Anti-Discrimination Laws & Eliminating Unconscious Bias',
  lesson2Content: [
    'Under Commonwealth legislation enforced by the Australian Human Rights Commission (including the Racial Discrimination Act, Sex Discrimination Act, Disability Discrimination Act, and Age Discrimination Act), discrimination based on race, gender, age, disability, sexual orientation, or religion is illegal in employment.',
    'Unconscious bias occurs when automatic social stereotypes influence our judgments about others without realization. Counteract bias by focusing on objective capability, listening to different perspectives, and ensuring fair treatment in all daily team interactions.'
  ],

  practicalReflection: 'How can you actively contribute to a culturally safe and inclusive environment in your next job role?',
  actionStepTitle: 'Diversity & Inclusion Policy Review Task',
  actionStepPrompt: 'Research the Australian Human Rights Commission guidelines on workplace diversity. Write down 3 key principles of inclusive language to use in professional team communications.',

  quiz: [
    {
      id: 'Q1',
      question: 'What does "Cultural Safety" mean in an Australian workplace context?',
      options: [
        'An environment where individuals feel respected, valued, and safe to express their identity without facing discrimination or bias',
        'A rule requiring all workers to wear traditional formal attire',
        'A safety policy that only applies to international shipping ports'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why option 1 is correct: Cultural safety ensures that workers and clients of all cultural backgrounds are treated with respect, dignity, and equity.'
    },
    {
      id: 'Q2',
      question: 'Which statutory body oversees federal anti-discrimination legislation in Australia?',
      options: [
        'The Australian Human Rights Commission',
        'The Reserve Bank of Australia',
        'SafeWork Australia Executive Committee'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining the core principle: The Australian Human Rights Commission investigates complaints and enforces federal anti-discrimination standards.'
    },
    {
      id: 'Q3',
      question: 'Under Australian federal law, on which of the following grounds is workplace discrimination strictly illegal?',
      options: [
        'Race, gender, age, disability, religion, and sexual orientation',
        'Only on the basis of height and eye color',
        'Discrimination is legal in all private companies'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed feedback explaining why this protocol matters: Federal legislation prohibits employment discrimination across protected attributes including race, gender, disability, age, and religion.'
    },
    {
      id: 'Q4',
      question: 'How should an employee respond if they witness inappropriate or discriminatory comments made toward a colleague?',
      options: [
        'Refuse to participate, support the colleague, and report repeated inappropriate behavior through internal management channels',
        'Join in the comments to fit in with the group',
        'Ignore it completely and pretend nothing happened'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed explanation referencing relevant standards: Upholding cultural safety requires rejecting harassment and reporting breaches to supervisors or HR.'
    },
    {
      id: 'Q5',
      question: 'What is an "Acknowledgement of Country" in Australian professional settings?',
      options: [
        'A respectful statement recognizing Aboriginal and Torres Strait Islander peoples as First Nations Traditional Custodians of the land',
        'A mandatory tax declaration form signed every month',
        'A formal contract used when importing international goods'
      ],
      correctAnswerIndex: 0,
      explanation: 'Detailed summary of the correct execution method: An Acknowledgement of Country demonstrates respect for First Nations heritage and traditional ownership of Australian lands.'
    }
  ]
};