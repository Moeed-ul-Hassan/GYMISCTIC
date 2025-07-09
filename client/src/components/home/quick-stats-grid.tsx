import { motion } from 'framer-motion';
import { useCalorieTracking, useMoodTracking } from '@/hooks/use-storage';

export function QuickStatsGrid() {
  const { todayTracking } = useCalorieTracking();
  const { todayMood } = useMoodTracking();

  // Mock data for weekly workouts - in real app, this would come from workout sessions
  const weeklyWorkouts = "4/7";
  const workoutDays = [true, true, true, true, false, false, false];

  const getMoodEmoji = (mood: string | undefined) => {
    const moods = {
      happy: '😊',
      good: '🙂',
      neutral: '😐',
      stressed: '😓',
      sad: '😢',
      angry: '😡'
    };
    return moods[mood as keyof typeof moods] || '😐';
  };

  const getMoodText = (mood: string | undefined) => {
    return mood ? mood.charAt(0).toUpperCase() + mood.slice(1) : 'Neutral';
  };

  const calorieProgress = todayTracking 
    ? Math.round((todayTracking.consumedCalories / todayTracking.targetCalories) * 100)
    : 0;

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Calories Card */}
      <motion.div 
        className="bg-card-bg rounded-xl p-4 border border-neon-green/30 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="text-2xl font-bold text-neon-green">
          {todayTracking?.consumedCalories || 0}
        </div>
        <div className="text-xs text-gray-400">Calories</div>
        <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
          <motion.div 
            className="bg-neon-green h-1 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(calorieProgress, 100)}%` }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Weekly Workouts Card */}
      <motion.div 
        className="bg-card-bg rounded-xl p-4 border border-neon-blue/30 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="text-2xl font-bold text-neon-blue">{weeklyWorkouts}</div>
        <div className="text-xs text-gray-400">This Week</div>
        <div className="flex justify-center mt-2 space-x-1">
          {workoutDays.map((completed, index) => (
            <motion.div
              key={index}
              className={`w-1.5 h-1.5 rounded-full ${
                completed ? 'bg-neon-blue' : 'bg-gray-600'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2, delay: 0.4 + index * 0.1 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Mood Card */}
      <motion.div 
        className="bg-card-bg rounded-xl p-4 border border-neon-purple/30 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="text-2xl text-neon-purple">
          {getMoodEmoji(todayMood?.mood)}
        </div>
        <div className="text-xs text-gray-400">Mood</div>
        <div className="text-xs text-neon-purple mt-1">
          {getMoodText(todayMood?.mood)}
        </div>
      </motion.div>
    </div>
  );
}
