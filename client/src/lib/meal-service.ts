import { storageService } from './storage-service';
import { Meal, MealPlan } from '@shared/schema';
import mealSuggestionsData from '@/data/meal-suggestions.json';

export class MealService {
  // Get all available meals
  getMeals(): Meal[] {
    return mealSuggestionsData.meals as Meal[];
  }

  // Get meals by type
  getMealsByType(type: 'breakfast' | 'lunch' | 'dinner' | 'snack'): Meal[] {
    return this.getMeals().filter(meal => meal.type === type);
  }

  // Get meals within budget
  getMealsWithinBudget(maxCost: number): Meal[] {
    return this.getMeals().filter(meal => meal.cost <= maxCost);
  }

  // Generate meal plan for a day
  async generateDailyMealPlan(dailyBudget: number, calorieTarget?: number): Promise<MealPlan> {
    const today = new Date().toISOString().split('T')[0];
    const planId = `meal-plan-${today}`;

    // Budget allocation per meal type
    const budgetAllocation = {
      breakfast: dailyBudget * 0.25,
      lunch: dailyBudget * 0.35,
      dinner: dailyBudget * 0.35,
      snack: dailyBudget * 0.05
    };

    const selectedMeals: any[] = [];
    let totalCost = 0;
    let totalCalories = 0;

    // Select meals for each type
    for (const [mealType, budget] of Object.entries(budgetAllocation)) {
      const availableMeals = this.getMealsByType(mealType as any)
        .filter(meal => meal.cost <= budget)
        .sort((a, b) => {
          // Prioritize by nutritional value and cost efficiency
          const aValue = (a.protein + a.calories / 100) / a.cost;
          const bValue = (b.protein + b.calories / 100) / b.cost;
          return bValue - aValue;
        });

      if (availableMeals.length > 0) {
        const selectedMeal = availableMeals[0];
        selectedMeals.push({
          mealId: selectedMeal.id,
          type: mealType,
          consumed: false
        });
        totalCost += selectedMeal.cost;
        totalCalories += selectedMeal.calories;
      }
    }

    const mealPlan: MealPlan = {
      id: planId,
      date: today,
      meals: selectedMeals,
      dailyBudget,
      totalCalories,
      totalCost
    };

    await storageService.saveMealPlan(mealPlan);
    return mealPlan;
  }

  // Generate weekly meal plan
  async generateWeeklyMealPlan(dailyBudget: number): Promise<MealPlan[]> {
    const weekPlans: MealPlan[] = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      const plan = await this.generateDailyMealPlan(dailyBudget);
      plan.date = dateString;
      plan.id = `meal-plan-${dateString}`;
      
      weekPlans.push(plan);
    }

    return weekPlans;
  }

  // Get meal by ID
  getMealById(id: string): Meal | undefined {
    return this.getMeals().find(meal => meal.id === id);
  }

  // Mark meal as consumed
  async markMealAsConsumed(planId: string, mealId: string): Promise<void> {
    const plans = await storageService.getMealPlans();
    const plan = plans.find(p => p.id === planId);
    
    if (plan) {
      const mealIndex = plan.meals.findIndex(m => m.mealId === mealId);
      if (mealIndex !== -1) {
        plan.meals[mealIndex].consumed = true;
        await storageService.saveMealPlan(plan);
      }
    }
  }

  // Generate grocery list
  generateGroceryList(mealPlan: MealPlan): { ingredient: string; quantity: string; estimatedCost: number }[] {
    const groceryItems: Map<string, { quantity: number; cost: number }> = new Map();
    
    mealPlan.meals.forEach(planMeal => {
      const meal = this.getMealById(planMeal.mealId);
      if (meal) {
        meal.ingredients.forEach(ingredient => {
          const existing = groceryItems.get(ingredient) || { quantity: 0, cost: 0 };
          // Estimate quantities and costs based on meal cost
          groceryItems.set(ingredient, {
            quantity: existing.quantity + 1,
            cost: existing.cost + (meal.cost / meal.ingredients.length)
          });
        });
      }
    });

    return Array.from(groceryItems.entries()).map(([ingredient, data]) => ({
      ingredient,
      quantity: this.getIngredientQuantity(ingredient, data.quantity),
      estimatedCost: Math.round(data.cost)
    }));
  }

  // Calculate nutritional summary
  calculateNutritionalSummary(mealPlan: MealPlan) {
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalCalories = 0;

    mealPlan.meals.forEach(planMeal => {
      const meal = this.getMealById(planMeal.mealId);
      if (meal) {
        totalProtein += meal.protein;
        totalCarbs += meal.carbs;
        totalFat += meal.fat;
        totalCalories += meal.calories;
      }
    });

    return {
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
      calories: totalCalories,
      proteinPercentage: (totalProtein * 4 / totalCalories) * 100,
      carbsPercentage: (totalCarbs * 4 / totalCalories) * 100,
      fatPercentage: (totalFat * 9 / totalCalories) * 100
    };
  }

  // Get budget-friendly meal suggestions
  getBudgetFriendlyMeals(maxCost: number, preferredTypes?: string[]): Meal[] {
    let meals = this.getMealsWithinBudget(maxCost);
    
    if (preferredTypes && preferredTypes.length > 0) {
      meals = meals.filter(meal => preferredTypes.includes(meal.type));
    }

    return meals.sort((a, b) => {
      // Sort by nutritional value per rupee
      const aValue = (a.protein + a.calories / 100) / a.cost;
      const bValue = (b.protein + b.calories / 100) / b.cost;
      return bValue - aValue;
    });
  }

  // Get meal recommendations based on Pakistani cuisine
  getDesiMealRecommendations(budget: number): { 
    economical: Meal[]; 
    balanced: Meal[]; 
    protein_rich: Meal[] 
  } {
    const meals = this.getMealsWithinBudget(budget);
    
    return {
      economical: meals.filter(meal => meal.cost <= budget * 0.3).slice(0, 3),
      balanced: meals.filter(meal => 
        meal.protein >= 15 && meal.carbs >= 30 && meal.cost <= budget * 0.5
      ).slice(0, 3),
      protein_rich: meals.filter(meal => meal.protein >= 20).slice(0, 3)
    };
  }

  // Private helper method
  private getIngredientQuantity(ingredient: string, servings: number): string {
    // Estimate quantities based on typical Pakistani cooking
    const quantities: { [key: string]: string } = {
      'atta': `${servings * 0.2} kg`,
      'chawal': `${servings * 0.15} kg`,
      'chicken': `${servings * 0.25} kg`,
      'anda': `${servings * 2} pieces`,
      'daal': `${servings * 0.1} kg`,
      'oil': `${servings * 0.05} liter`,
      'dudh': `${servings * 0.2} liter`,
      'dahi': `${servings * 0.15} kg`,
      'pyaz': `${servings * 0.1} kg`,
      'tamatar': `${servings * 0.15} kg`
    };

    return quantities[ingredient] || `${servings} portions`;
  }
}

export const mealService = new MealService();
