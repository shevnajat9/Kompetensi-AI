
export enum CompetencyDomain {
  TECHNICAL = 'Kemampuan Teknis',
  COMMUNICATION = 'Komunikasi',
  LEADERSHIP = 'Kepemimpinan & Strategi',
  PROBLEM_SOLVING = 'Berpikir Analitis',
  ADAPTABILITY = 'Adaptabilitas & Resiliensi'
}

export interface UserContext {
  name?: string;
  role: string;
  level: string;
  organization: string;
}

export interface Question {
  id: number;
  domain: CompetencyDomain;
  text: string;
}

export interface DetailedEvaluationPoint {
  category: string;
  subType: CompetencyDomain; // Dipetakan ke salah satu dari 5 domain utama
  score: number;
  feedback: string;
}

export interface Recommendation {
  title: string;
  description: string;
  actionItems: string[];
  resources?: { name: string; url?: string }[];
}

export interface AIAnalysis {
  overallSummary: string;
  totalScore: number;
  status: string; // e.g., 'PERLU PENGEMBANGAN'
  detailedPoints: DetailedEvaluationPoint[];
  recommendations: Recommendation[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface AssessmentResult {
  domain: string;
  score: number;
}
