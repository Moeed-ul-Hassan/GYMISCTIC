import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useMeals } from '@/hooks/use-meals';

interface BudgetPlannerProps {
  monthlyBudget: number;
  onBudgetChange: (budget: number) => void;
}

export function BudgetPlanner({ monthlyBudget, onBudgetChange }: BudgetPlannerProps) {
  const [dailyBudget, setDailyBudget] = useState(0);
  const [weeklySpent, setWeeklySpent] = useState(0);
  const [monthlySpent, setMonthlySpent] = useState(0);
  const { generateMealPlan } = useMeals();

  useEffect(() => {
    const daily = monthlyBudget / 30;
    setDailyBudget(daily);
  }, [monthlyBudget]);

  const budgetCategories = [
    { name: 'Basic (Student)', amount: 8000, description: 'Daal, chawal, roti, basic vegetables' },
    { name: 'Moderate (Working)', amount: 15000, description: 'Includes chicken, fruits, dairy' },
    { name: 'Comfortable (Family)', amount: 25000, description: 'Variety of proteins and fresh produce' }
  ];

  const generateWeeklyPlan = async () => {
    try {
      await generateMealPlan(dailyBudget);
    } catch (error) {
      console.error('Failed to generate meal plan:', error);
    }
  };

  const weeklyProgress = (weeklySpent / (dailyBudget * 7)) * 100;
  const monthlyProgress = (monthlySpent / monthlyBudget) * 100;

  return (
    <div className="space-y-6">
      {/* Budget Input */}
      <Card className="p-6 bg-card-bg border-neon-blue/30">
        <h3 className="text-lg font-semibold text-neon-blue mb-4">Monthly Budget Setup</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Monthly Budget (PKR)</label>
            <Input
              type="number"
              value={monthlyBudget || ''}
              onChange={(e) => onBudgetChange(Number(e.target.value))}
              className="bg-dark-bg/50 border-gray-600 text-white"
              placeholder="Enter monthly food budget"
            />
          </div>
          
          {dailyBudget > 0 && (
            <div className="p-4 bg-neon-blue/10 rounded-lg border border-neon-blue/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-blue">₨{Math.round(dailyBudget)}</div>
                <div className="text-sm text-gray-400">Daily Budget</div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Budget Categories */}
      <Card className="p-6 bg-card-bg border-neon-green/30">
        <h3 className="text-lg font-semibold text-neon-green mb-4">Budget Guidelines</h3>
        
        <div className="space-y-3">
          {budgetCategories.map((category, index) => (
            <motion.div
              key={index}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                Math.abs(monthlyBudget - category.amount) < 2000
                  ? 'border-neon-green bg-neon-green/10'
                  : 'border-gray-600 bg-dark-bg/30 hover:border-gray-500'
              }`}
              onClick={() => onBudgetChange(category.amount)}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-white">{category.name}</h4>
                <Badge className="bg-neon-green/20 text-neon-green">
                  ₨{category.amount.toLocaleString()}
                </Badge>
              </div>
              <p className="text-sm text-gray-400">{category.description}</p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Spending Tracker */}
      {monthlyBudget > 0 && (
        <Card className="p-6 bg-card-bg border-neon-purple/30">
          <h3 className="text-lg font-semibold text-neon-purple mb-4">Spending Tracker</h3>
          
          <div className="space-y-4">
            {/* Weekly Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">This Week</span>
                <span className="text-white">₨{weeklySpent} / ₨{Math.round(dailyBudget * 7)}</span>
              </div>
              <Progress 
                value={Math.min(weeklyProgress, 100)} 
                className="h-2"
              />
              {weeklyProgress > 90 && (
                <p className="text-red-400 text-xs mt-1">Close to weekly limit!</p>
              )}
            </div>

            {/* Monthly Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">This Month</span>
                <span className="text-white">₨{monthlySpent} / ₨{monthlyBudget}</span>
              </div>
              <Progress 
                value={Math.min(monthlyProgress, 100)} 
                className="h-2"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      {dailyBudget > 0 && (
        <Card className="p-6 bg-card-bg border-accent-orange/30">
          <h3 className="text-lg font-semibold text-accent-orange mb-4">Meal Planning</h3>
          
          <div className="space-y-3">
            <Button
              onClick={generateWeeklyPlan}
              className="w-full bg-accent-orange text-white hover:bg-accent-orange/90"
            >
              <i className="fas fa-utensils mr-2"></i>
              Generate Weekly Meal Plan
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="border-accent-orange text-accent-orange hover:bg-accent-orange/10"
              >
                <i className="fas fa-shopping-cart mr-2"></i>
                Grocery List
              </Button>
              <Button
                variant="outline"
                className="border-accent-orange text-accent-orange hover:bg-accent-orange/10"
              >
                <i className="fas fa-chart-pie mr-2"></i>
                Budget Report
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Budget Tips */}
      <Card className="p-6 bg-card-bg border-gray-600/30">
        <h3 className="text-lg font-semibold text-white mb-4">Budget Tips</h3>
        
        <div className="space-y-2 text-sm text-gray-400">
          <p>• Buy seasonal vegetables and fruits for better prices</p>
          <p>• Cook in bulk and store for multiple meals</p>
          <p>• Include protein-rich daal and eggs for affordable nutrition</p>
          <p>• Shop at local markets for fresh produce</p>
          <p>• Plan meals around affordable staples like rice and wheat</p>
        </div>
      </Card>
    </div>
  );
}
