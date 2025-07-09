import { motion } from 'framer-motion';

export default function Meals() {
  return (
    <div className="min-h-screen gradient-bg pb-24">
      <header className="bg-card-bg/50 backdrop-blur-lg border-b border-neon-purple/20 sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center space-x-3">
          <i className="fas fa-utensils text-neon-purple text-xl"></i>
          <h1 className="text-xl font-orbitron font-bold text-neon-purple neon-text">Meal Planner</h1>
        </div>
      </header>

      <main className="px-4 py-6">
        <motion.div 
          className="text-center py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <i className="fas fa-utensils text-6xl text-neon-purple mb-4 animate-bounce-subtle"></i>
          <h2 className="text-2xl font-bold text-white mb-4">Budget Meal Planning</h2>
          <p className="text-gray-400 mb-8">Plan halal meals within your PKR budget</p>
          
          <div className="bg-card-bg rounded-xl p-6 border border-neon-purple/30 text-left max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-neon-purple mb-4">Coming Soon Features:</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• PKR budget-based meal planning</li>
              <li>• Desi food suggestions (Daal, Chawal, etc.)</li>
              <li>• Grocery list generator</li>
              <li>• Calorie and macro tracking</li>
              <li>• Weekly menu rotation</li>
            </ul>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
