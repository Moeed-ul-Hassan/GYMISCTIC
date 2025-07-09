import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Meal } from '@shared/schema';
import mealSuggestionsData from '@/data/meal-suggestions.json';

interface MealSuggestionsProps {
  dailyBudget: number;
  onMealSelect: (meal: Meal) => void;
  selectedMeals: Meal[];
}

export function MealSuggestions({ dailyBudget, onMealSelect, selectedMeals }: MealSuggestionsProps) {
  const [selectedCategory, setSelectedCategory] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  
  const meals = mealSuggestionsData.meals as Meal[];
  const filteredMeals = meals.filter(meal => 
    meal.type === selectedCategory && 
    meal.cost <= dailyBudget * 0.4 // Max 40% of daily budget per meal
  );

  const getTotalCost = () => {
    return selectedMeals.reduce((total, meal) => total + meal.cost, 0);
  };

  const getTotalCalories = () => {
    return selectedMeals.reduce((total, meal) => total + meal.calories, 0);
  };

  const getMealsByType = (type: string) => {
    return selectedMeals.filter(meal => meal.type === type);
  };

  const canAddMeal = (meal: Meal) => {
    const currentCost = getTotalCost();
    return currentCost + meal.cost <= dailyBudget;
  };

  const getMealIcon = (type: string) => {
    const icons = {
      breakfast: 'fas fa-sun text-accent-orange',
      lunch: 'fas fa-sun text-yellow-400',
      dinner: 'fas fa-moon text-blue-400',
      snack: 'fas fa-cookie text-green-400'
    };
    return icons[type as keyof typeof icons] || 'fas fa-utensils';
  };

  return (
    <div className="space-y-6">
      {/* Daily Summary */}
      <Card className="p-6 bg-card-bg border-neon-blue/30">
        <h3 className="text-lg font-semibold text-neon-blue mb-4">Today's Meal Plan</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-dark-bg/30 rounded-lg">
            <div className="text-2xl font-bold text-neon-green">₨{getTotalCost()}</div>
            <div className="text-xs text-gray-400">Total Cost</div>
          </div>
          <div className="text-center p-3 bg-dark-bg/30 rounded-lg">
            <div className="text-2xl font-bold text-neon-blue">{getTotalCalories()}</div>
            <div className="text-xs text-gray-400">Calories</div>
          </div>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
          <motion.div 
            className={`h-2 rounded-full ${getTotalCost() <= dailyBudget ? 'bg-neon-green' : 'bg-red-400'}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((getTotalCost() / dailyBudget) * 100, 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="text-xs text-gray-400 text-center">
          ₨{getTotalCost()} / ₨{dailyBudget} daily budget
        </div>
      </Card>

      {/* Selected Meals */}
      {selectedMeals.length > 0 && (
        <Card className="p-6 bg-card-bg border-neon-green/30">
          <h3 className="text-lg font-semibold text-neon-green mb-4">Selected Meals</h3>
          
          <div className="space-y-2">
            {selectedMeals.map((meal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-dark-bg/30 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <i className={getMealIcon(meal.type)}></i>
                  <div>
                    <div className="text-white font-medium">{meal.name}</div>
                    <div className="text-xs text-gray-400 capitalize">{meal.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-neon-green font-semibold">₨{meal.cost}</div>
                  <div className="text-xs text-gray-400">{meal.calories} cal</div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Meal Categories */}
      <Card className="p-6 bg-card-bg border-neon-purple/30">
        <h3 className="text-lg font-semibold text-neon-purple mb-4">Add Meals</h3>
        
        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
          <TabsList className="grid w-full grid-cols-4 bg-dark-bg/50">
            <TabsTrigger value="breakfast" className="data-[state=active]:bg-neon-purple/20">
              Breakfast
            </TabsTrigger>
            <TabsTrigger value="lunch" className="data-[state=active]:bg-neon-purple/20">
              Lunch
            </TabsTrigger>
            <TabsTrigger value="dinner" className="data-[state=active]:bg-neon-purple/20">
              Dinner
            </TabsTrigger>
            <TabsTrigger value="snack" className="data-[state=active]:bg-neon-purple/20">
              Snacks
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-4">
            <div className="space-y-3">
              {filteredMeals.map((meal, index) => {
                const alreadySelected = getMealsByType(meal.type).length > 0;
                const canAdd = canAddMeal(meal);
                
                return (
                  <motion.div
                    key={meal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border transition-colors ${
                      alreadySelected 
                        ? 'border-gray-600 bg-gray-800/50' 
                        : canAdd 
                        ? 'border-neon-purple/30 bg-dark-bg/30 hover:border-neon-purple/50' 
                        : 'border-red-500/30 bg-red-900/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{meal.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>{meal.calories} cal</span>
                          <span>{meal.protein}g protein</span>
                          <span>{meal.preparationTime} min</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {meal.ingredients.slice(0, 3).map((ingredient, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {ingredient}
                            </Badge>
                          ))}
                          {meal.ingredients.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{meal.ingredients.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className="text-lg font-bold text-neon-green mb-2">₨{meal.cost}</div>
                        <Button
                          size="sm"
                          onClick={() => onMealSelect(meal)}
                          disabled={alreadySelected || !canAdd}
                          className={
                            alreadySelected 
                              ? 'bg-gray-600 text-gray-400' 
                              : canAdd
                              ? 'bg-neon-purple text-white hover:bg-neon-purple/90'
                              : 'bg-red-500/20 text-red-400'
                          }
                        >
                          {alreadySelected ? 'Added' : canAdd ? 'Add' : 'Over Budget'}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              
              {filteredMeals.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <i className="fas fa-utensils text-4xl mb-4 opacity-50"></i>
                  <p>No meals available within your budget for {selectedCategory}</p>
                  <p className="text-sm">Try increasing your daily budget or selecting a different meal type</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
