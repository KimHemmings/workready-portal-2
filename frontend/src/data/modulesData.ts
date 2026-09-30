export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface ScenarioOption {
  id: string;
  choice: string;
  isCorrect: boolean;
  feedback: string;
}

export interface BranchingScenario {
  id: string;
  situation: string;
  options: ScenarioOption[];
}

export interface GraphicCard {
  title: string;
  bullets: string[];
}

export interface ModuleData {
  id: string;
  moduleNumber: number;
  title: string;
  category: string;
  estimatedMins: number;
  pbasPoints: number;
  videoScript: string;
  lesson1Title: string;
  lesson1Content: string[];
  graphicCard1?: GraphicCard;
  branchingScenario?: BranchingScenario;
  lesson2Title: string;
  lesson2Content: string[];
  practicalReflection: string;
  actionStepTitle: string;
  actionStepPrompt: string;
  quiz: QuizQuestion[];
}

import { module1 } from './modules/module1';
import { module2 } from './modules/module2';

export const modulesData: ModuleData[] = [
  module1,
  module2
];