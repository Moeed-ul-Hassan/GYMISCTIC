import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import islamicQuotesData from '@/data/islamic-quotes.json';
import { IslamicQuote } from '@shared/schema';

export function IslamicQuoteCard() {
  const [currentQuote, setCurrentQuote] = useState<IslamicQuote | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    // Load a random quote on mount
    const quotes = islamicQuotesData.quotes as IslamicQuote[];
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
    setQuoteIndex(randomIndex);
  }, []);

  const nextQuote = () => {
    const quotes = islamicQuotesData.quotes as IslamicQuote[];
    const nextIndex = (quoteIndex + 1) % quotes.length;
    setCurrentQuote(quotes[nextIndex]);
    setQuoteIndex(nextIndex);
  };

  if (!currentQuote) return null;

  const getCategoryDisplay = (category: string) => {
    const categories = {
      sabr: 'Patience',
      effort: 'Effort',
      rizq: 'Sustenance',
      nafs: 'Self Control',
      strength: 'Strength',
      shukar: 'Gratitude'
    };
    return categories[category as keyof typeof categories] || category;
  };

  return (
    <motion.div 
      className="bg-gradient-to-r from-card-bg to-card-bg/80 rounded-2xl p-6 border border-neon-purple/30 neon-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <i className="fas fa-mosque text-neon-purple"></i>
          <span className="text-sm text-neon-purple font-semibold">Daily Motivation</span>
        </div>
        <span className="text-xs bg-neon-purple/20 px-2 py-1 rounded-full text-neon-purple">
          {getCategoryDisplay(currentQuote.category)}
        </span>
      </div>
      
      <motion.blockquote 
        className="font-amiri text-lg mb-3 text-gray-100"
        key={currentQuote.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        "{currentQuote.text}"
      </motion.blockquote>
      
      <p className="text-sm text-gray-400 font-light mb-4">
        {currentQuote.translation}
      </p>
      
      <div className="flex justify-between items-center">
        <motion.button 
          className="text-xs text-neon-purple hover:text-white transition-colors"
          onClick={nextQuote}
          whileTap={{ scale: 0.95 }}
        >
          <i className="fas fa-sync-alt mr-1"></i> Next Quote
        </motion.button>
        <div className="text-xs text-gray-500">
          Category: {getCategoryDisplay(currentQuote.category)}
        </div>
      </div>
    </motion.div>
  );
}
