export type CourseStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface Course {
  id: string;
  name: string;
  platform: string;
  progressPercent: number;
  status: CourseStatus;
  updatedAt: string;
}

export type DsaDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface DsaProblem {
  id: string;
  name: string;
  platform: string;
  difficulty: DsaDifficulty;
  dateSolved: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  dateCreated: string;
  dateUpdated: string;
}

export interface CoachPlan {
  goals: string;
  studyPlan: string;
  motivationalQuote: string;
  createdAt: string;
}

export interface UserStats {
  enrollments: number;
  completed: number;
  dsaSolved: number;
  studyStreak: number;
  lastStudyDate: string; // YYYY-MM-DD format for checking streak continuity
}
