import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import motivationalTipsData from '@/data/motivational-tips.json';

export function DeveloperMessage() {
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    // Get current week of year to cycle through messages
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const weekOfYear = Math.floor(diff / (oneDay * 7));
    
    const weeklyMessages = motivationalTipsData.weeklyMessages;
    const messageIndex = weekOfYear % weeklyMessages.length;
    setCurrentMessage(weeklyMessages[messageIndex].message);
  }, []);

  return (
    <motion.div 
      className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-600"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <div className="flex items-center space-x-3 mb-3">
        <motion.div 
          className="w-8 h-8 bg-neon-green rounded-full flex items-center justify-center"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <span className="text-dark-bg font-bold text-sm">M</span>
        </motion.div>
        <div>
          <div className="font-semibold text-white">Weekly Message</div>
          <div className="text-xs text-gray-400">From Moeed Mirza</div>
        </div>
      </div>
      
      <motion.blockquote 
        className="text-gray-200 font-amiri italic mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        "{currentMessage || 'Tu mehnat kar. Taqdeer ka rona chhod. Allah se umeed rakh aur body banane mein consistency dikhao.'}"
      </motion.blockquote>
      
      <div className="text-xs text-gray-500 flex items-center justify-between">
        <span>Built with 💪 by Moeed Mirza</span>
        <span>Zylox 2025</span>
      </div>
    </motion.div>
  );
}
