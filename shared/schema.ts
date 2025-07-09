import { z } from "zod";

// Basic user types for storage compatibility
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
});

export const insertUserSchema = userSchema.omit({ id: true });

// Workout related schemas
export const exerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['chest', 'back', 'shoulders', 'arms', 'legs', 'core']),
  muscleGroups: z.array(z.string()),
  equipment: z.array(z.string()),
  instructions: z.array(z.string()),
});

export const workoutSetSchema = z.object({
  id: z.string(),
  exerciseId: z.string(),
  reps: z.number(),
  weight: z.number().optional(),
  duration: z.number().optional(), // in seconds
  completed: z.boolean().default(false),
  restTime: z.number().default(60), // in seconds
});

export const workoutSessionSchema = z.object({
  id: z.string(),
  date: z.string(),
  type: z.enum(['push', 'pull', 'legs', 'full_body', 'upper', 'lower']),
  sets: z.array(workoutSetSchema),
  startTime: z.string(),
  endTime: z.string().optional(),
  completed: z.boolean().default(false),
  notes: z.string().optional(),
});

export const workoutPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['push_pull_legs', 'bro_split', 'full_body', 'upper_lower']),
  daysPerWeek: z.number().min(1).max(7),
  schedule: z.array(z.object({
    day: z.number(),
    workoutType: z.string(),
    exercises: z.array(z.string()),
  })),
});

// Nutrition related schemas
export const mealSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  ingredients: z.array(z.string()),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
  cost: z.number(), // in PKR
  preparationTime: z.number(), // in minutes
});

export const mealPlanSchema = z.object({
  id: z.string(),
  date: z.string(),
  meals: z.array(z.object({
    mealId: z.string(),
    type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
    consumed: z.boolean().default(false),
  })),
  dailyBudget: z.number(),
  totalCalories: z.number(),
  totalCost: z.number(),
});

// Progress tracking schemas
export const bodyStatsSchema = z.object({
  id: z.string(),
  date: z.string(),
  weight: z.number(),
  height: z.number().optional(),
  chest: z.number().optional(),
  waist: z.number().optional(),
  arms: z.number().optional(),
  thighs: z.number().optional(),
  bodyFat: z.number().optional(),
  notes: z.string().optional(),
});

export const calorieTrackingSchema = z.object({
  id: z.string(),
  date: z.string(),
  targetCalories: z.number(),
  consumedCalories: z.number(),
  burnedCalories: z.number(),
  bmr: z.number(),
  tdee: z.number(),
});

// Mental fitness schemas
export const moodLogSchema = z.object({
  id: z.string(),
  date: z.string(),
  mood: z.enum(['happy', 'good', 'neutral', 'stressed', 'sad', 'angry']),
  moodScore: z.number().min(1).max(5),
  notes: z.string().optional(),
  dhikrCompleted: z.boolean().default(false),
  breathingExercise: z.boolean().default(false),
});

export const islamicQuoteSchema = z.object({
  id: z.string(),
  text: z.string(),
  translation: z.string(),
  category: z.enum(['nafs', 'sabr', 'rizq', 'effort', 'shukar', 'strength']),
  source: z.string().optional(),
});

// Settings and preferences schemas
export const userPreferencesSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  age: z.number().optional(),
  gender: z.enum(['male', 'female']).optional(),
  height: z.number().optional(),
  activityLevel: z.enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active']),
  goal: z.enum(['lose_weight', 'maintain', 'gain_weight', 'build_muscle']),
  monthlyBudget: z.number(),
  dhikrReminders: z.boolean().default(false),
  voiceMotivation: z.boolean().default(true),
  workoutReminders: z.boolean().default(true),
  preferredWorkoutTime: z.string().optional(),
  preferredWorkoutDays: z.array(z.number()),
});

// Export types
export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Exercise = z.infer<typeof exerciseSchema>;
export type WorkoutSet = z.infer<typeof workoutSetSchema>;
export type WorkoutSession = z.infer<typeof workoutSessionSchema>;
export type WorkoutPlan = z.infer<typeof workoutPlanSchema>;
export type Meal = z.infer<typeof mealSchema>;
export type MealPlan = z.infer<typeof mealPlanSchema>;
export type BodyStats = z.infer<typeof bodyStatsSchema>;
export type CalorieTracking = z.infer<typeof calorieTrackingSchema>;
export type MoodLog = z.infer<typeof moodLogSchema>;
export type IslamicQuote = z.infer<typeof islamicQuoteSchema>;
export type UserPreferences = z.infer<typeof userPreferencesSchema>;
