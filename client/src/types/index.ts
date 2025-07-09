export interface AppState {
  currentPage: string;
  isLoading: boolean;
  userPreferences: UserPreferences | null;
}

export interface DashboardStats {
  dailyProgress: string;
  todayCalories: number;
  weeklyWorkouts: string;
  currentMood: string;
}

export interface WorkoutProgress {
  currentExercise: Exercise | null;
  currentSet: number;
  totalSets: number;
  completedReps: number;
  targetReps: number;
  restTime: string;
}

// Re-export from shared schema
export type {
  Exercise,
  WorkoutSet,
  WorkoutSession,
  WorkoutPlan,
  Meal,
  MealPlan,
  BodyStats,
  CalorieTracking,
  MoodLog,
  IslamicQuote,
  UserPreferences,
} from '@shared/schema';
