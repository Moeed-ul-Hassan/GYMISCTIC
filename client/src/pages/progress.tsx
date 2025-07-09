import { motion } from 'framer-motion';

export default function Progress() {
  return (
    <div className="min-h-screen gradient-bg pb-24">
      <header className="bg-card-bg/50 backdrop-blur-lg border-b border-accent-orange/20 sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center space-x-3">
          <i className="fas fa-chart-bar text-accent-orange text-xl"></i>
          <h1 className="text-xl font-orbitron font-bold text-accent-orange neon-text">Progress</h1>
        </div>
      </header>

      <main className="px-4 py-6">
        <motion.div 
          className="text-center py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <i className="fas fa-chart-line text-6xl text-accent-orange mb-4 animate-bounce-subtle"></i>
          <h2 className="text-2xl font-bold text-white mb-4">Track Your Journey</h2>
          <p className="text-gray-400 mb-8">Monitor your physical and spiritual progress</p>
          
          <div className="bg-card-bg rounded-xl p-6 border border-accent-orange/30 text-left max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-accent-orange mb-4">Coming Soon Features:</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Body measurements tracking</li>
              <li>• Weight progress charts</li>
              <li>• BMI calculator</li>
              <li>• Progress photos</li>
              <li>• Achievement milestones</li>
            </ul>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
