import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlashcardStore } from '../../store/flashcardStore';
import { Brain, Sparkles, Zap } from 'lucide-react';

const FlashcardView: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { currentCard, recordReview } = useFlashcardStore();
  const [selectedEmotion, setSelectedEmotion] = useState<'😎' | '😐' | '😟' | null>(null);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleReview = (difficulty: string) => {
    if (!currentCard || !selectedEmotion) return;
    recordReview(currentCard.id, difficulty, selectedEmotion);
    setIsFlipped(false);
    setSelectedEmotion(null);
  };

  if (!currentCard) return null;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <Brain className="text-purple-500" size={24} />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Memory Training
          </h2>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full">
          <div 
            className="bg-white h-full rounded-full transition-all duration-300"
            style={{ width: `${currentCard.memoryStrength * 100}%` }}
          />
        </div>
      </div>

      <motion.div
        className="relative h-96 w-full perspective-1000"
        onClick={handleFlip}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isFlipped ? 'back' : 'front'}
            initial={{ rotateY: isFlipped ? -180 : 0, opacity: 0 }}
            animate={{ rotateY: isFlipped ? 0 : 180, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition-shadow"
          >
            <div className="text-center">
              <Sparkles className="text-yellow-500 mb-4 mx-auto" size={32} />
              <p className="text-xl text-gray-800 dark:text-white">
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="mt-8">
        <div className="flex justify-center space-x-4 mb-6">
          {(['😎', '😐', '😟'] as const).map((emotion) => (
            <button
              key={emotion}
              onClick={() => setSelectedEmotion(emotion)}
              className={`text-3xl p-2 rounded-full transition-transform ${
                selectedEmotion === emotion
                  ? 'transform scale-125 shadow-lg'
                  : 'opacity-50 hover:opacity-100'
              }`}
            >
              {emotion}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Again', color: 'bg-red-500', key: '1' },
            { label: 'Hard', color: 'bg-yellow-500', key: '2' },
            { label: 'Good', color: 'bg-blue-500', key: '3' },
            { label: 'Easy', color: 'bg-green-500', key: '4' },
          ].map((button) => (
            <button
              key={button.label}
              onClick={() => handleReview(button.label.toLowerCase())}
              disabled={!selectedEmotion}
              className={`${button.color} text-white py-3 px-6 rounded-lg font-medium 
                flex items-center justify-center space-x-2
                ${!selectedEmotion ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
              `}
            >
              <span>{button.label}</span>
              <span className="text-sm opacity-75">({button.key})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <Zap size={16} className="text-yellow-500" />
        <span>Earning potential: +10-30 XP</span>
      </div>
    </div>
  );
};

export default FlashcardView;