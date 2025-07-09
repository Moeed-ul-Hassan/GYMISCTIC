import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMoodTracking } from '@/hooks/use-storage';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export function MentalFitness() {
  const { todayMood, saveMood } = useMoodTracking();
  const [dhikrEnabled, setDhikrEnabled] = useState(false);

  const moodOptions = [
    { emoji: '😊', mood: 'happy', label: 'Happy' },
    { emoji: '😐', mood: 'neutral', label: 'Neutral' },
    { emoji: '😓', mood: 'stressed', label: 'Stressed' },
    { emoji: '😡', mood: 'angry', label: 'Angry' }
  ];

  const setMoodHandler = async (selectedMood: string) => {
    const today = new Date().toISOString().split('T')[0];
    const moodScore = selectedMood === 'happy' ? 5 : selectedMood === 'neutral' ? 3 : selectedMood === 'stressed' ? 2 : 1;
    
    await saveMood({
      id: `mood-${today}`,
      date: today,
      mood: selectedMood as any,
      moodScore,
      notes: '',
      dhikrCompleted: false,
      breathingExercise: false
    });
  };

  const startBreathing = () => {
    console.log('Starting 4-4-4 breathing exercise');
    // In real app, this would start a breathing timer
  };

  const getCurrentMoodDisplay = () => {
    if (!todayMood) return '😐 Good';
    const option = moodOptions.find(opt => opt.mood === todayMood.mood);
    return `${option?.emoji || '😐'} ${option?.label || 'Good'}`;
  };

  return (
    <motion.div 
      className="bg-card-bg rounded-2xl p-6 border border-accent-orange/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-accent-orange">Mental Fitness</h3>
        <div className="text-sm text-gray-400">
          Today: <span className="text-accent-orange">{getCurrentMoodDisplay()}</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Breathing Exercise */}
        <motion.div 
          className="p-4 bg-dark-bg/30 rounded-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-white">4-4-4 Breathing</span>
            <Button 
              variant="ghost"
              size="sm"
              className="text-accent-orange hover:text-white p-1"
              onClick={startBreathing}
            >
              <i className="fas fa-play"></i>
            </Button>
          </div>
          <div className="text-xs text-gray-400">Inhale 4s • Hold 4s • Exhale 4s</div>
        </motion.div>

        {/* Mood Check */}
        <motion.div 
          className="p-4 bg-dark-bg/30 rounded-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <div className="text-sm font-medium text-white mb-3">How are you feeling?</div>
          <div className="flex justify-between">
            {moodOptions.map((option, index) => (
              <motion.button
                key={option.mood}
                className={`text-2xl p-2 rounded-lg hover:bg-dark-bg/50 transition-colors ${
                  todayMood?.mood === option.mood ? 'bg-dark-bg/70 ring-2 ring-accent-orange' : ''
                }`}
                onClick={() => setMoodHandler(option.mood)}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: 0.9 + index * 0.1 }}
              >
                {option.emoji}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Optional Dhikr Reminder */}
        <motion.div 
          className="p-4 bg-dark-bg/30 rounded-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.9 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">Dhikr Reminders</span>
            <Switch 
              checked={dhikrEnabled}
              onCheckedChange={setDhikrEnabled}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
