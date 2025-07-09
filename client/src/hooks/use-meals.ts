import { useState, useEffect } from 'react';
import { mealService } from '@/lib/meal-service';
import { Meal, MealPlan } from '@shared/schema';
import { storageService } from '@/lib/storage-service';

export function useMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [todayMealPlan, setTodayMealPlan] = useState<MealPlan | null>(null);
  const [weeklyMealPlans, setWeeklyMealPlans] = useState<MealPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadMealData();
  }, []);

  const loadMealData = async () => {
    setIsLoading(true);
    try {
      const allMeals = mealService.getMeals();
      const todayPlan = await storageService.getTodayMealPlan();
      const allPlans = await storageService.getMealPlans();
      
      setMeals(allMeals);
      setTodayMealPlan(todayPlan || null);
      setWeeklyMealPlans(allPlans);
    } catch (error) {
      console.error('Failed to load meal data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMealPlan = async (dailyBudget: number, calorieTarget?: number): Promise<MealPlan> => {
    try {
      setIsLoading(true);
      const plan = await mealService.generateDailyMealPlan(dailyBudget, calorieTarget);
      setTodayMealPlan(plan);
      await loadMealData(); // Refresh all data
      return plan;
    } catch (error) {
      console.error('Failed to generate meal plan:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const generateWeeklyPlan = async (dailyBudget: number): Promise<MealPlan[]> => {
    try {
      setIsLoading(true);
      const plans = await mealService.generateWeeklyMealPlan(dailyBudget);
      setWeeklyMealPlans(plans);
      return plans;
    } catch (error) {
      console.error('Failed to generate weekly plan:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const markMealConsumed = async (mealId: string): Promise<void> => {
    if (!todayMealPlan) return;
    
    try {
      await mealService.markMealAsConsumed(todayMealPlan.id, mealId);
      await loadMealData(); // Refresh data
    } catch (error) {
      console.error('Failed to mark meal as consumed:', error);
      throw error;
    }
  };

  const getMealsByType = (type: 'breakfast' | 'lunch' | 'dinner' | 'snack'): Meal[] => {
    return mealService.getMealsByType(type);
  };

  const getMealsWithinBudget = (maxCost: number): Meal[] => {
    return mealService.getMealsWithinBudget(maxCost);
  };

  const getMealById = (id: string): Meal | undefined => {
    return mealService.getMealById(id);
  };

  const generateGroceryList = (plan?: MealPlan) => {
    const planToUse = plan || todayMealPlan;
    if (!planToUse) return [];
    
    return mealService.generateGroceryList(planToUse);
  };

  const getNutritionalSummary = (plan?: MealPlan) => {
    const planToUse = plan || todayMealPlan;
    if (!planToUse) return null;
    
    return mealService.calculateNutritionalSummary(planToUse);
  };

  const getBudgetFriendlyMeals = (maxCost: number, preferredTypes?: string[]): Meal[] => {
    return mealService.getBudgetFriendlyMeals(maxCost, preferredTypes);
  };

  const getDesiRecommendations = (budget: number) => {
    return mealService.getDesiMealRecommendations(budget);
  };

  const getTodayConsumption = () => {
    if (!todayMealPlan) return { calories: 0, cost: 0, consumed: 0, total: 0 };
    
    const consumedMeals = todayMealPlan.meals.filter(m => m.consumed);
    const totalCalories = consumedMeals.reduce((sum, planMeal) => {
      const meal = getMealById(planMeal.mealId);
      return sum + (meal?.calories || 0);
    }, 0);
    
    const totalCost = consumedMeals.reduce((sum, planMeal) => {
      const meal = getMealById(planMeal.mealId);
      return sum + (meal?.cost || 0);
    }, 0);

    return {
      calories: totalCalories,
      cost: totalCost,
      consumed: consumedMeals.length,
      total: todayMealPlan.meals.length
    };
  };

  const getWeeklyBudgetSummary = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weeklyPlans = weeklyMealPlans.filter(plan => 
      new Date(plan.date) >= weekAgo
    );

    const totalBudget = weeklyPlans.reduce((sum, plan) => sum + plan.dailyBudget, 0);
    const totalSpent = weeklyPlans.reduce((sum, plan) => sum + plan.totalCost, 0);
    
    return {
      totalBudget,
      totalSpent,
      remaining: totalBudget - totalSpent,
      days: weeklyPlans.length
    };
  };

  const getMealPlanHistory = () => {
    return weeklyMealPlans.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return {
    // State
    meals,
    todayMealPlan,
    weeklyMealPlans,
    isLoading,
    
    // Actions
    generateMealPlan,
    generateWeeklyPlan,
    markMealConsumed,
    
    // Getters
    getMealsByType,
    getMealsWithinBudget,
    getMealById,
    getBudgetFriendlyMeals,
    getDesiRecommendations,
    
    // Utils
    generateGroceryList,
    getNutritionalSummary,
    getTodayConsumption,
    getWeeklyBudgetSummary,
    getMealPlanHistory,
    loadMealData
  };
}
