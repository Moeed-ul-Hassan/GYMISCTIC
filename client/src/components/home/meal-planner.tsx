import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function MealPlanner() {
  // Mock meal data - in real app, this would come from meal service
  const todayMeals = [
    {
      type: 'breakfast',
      name: 'Anda Paratha + Chai',
      cost: 80,
      calories: 420,
      icon: 'fas fa-sun',
      iconColor: 'text-accent-orange'
    },
    {
      type: 'lunch', 
      name: 'Daal Chawal + Sabzi',
      cost: 120,
      calories: 580,
      icon: 'fas fa-sun',
      iconColor: 'text-yellow-400'
    },
    {
      type: 'dinner',
      name: 'Roti + Chicken Karahi', 
      cost: 150,
      calories: 650,
      icon: 'fas fa-moon',
      iconColor: 'text-blue-400'
    }
  ];

  const dailyBudget = 350;
  const totalCost = todayMeals.reduce((sum, meal) => sum + meal.cost, 0);

  const generateGroceryList = () => {
    console.log('Generate grocery list clicked');
    // In real app, this would generate and show grocery list
  };

  return (
    <motion.div 
      className="bg-card-bg rounded-2xl p-6 border border-neon-blue/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neon-blue">Today's Meals</h3>
        <div className="text-sm text-gray-400">
          Budget: <span className="text-neon-blue font-semibold">₨{dailyBudget}</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {todayMeals.map((meal, index) => (
          <motion.div 
            key={index}
            className="flex items-center justify-between p-3 bg-dark-bg/30 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <i className={`${meal.icon} ${meal.iconColor}`}></i>
              <div>
                <div className="text-sm font-medium text-white capitalize">{meal.type}</div>
                <div className="text-xs text-gray-400">{meal.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-neon-blue font-semibold">₨{meal.cost}</div>
              <div className="text-xs text-gray-400">{meal.calories} cal</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mb-4 p-3 bg-dark-bg/20 rounded-lg">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Total Spent:</span>
          <span className={`font-semibold ${totalCost <= dailyBudget ? 'text-neon-green' : 'text-red-400'}`}>
            ₨{totalCost} / ₨{dailyBudget}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
          <motion.div 
            className={`h-1 rounded-full ${totalCost <= dailyBudget ? 'bg-neon-green' : 'bg-red-400'}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((totalCost / dailyBudget) * 100, 100)}%` }}
            transition={{ duration: 0.5, delay: 0.8 }}
          />
        </div>
      </div>

      <Button 
        variant="outline"
        className="w-full border-neon-blue text-neon-blue hover:bg-neon-blue/10"
        onClick={generateGroceryList}
      >
        <i className="fas fa-shopping-cart mr-2"></i>
        Generate Grocery List
      </Button>
    </motion.div>
  );
}
