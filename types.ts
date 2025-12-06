
export interface QuestionOptions {
  A: string;
  B: string;
  C: string;
  D: string;
}

export interface ExamQuestion {
  id: number | string;
  question: string;
  options: QuestionOptions;
  correctAnswer: 'A' | 'B' | 'C' | 'D' | null;
  userSelection?: 'A' | 'B' | 'C' | 'D' | null; // Track what the user picked
}

export interface ProcessingStatus {
  step: 'setup' | 'converting' | 'analyzing' | 'review' | 'exam_active' | 'results' | 'error';
  message?: string;
  progress?: number;
}

export interface ExamConfig {
  durationMinutes: number;
  examTitle: string;
}
