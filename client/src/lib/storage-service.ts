import { indexedDB } from './indexeddb';
import { WorkoutSession, BodyStats, MealPlan, MoodLog, UserPreferences, CalorieTracking } from '@shared/schema';

export class StorageService {
  // Workout Sessions
  async saveWorkoutSession(session: WorkoutSession): Promise<void> {
    await indexedDB.set('workoutSessions', session);
  }

  async getWorkoutSessions(): Promise<WorkoutSession[]> {
    return await indexedDB.getAll<WorkoutSession>('workoutSessions');
  }

  async getWorkoutSession(id: string): Promise<WorkoutSession | undefined> {
    return await indexedDB.get<WorkoutSession>('workoutSessions', id);
  }

  async deleteWorkoutSession(id: string): Promise<void> {
    await indexedDB.delete('workoutSessions', id);
  }

  // Body Stats
  async saveBodyStats(stats: BodyStats): Promise<void> {
    await indexedDB.set('bodyStats', stats);
  }

  async getBodyStats(): Promise<BodyStats[]> {
    return await indexedDB.getAll<BodyStats>('bodyStats');
  }

  async getLatestBodyStats(): Promise<BodyStats | undefined> {
    const allStats = await this.getBodyStats();
    return allStats.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }

  // Meal Plans
  async saveMealPlan(mealPlan: MealPlan): Promise<void> {
    await indexedDB.set('mealPlans', mealPlan);
  }

  async getMealPlans(): Promise<MealPlan[]> {
    return await indexedDB.getAll<MealPlan>('mealPlans');
  }

  async getTodayMealPlan(): Promise<MealPlan | undefined> {
    const today = new Date().toISOString().split('T')[0];
    const allPlans = await this.getMealPlans();
    return allPlans.find(plan => plan.date === today);
  }

  // Mood Logs
  async saveMoodLog(moodLog: MoodLog): Promise<void> {
    await indexedDB.set('moodLogs', moodLog);
  }

  async getMoodLogs(): Promise<MoodLog[]> {
    return await indexedDB.getAll<MoodLog>('moodLogs');
  }

  async getTodayMoodLog(): Promise<MoodLog | undefined> {
    const today = new Date().toISOString().split('T')[0];
    const allLogs = await this.getMoodLogs();
    return allLogs.find(log => log.date === today);
  }

  // User Preferences
  async saveUserPreferences(preferences: UserPreferences): Promise<void> {
    await indexedDB.set('userPreferences', preferences);
  }

  async getUserPreferences(): Promise<UserPreferences | undefined> {
    const allPrefs = await indexedDB.getAll<UserPreferences>('userPreferences');
    return allPrefs[0]; // Assuming single user
  }

  // Calorie Tracking
  async saveCalorieTracking(tracking: CalorieTracking): Promise<void> {
    await indexedDB.set('calorieTracking', tracking);
  }

  async getCalorieTracking(): Promise<CalorieTracking[]> {
    return await indexedDB.getAll<CalorieTracking>('calorieTracking');
  }

  async getTodayCalorieTracking(): Promise<CalorieTracking | undefined> {
    const today = new Date().toISOString().split('T')[0];
    const allTracking = await this.getCalorieTracking();
    return allTracking.find(tracking => tracking.date === today);
  }

  // Data Export/Import
  async exportAllData(): Promise<string> {
    const data = await indexedDB.exportData();
    return JSON.stringify(data, null, 2);
  }

  async importAllData(jsonData: string): Promise<void> {
    const data = JSON.parse(jsonData);
    await indexedDB.importData(data);
  }

  // Calculate BMR using Mifflin-St Jeor Equation
  calculateBMR(weight: number, height: number, age: number, gender: 'male' | 'female'): number {
    const baseMetabolism = 10 * weight + 6.25 * height - 5 * age;
    return gender === 'male' ? baseMetabolism + 5 : baseMetabolism - 161;
  }

  // Calculate TDEE based on activity level
  calculateTDEE(bmr: number, activityLevel: string): number {
    const multipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extra_active: 1.9
    };
    return bmr * (multipliers[activityLevel as keyof typeof multipliers] || 1.2);
  }

  // Calculate BMI
  calculateBMI(weight: number, height: number): number {
    return weight / Math.pow(height / 100, 2);
  }
}

export const storageService = new StorageService();
