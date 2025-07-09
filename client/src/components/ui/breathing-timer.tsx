import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface BreathingTimerProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

type BreathingPhase = 'inhale' | 'hold' | 'exhale';

export function BreathingTimer({ isOpen, onClose, onComplete }: BreathingTimerProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathingPhase>('inhale');
  const [countdown, setCountdown] = useState(4);
  const [cycles, setCycles] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);

  const phaseConfig = {
    inhale: { duration: 4, next: 'hold' as BreathingPhase, color: 'text-neon-green', instruction: 'Breathe In' },
    hold: { duration: 4, next: 'exhale' as BreathingPhase, color: 'text-neon-blue', instruction: 'Hold' },
    exhale: { duration: 4, next: 'inhale' as BreathingPhase, color: 'text-neon-purple', instruction: 'Breathe Out' }
  };

  const islamicReminders = [
    "La hawla wa la quwwata illa billah",
    "Subhan Allah wa bihamdihi",
    "Alhamdulillahi rabbil alameen",
    "La ilaha illa Allah",
    "Allah huma salli ala Muhammad"
  ];

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setPhase('inhale');
    setCountdown(4);
    setCycles(0);
    setTotalSeconds(0);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && isOpen) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            const currentPhase = phaseConfig[phase];
            const nextPhase = currentPhase.next;
            
            setPhase(nextPhase);
            
            if (nextPhase === 'inhale') {
              setCycles(prevCycles => {
                const newCycles = prevCycles + 1;
                if (newCycles >= 5) {
                  setIsActive(false);
                  onComplete();
                }
                return newCycles;
              });
            }
            
            return phaseConfig[nextPhase].duration;
          }
          return prev - 1;
        });
        
        setTotalSeconds(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, phase, isOpen, onComplete]);

  const startTimer = () => {
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const getCurrentReminder = () => {
    return islamicReminders[cycles % islamicReminders.length];
  };

  const getCircleScale = () => {
    const progress = (phaseConfig[phase].duration - countdown) / phaseConfig[phase].duration;
    switch (phase) {
      case 'inhale':
        return 0.5 + (progress * 0.5); // Scale from 0.5 to 1
      case 'hold':
        return 1; // Stay at full scale
      case 'exhale':
        return 1 - (progress * 0.5); // Scale from 1 to 0.5
      default:
        return 0.5;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-card-bg border-neon-blue/30 p-8">
        <div className="text-center space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-neon-blue">4-4-4 Breathing</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <i className="fas fa-times"></i>
            </Button>
          </div>

          {/* Breathing Circle */}
          <div className="relative w-48 h-48 mx-auto">
            <motion.div
              className={`w-full h-full rounded-full border-4 ${phaseConfig[phase].color} border-current flex items-center justify-center`}
              animate={{ 
                scale: getCircleScale(),
                boxShadow: isActive ? `0 0 30px currentColor` : '0 0 10px currentColor'
              }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <div className="text-center">
                <div className={`text-4xl font-orbitron font-bold ${phaseConfig[phase].color}`}>
                  {countdown}
                </div>
                <div className={`text-sm ${phaseConfig[phase].color} mt-2`}>
                  {phaseConfig[phase].instruction}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Phase Indicator */}
          <div className="space-y-2">
            <div className={`text-lg font-semibold ${phaseConfig[phase].color}`}>
              {phaseConfig[phase].instruction}
            </div>
            <div className="text-gray-400 text-sm">
              Cycle {cycles + 1} of 5
            </div>
          </div>

          {/* Islamic Reminder */}
          <AnimatePresence mode="wait">
            <motion.div
              key={cycles}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 bg-dark-bg/30 rounded-lg border border-neon-purple/30"
            >
              <div className="text-neon-purple font-amiri text-lg mb-1">
                {getCurrentReminder()}
              </div>
              <div className="text-gray-400 text-sm">
                Recite silently while breathing
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Progress</span>
              <span>{Math.round((totalSeconds / 60) * 10) / 10} min</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-neon-green to-neon-blue h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(cycles / 5) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex space-x-3">
            {!isActive ? (
              <Button
                onClick={startTimer}
                className="flex-1 bg-neon-green text-dark-bg font-semibold hover:bg-neon-green/90"
              >
                <i className="fas fa-play mr-2"></i>
                {cycles === 0 ? 'Start' : 'Resume'}
              </Button>
            ) : (
              <Button
                onClick={pauseTimer}
                variant="outline"
                className="flex-1 border-neon-blue text-neon-blue hover:bg-neon-blue/10"
              >
                <i className="fas fa-pause mr-2"></i>
                Pause
              </Button>
            )}
            
            <Button
              onClick={resetTimer}
              variant="outline"
              className="border-gray-600 text-gray-400 hover:text-white"
            >
              <i className="fas fa-redo"></i>
            </Button>
          </div>

          {/* Instructions */}
          <div className="text-xs text-gray-500 text-left space-y-1">
            <p>• Find a comfortable position</p>
            <p>• Follow the breathing rhythm</p>
            <p>• Focus on the Islamic reminder</p>
            <p>• Complete 5 cycles for best results</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
