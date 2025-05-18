import React from "react";
import Button from "../ui/Button";

interface FlashcardControlsProps {
  isFlipped: boolean;
  onRating: (rating: "again" | "hard" | "medium" | "easy") => void;
}

const FlashcardControls: React.FC<FlashcardControlsProps> = ({ 
  isFlipped, 
  onRating 
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isFlipped) return;
    
    switch (e.key) {
      case "1":
        onRating("again");
        break;
      case "2":
        onRating("hard");
        break;
      case "3":
        onRating("medium");
        break;
      case "4":
        onRating("easy");
        break;
      default:
        break;
    }
  };

  return (
    <div 
      className="flex flex-col space-y-4"
      onKeyDown={handleKeyDown} 
      tabIndex={0}
    >
      {!isFlipped ? (
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Click the card to reveal the answer
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-2">
            How well did you know this?
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button 
              variant="danger" 
              onClick={() => onRating("again")}
              fullWidth
            >
              Again <span className="ml-1 opacity-60">(1)</span>
            </Button>
            <Button 
              variant="warning" 
              onClick={() => onRating("hard")}
              fullWidth
            >
              Hard <span className="ml-1 opacity-60">(2)</span>
            </Button>
            <Button 
              variant="primary" 
              onClick={() => onRating("medium")}
              fullWidth
            >
              Good <span className="ml-1 opacity-60">(3)</span>
            </Button>
            <Button 
              variant="success" 
              onClick={() => onRating("easy")}
              fullWidth
            >
              Easy <span className="ml-1 opacity-60">(4)</span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default FlashcardControls;