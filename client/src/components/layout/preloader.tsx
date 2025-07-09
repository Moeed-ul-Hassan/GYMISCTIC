import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-dark-bg flex items-center justify-center z-50 gradient-bg">
      <div className="text-center">
        <motion.div 
          className="mb-8"
          animate={{ y: [-10, 0, -10] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <i className="fas fa-dumbbell text-6xl text-neon-green animate-glow"></i>
        </motion.div>
        
        <motion.h2 
          className="text-2xl font-orbitron font-bold text-neon-blue neon-text mb-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          GYMistic
        </motion.h2>
        
        <div className="text-sm text-gray-400 font-mono mb-4">Loading Gains...</div>
        
        <div className="w-48 bg-gray-700 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-neon-green to-neon-blue h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <div className="mt-2 text-xs text-gray-500">{Math.round(progress)}%</div>
      </div>
    </div>
  );
}
