import { useState, useEffect } from 'react';
import { storageService } from '@/lib/storage-service';
import { UserPreferences, BodyStats, CalorieTracking, MoodLog } from '@shared/schema';

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const prefs = await storageService.getUserPreferences();
      setPreferences(prefs || null);
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async (newPreferences: UserPreferences) => {
    try {
      await storageService.saveUserPreferences(newPreferences);
      setPreferences(newPreferences);
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  };

  return { preferences, savePreferences, isLoading };
}

export function useBodyStats() {
  const [stats, setStats] = useState<BodyStats[]>([]);
  const [latestStats, setLatestStats] = useState<BodyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const allStats = await storageService.getBodyStats();
      const latest = await storageService.getLatestBodyStats();
      setStats(allStats);
      setLatestStats(latest || null);
    } catch (error) {
      console.error('Failed to load body stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveStats = async (newStats: BodyStats) => {
    try {
      await storageService.saveBodyStats(newStats);
      await loadStats();
    } catch (error) {
      console.error('Failed to save body stats:', error);
    }
  };

  return { stats, latestStats, saveStats, isLoading };
}

export function useCalorieTracking() {
  const [todayTracking, setTodayTracking] = useState<CalorieTracking | null>(null);
  const [allTracking, setAllTracking] = useState<CalorieTracking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTracking();
  }, []);

  const loadTracking = async () => {
    try {
      const today = await storageService.getTodayCalorieTracking();
      const all = await storageService.getCalorieTracking();
      setTodayTracking(today || null);
      setAllTracking(all);
    } catch (error) {
      console.error('Failed to load calorie tracking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTracking = async (tracking: CalorieTracking) => {
    try {
      await storageService.saveCalorieTracking(tracking);
      await loadTracking();
    } catch (error) {
      console.error('Failed to save calorie tracking:', error);
    }
  };

  return { todayTracking, allTracking, saveTracking, isLoading };
}

export function useMoodTracking() {
  const [todayMood, setTodayMood] = useState<MoodLog | null>(null);
  const [allMoods, setAllMoods] = useState<MoodLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMoods();
  }, []);

  const loadMoods = async () => {
    try {
      const today = await storageService.getTodayMoodLog();
      const all = await storageService.getMoodLogs();
      setTodayMood(today || null);
      setAllMoods(all);
    } catch (error) {
      console.error('Failed to load mood logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveMood = async (mood: MoodLog) => {
    try {
      await storageService.saveMoodLog(mood);
      await loadMoods();
    } catch (error) {
      console.error('Failed to save mood log:', error);
    }
  };

  return { todayMood, allMoods, saveMood, isLoading };
}
