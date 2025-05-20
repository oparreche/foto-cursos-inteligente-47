
import { Database } from "@/integrations/supabase/types";

// Tipos exportados do banco de dados
export type PhotographyQuestion = Database['public']['Tables']['photography_questions']['Row'];
export type PhotographyAnswer = Database['public']['Tables']['photography_answers']['Row'];
export type QuizScore = Database['public']['Tables']['quiz_scores']['Row'];

// Tipos para formulários e componentes
export type QuestionWithAnswers = PhotographyQuestion & {
  answers: PhotographyAnswer[];
};

export type QuizState = {
  currentQuestionIndex: number;
  questions: QuestionWithAnswers[];
  selectedAnswers: Record<string, string>;
  score: number;
  isFinished: boolean;
  loading: boolean;
};

export type QuizResult = {
  score: number;
  totalQuestions: number;
  percentage: number;
  date: Date;
};

export type QuizDifficulty = 'easy' | 'medium' | 'hard' | 'all';
export type QuizCategory = string | 'all';
