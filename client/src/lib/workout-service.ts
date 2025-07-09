import { storageService } from './storage-service';
import { WorkoutSession, WorkoutSet, Exercise } from '@shared/schema';
import workoutPlansData from '@/data/workout-plans.json';

export class WorkoutService {
  private currentSession: WorkoutSession | null = null;

  // Get available workout plans
  getWorkoutPlans() {
    return workoutPlansData.plans;
  }

  // Get exercises library
  getExercises(): Exercise[] {
    return workoutPlansData.exercises as Exercise[];
  }

  // Get exercise by ID
  getExerciseById(id: string): Exercise | undefined {
    return this.getExercises().find(exercise => exercise.id === id);
  }

  // Start a new workout session
  async startWorkoutSession(workoutType: string): Promise<WorkoutSession> {
    const sessionId = `workout-${Date.now()}`;
    const now = new Date().toISOString();
    
    // Get exercises for this workout type
    const exercises = this.getExercisesForWorkoutType(workoutType);
    const sets = this.generateSetsForExercises(exercises);

    this.currentSession = {
      id: sessionId,
      date: now.split('T')[0],
      type: workoutType as any,
      sets,
      startTime: now,
      completed: false
    };

    await storageService.saveWorkoutSession(this.currentSession);
    return this.currentSession;
  }

  // Complete a set
  async completeSet(setId: string, actualReps: number, weight?: number): Promise<void> {
    if (!this.currentSession) throw new Error('No active workout session');

    const setIndex = this.currentSession.sets.findIndex(set => set.id === setId);
    if (setIndex === -1) throw new Error('Set not found');

    this.currentSession.sets[setIndex] = {
      ...this.currentSession.sets[setIndex],
      reps: actualReps,
      weight,
      completed: true
    };

    await storageService.saveWorkoutSession(this.currentSession);
  }

  // Finish workout session
  async finishWorkoutSession(): Promise<WorkoutSession> {
    if (!this.currentSession) throw new Error('No active workout session');

    this.currentSession.endTime = new Date().toISOString();
    this.currentSession.completed = true;

    await storageService.saveWorkoutSession(this.currentSession);
    
    const session = this.currentSession;
    this.currentSession = null;
    return session;
  }

  // Get current active session
  getCurrentSession(): WorkoutSession | null {
    return this.currentSession;
  }

  // Get workout history
  async getWorkoutHistory(): Promise<WorkoutSession[]> {
    return await storageService.getWorkoutSessions();
  }

  // Get today's workout based on plan
  getTodaysWorkout(planId: string): any {
    const plan = workoutPlansData.plans.find(p => p.id === planId);
    if (!plan) return null;

    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const adjustedDay = today === 0 ? 7 : today; // Convert Sunday to 7
    
    return plan.schedule.find(s => s.day === adjustedDay);
  }

  // Get exercises for a specific workout type
  private getExercisesForWorkoutType(workoutType: string): Exercise[] {
    const exercises = this.getExercises();
    
    switch (workoutType) {
      case 'push':
        return exercises.filter(e => 
          e.muscleGroups.some(mg => ['chest', 'shoulders', 'triceps'].includes(mg))
        );
      case 'pull':
        return exercises.filter(e => 
          e.muscleGroups.some(mg => ['back', 'lats', 'rhomboids', 'biceps'].includes(mg))
        );
      case 'legs':
        return exercises.filter(e => 
          e.muscleGroups.some(mg => ['quadriceps', 'hamstrings', 'glutes', 'calves'].includes(mg))
        );
      case 'full_body':
        return exercises.slice(0, 5); // Return a mix of exercises
      default:
        return exercises.slice(0, 4);
    }
  }

  // Generate sets for exercises
  private generateSetsForExercises(exercises: Exercise[]): WorkoutSet[] {
    const sets: WorkoutSet[] = [];
    
    exercises.forEach((exercise, exerciseIndex) => {
      const setsCount = exercise.category === 'core' ? 3 : 4;
      const baseReps = exercise.category === 'core' ? 20 : 12;
      
      for (let setNum = 1; setNum <= setsCount; setNum++) {
        sets.push({
          id: `${exercise.id}-set-${setNum}`,
          exerciseId: exercise.id,
          reps: baseReps,
          completed: false,
          restTime: setNum === setsCount ? 120 : 60 // Longer rest after last set
        });
      }
    });

    return sets;
  }

  // Calculate workout statistics
  calculateWorkoutStats(session: WorkoutSession) {
    const totalSets = session.sets.length;
    const completedSets = session.sets.filter(set => set.completed).length;
    const totalReps = session.sets.reduce((sum, set) => sum + set.reps, 0);
    
    const duration = session.endTime 
      ? Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60))
      : 0;

    return {
      totalSets,
      completedSets,
      completionRate: (completedSets / totalSets) * 100,
      totalReps,
      duration
    };
  }

  // Get workout recommendations based on history
  async getWorkoutRecommendations(): Promise<string[]> {
    const history = await this.getWorkoutHistory();
    const recentWorkouts = history
      .filter(session => {
        const sessionDate = new Date(session.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return sessionDate >= weekAgo;
      })
      .map(session => session.type);

    const recommendations: string[] = [];
    
    if (!recentWorkouts.includes('legs')) {
      recommendations.push('Time for leg day! Your lower body needs attention.');
    }
    
    if (recentWorkouts.filter(type => type === 'push').length > 2) {
      recommendations.push('Consider adding more pull exercises to balance your training.');
    }
    
    if (history.length === 0) {
      recommendations.push('Start with a full body workout to assess your current fitness level.');
    }

    return recommendations;
  }
}

export const workoutService = new WorkoutService();
