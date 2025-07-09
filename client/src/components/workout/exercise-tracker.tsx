import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Exercise, WorkoutSet } from '@shared/schema';

interface ExerciseTrackerProps {
  exercise: Exercise;
  currentSet: number;
  totalSets: number;
  onSetComplete: (reps: number, weight?: number) => void;
  onNextExercise: () => void;
  isLastExercise: boolean;
}

export function ExerciseTracker({
  exercise,
  currentSet,
  totalSets,
  onSetComplete,
  onNextExercise,
  isLastExercise
}: ExerciseTrackerProps) {
  const [reps, setReps] = useState(0);
  const [weight, setWeight] = useState<number>(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [showMotivation, setShowMotivation] = useState(false);

  const motivationalPhrases = [
    "Bismillah! Allah ki madad ke saath!",
    "Sabr aur mehnat ka phal meetha hai!",
    "Tu kar sakta hai! Allah tere saath hai!",
    "Har rep Allah ke naam pe!",
    "Strong body, strong Imaan!"
  ];

  const startRestTimer = (duration: number = 60) => {
    setIsResting(true);
    setRestTimer(duration);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  const handleSetComplete = () => {
    onSetComplete(reps, weight || undefined);
    
    // Show motivation
    setShowMotivation(true);
    setTimeout(() => setShowMotivation(false), 2000);
    
    // Start rest timer if not last set
    if (currentSet < totalSets) {
      startRestTimer(60);
    }
    
    setReps(0);
  };

  const incrementReps = () => setReps(prev => prev + 1);
  const decrementReps = () => setReps(prev => Math.max(0, prev - 1));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-6 bg-card-bg border-neon-green/30">
      <div className="space-y-6">
        {/* Exercise Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neon-green mb-2">{exercise.name}</h2>
          <p className="text-gray-400">
            Set {currentSet} of {totalSets}
          </p>
        </div>

        {/* Exercise Instructions */}
        <div className="bg-dark-bg/50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-2">Instructions:</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            {exercise.instructions.map((instruction, index) => (
              <li key={index}>• {instruction}</li>
            ))}
          </ul>
        </div>

        {/* Rep Counter */}
        <div className="text-center space-y-4">
          <div className="text-6xl font-orbitron font-bold text-neon-green">
            {reps}
          </div>
          <div className="text-gray-400">Reps Completed</div>
          
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              size="lg"
              onClick={decrementReps}
              className="border-red-500 text-red-500 hover:bg-red-500/10 w-16 h-16 rounded-full"
            >
              <i className="fas fa-minus text-xl"></i>
            </Button>
            <Button
              size="lg"
              onClick={incrementReps}
              className="bg-neon-green text-dark-bg hover:bg-neon-green/90 w-16 h-16 rounded-full"
            >
              <i className="fas fa-plus text-xl"></i>
            </Button>
          </div>
        </div>

        {/* Weight Input (if applicable) */}
        {exercise.equipment.includes('weights') && (
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Weight (kg)</label>
            <Input
              type="number"
              value={weight || ''}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="bg-dark-bg/50 border-gray-600 text-white"
              placeholder="Enter weight"
            />
          </div>
        )}

        {/* Rest Timer */}
        <AnimatePresence>
          {isResting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center p-4 bg-neon-blue/20 rounded-lg border border-neon-blue/30"
            >
              <div className="text-neon-blue text-2xl font-bold mb-2">
                {formatTime(restTimer)}
              </div>
              <div className="text-sm text-gray-400">Rest Time</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="space-y-3">
          {!isResting && (
            <Button
              onClick={handleSetComplete}
              disabled={reps === 0}
              className="w-full bg-neon-green text-dark-bg font-semibold hover:bg-neon-green/90"
            >
              Complete Set
            </Button>
          )}
          
          {currentSet === totalSets && !isResting && (
            <Button
              onClick={onNextExercise}
              variant="outline"
              className="w-full border-neon-blue text-neon-blue hover:bg-neon-blue/10"
            >
              {isLastExercise ? 'Finish Workout' : 'Next Exercise'}
            </Button>
          )}
        </div>

        {/* Motivational Message */}
        <AnimatePresence>
          {showMotivation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center p-4 bg-neon-purple/20 rounded-lg border border-neon-purple/30"
            >
              <p className="text-neon-purple font-semibold">
                {motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)]}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
