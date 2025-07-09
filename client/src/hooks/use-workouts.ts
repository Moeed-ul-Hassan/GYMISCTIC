import { useState, useEffect } from 'react';
import { workoutService } from '@/lib/workout-service';
import { WorkoutSession, Exercise } from '@shared/schema';

export function useWorkouts() {
  const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    loadWorkoutData();
  }, []);

  const loadWorkoutData = async () => {
    setIsLoading(true);
    try {
      const history = await workoutService.getWorkoutHistory();
      const exerciseList = workoutService.getExercises();
      
      setWorkoutHistory(history);
      setExercises(exerciseList);
      setCurrentSession(workoutService.getCurrentSession());
    } catch (error) {
      console.error('Failed to load workout data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startWorkout = async (workoutType: string): Promise<WorkoutSession> => {
    try {
      const session = await workoutService.startWorkoutSession(workoutType);
      setCurrentSession(session);
      return session;
    } catch (error) {
      console.error('Failed to start workout:', error);
      throw error;
    }
  };

  const completeSet = async (setId: string, reps: number, weight?: number): Promise<void> => {
    try {
      await workoutService.completeSet(setId, reps, weight);
      // Refresh current session
      setCurrentSession(workoutService.getCurrentSession());
    } catch (error) {
      console.error('Failed to complete set:', error);
      throw error;
    }
  };

  const finishWorkout = async (): Promise<WorkoutSession> => {
    try {
      const completedSession = await workoutService.finishWorkoutSession();
      setCurrentSession(null);
      await loadWorkoutData(); // Refresh history
      return completedSession;
    } catch (error) {
      console.error('Failed to finish workout:', error);
      throw error;
    }
  };

  const getExerciseById = (id: string): Exercise | undefined => {
    return workoutService.getExerciseById(id);
  };

  const getCurrentExercise = (): { exercise: Exercise; setNumber: number; totalSets: number } | null => {
    if (!currentSession) return null;

    const incompleteSets = currentSession.sets.filter(set => !set.completed);
    if (incompleteSets.length === 0) return null;

    const currentSet = incompleteSets[0];
    const exercise = getExerciseById(currentSet.exerciseId);
    
    if (!exercise) return null;

    const exerciseSets = currentSession.sets.filter(set => set.exerciseId === exercise.id);
    const completedExerciseSets = exerciseSets.filter(set => set.completed);
    
    return {
      exercise,
      setNumber: completedExerciseSets.length + 1,
      totalSets: exerciseSets.length
    };
  };

  const getWorkoutStats = () => {
    if (!currentSession) return null;
    return workoutService.calculateWorkoutStats(currentSession);
  };

  const getWeeklyStats = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weeklyWorkouts = workoutHistory.filter(session => 
      new Date(session.date) >= weekAgo && session.completed
    );

    const totalWorkouts = weeklyWorkouts.length;
    const totalSets = weeklyWorkouts.reduce((sum, session) => 
      sum + session.sets.filter(set => set.completed).length, 0
    );
    const totalReps = weeklyWorkouts.reduce((sum, session) => 
      sum + session.sets.reduce((setSum, set) => setSum + (set.completed ? set.reps : 0), 0), 0
    );

    return {
      totalWorkouts,
      totalSets,
      totalReps,
      averageWorkoutsPerWeek: totalWorkouts,
      workoutTypes: [...new Set(weeklyWorkouts.map(w => w.type))]
    };
  };

  const getTodaysWorkout = (planId: string) => {
    return workoutService.getTodaysWorkout(planId);
  };

  const getWorkoutPlans = () => {
    return workoutService.getWorkoutPlans();
  };

  const getRecommendations = async () => {
    return await workoutService.getWorkoutRecommendations();
  };

  return {
    // State
    currentSession,
    workoutHistory,
    exercises,
    isLoading,
    
    // Actions
    startWorkout,
    completeSet,
    finishWorkout,
    
    // Getters
    getExerciseById,
    getCurrentExercise,
    getWorkoutStats,
    getWeeklyStats,
    getTodaysWorkout,
    getWorkoutPlans,
    getRecommendations,
    
    // Utils
    loadWorkoutData
  };
}
