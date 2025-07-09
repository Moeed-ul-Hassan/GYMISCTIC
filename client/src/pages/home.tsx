import { motion } from 'framer-motion';
import { IslamicQuoteCard } from '@/components/home/islamic-quote-card';
import { QuickStatsGrid } from '@/components/home/quick-stats-grid';
import { TodayWorkout } from '@/components/home/today-workout';
import { MealPlanner } from '@/components/home/meal-planner';
import { ProgressTracker } from '@/components/home/progress-tracker';
import { MentalFitness } from '@/components/home/mental-fitness';
import { DeveloperMessage } from '@/components/home/developer-message';

export default function Home() {
  return (
    <div className="min-h-screen gradient-bg pb-24">
      {/* Header */}
      <motion.header 
        className="bg-card-bg/50 backdrop-blur-lg border-b border-neon-green/20 sticky top-0 z-40"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.i 
              className="fas fa-dumbbell text-neon-green text-xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
            <h1 className="text-xl font-orbitron font-bold text-neon-blue neon-text">GYMistic</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-xs text-gray-400">Today's Progress</div>
              <div className="text-sm font-semibold text-neon-green">3/5 Sets</div>
            </div>
            <motion.button 
              className="relative p-2 rounded-full bg-neon-purple/20 neon-border border-neon-purple"
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-bell text-neon-purple"></i>
              <span className="absolute -top-1 -right-1 bg-accent-orange w-4 h-4 rounded-full text-xs flex items-center justify-center">2</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6">
        <IslamicQuoteCard />
        <QuickStatsGrid />
        <TodayWorkout />
        <MealPlanner />
        <ProgressTracker />
        <MentalFitness />
        <DeveloperMessage />
      </main>

      {/* Floating Action Button */}
      <motion.button 
        className="fixed bottom-24 right-4 w-14 h-14 bg-neon-green rounded-full shadow-lg neon-border border-neon-green flex items-center justify-center z-30"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          boxShadow: [
            "0 0 10px hsl(145, 100%, 50%)",
            "0 0 20px hsl(145, 100%, 50%)",
            "0 0 10px hsl(145, 100%, 50%)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <i className="fas fa-plus text-dark-bg text-xl"></i>
      </motion.button>
    </div>
  );
}
