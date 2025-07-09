import { motion } from 'framer-motion';
import { useBodyStats } from '@/hooks/use-storage';
import { Button } from '@/components/ui/button';

export function ProgressTracker() {
  const { latestStats } = useBodyStats();

  const addMeasurement = () => {
    console.log('Add measurement clicked');
    // In real app, this would open a modal to add new measurements
  };

  const currentWeight = latestStats?.weight || 0;
  const currentBMI = latestStats?.weight && latestStats?.height 
    ? (latestStats.weight / Math.pow(latestStats.height / 100, 2)).toFixed(1)
    : 0;

  return (
    <motion.div 
      className="bg-card-bg rounded-2xl p-6 border border-neon-purple/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neon-purple">Progress Tracking</h3>
        <Button 
          variant="ghost"
          size="sm"
          className="text-neon-purple hover:text-white"
          onClick={addMeasurement}
        >
          <i className="fas fa-plus mr-1"></i>Add
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <motion.div 
          className="text-center p-3 bg-dark-bg/30 rounded-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <div className="text-xl font-bold text-neon-purple">
            {currentWeight || '--'}
          </div>
          <div className="text-xs text-gray-400">Weight (kg)</div>
          {currentWeight > 0 && (
            <div className="text-xs text-green-400 mt-1">↓ 1.2kg this month</div>
          )}
        </motion.div>
        
        <motion.div 
          className="text-center p-3 bg-dark-bg/30 rounded-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <div className="text-xl font-bold text-neon-purple">
            {currentBMI || '--'}
          </div>
          <div className="text-xs text-gray-400">BMI</div>
          {currentBMI && (
            <div className="text-xs text-green-400 mt-1">Normal Range</div>
          )}
        </motion.div>
      </div>

      {/* Simple Progress Chart Placeholder */}
      <motion.div 
        className="bg-dark-bg/30 rounded-lg p-4 h-32 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="text-gray-500 text-sm text-center">
          <i className="fas fa-chart-line text-2xl mb-2 block text-center text-neon-purple"></i>
          {currentWeight > 0 ? 'Weight Progress Chart' : 'Add measurements to see progress'}
        </div>
      </motion.div>
    </motion.div>
  );
}
