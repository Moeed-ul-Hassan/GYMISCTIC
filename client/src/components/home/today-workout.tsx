import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function TodayWorkout() {
  const [currentSet, setCurrentSet] = useState(2);
  const [completedReps, setCompletedReps] = useState(12);
  const [restTime, setRestTime] = useState("1:30");

  // Mock workout data - in real app, this would come from workout service
  const currentExercise = {
    name: "Push-ups",
    targetReps: 15,
    totalSets: 4
  };

  const upcomingExercises = [
    { name: "Bench Press", sets: 4, reps: 12 },
    { name: "Shoulder Press", sets: 3, reps: 10 }
  ];

  const completeSet = () => {
    if (currentSet < currentExercise.totalSets) {
      setCurrentSet(prev => prev + 1);
      setCompletedReps(0);
      setRestTime("2:00");
    }
  };

  const adjustReps = () => {
    // In real app, this would open a modal to adjust reps
    console.log('Adjust reps clicked');
  };

  return (
    <motion.div 
      className="bg-card-bg rounded-2xl p-6 border border-neon-green/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neon-green">Today's Workout</h3>
        <span className="text-sm bg-neon-green/20 px-3 py-1 rounded-full text-neon-green">
          Push Day
        </span>
      </div>
      
      {/* Current Exercise */}
      <div className="bg-dark-bg/50 rounded-xl p-4 mb-4 border border-neon-green/20">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-white">{currentExercise.name}</h4>
          <div className="text-sm text-gray-400">
            Set <span className="text-neon-green">{currentSet}</span>/{currentExercise.totalSets}
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-neon-green">{currentExercise.targetReps}</div>
            <div className="text-xs text-gray-400">Target Reps</div>
          </div>
          <div className="flex-1 text-center">
            <motion.div 
              className="text-3xl font-orbitron font-bold text-white"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.5 }}
            >
              {completedReps}
            </motion.div>
            <div className="text-xs text-gray-400">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-neon-blue">{restTime}</div>
            <div className="text-xs text-gray-400">Rest</div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            className="flex-1 bg-neon-green text-dark-bg font-semibold hover:bg-neon-green/90 neon-border border-neon-green"
            onClick={completeSet}
          >
            Complete Set
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className="border-gray-600 text-gray-400 hover:text-white"
            onClick={adjustReps}
          >
            <i className="fas fa-edit"></i>
          </Button>
        </div>
      </div>

      {/* Upcoming Exercises */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-gray-400 mb-2">Next Exercises</h5>
        {upcomingExercises.map((exercise, index) => (
          <motion.div 
            key={index}
            className="flex items-center justify-between py-2 px-3 bg-dark-bg/30 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
          >
            <span className="text-sm text-gray-300">{exercise.name}</span>
            <span className="text-xs text-gray-500">
              {exercise.sets} sets × {exercise.reps} reps
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
