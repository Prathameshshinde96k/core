import React from "react";
import { Flashcard } from "../../types";

interface FlashcardCardProps {
  card: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
}

const FlashcardCard: React.FC<FlashcardCardProps> = ({ card, isFlipped, onFlip }) => {
  return (
    <div 
      className="w-full max-w-xl h-64 sm:h-80 perspective-1000 cursor-pointer"
      onClick={onFlip}
    >
      <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`}>
        {/* Front of card */}
        <div 
          className={`absolute w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col backface-hidden ${
            isFlipped ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="flex-1 flex items-center justify-center overflow-auto">
            <div className="text-center">
              <p className="text-xl font-medium text-gray-800 dark:text-white">{card.front}</p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Click to reveal answer</p>
          </div>
        </div>
        
        {/* Back of card */}
        <div 
          className={`absolute w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col rotate-y-180 backface-hidden ${
            isFlipped ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex-1 flex items-center justify-center overflow-auto">
            <div className="text-center">
              <p className="text-xl font-medium text-gray-800 dark:text-white">{card.back}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardCard;