import React, { useState, useEffect } from "react";
import { useFlashcards } from "../../context/FlashcardContext";
import Button from "../ui/Button";
import { X } from "lucide-react";

interface CardFormProps {
  deckId: string;
  cardId?: string;
  onClose: () => void;
  onSave: () => void;
}

const CardForm: React.FC<CardFormProps> = ({ 
  deckId, 
  cardId, 
  onClose, 
  onSave 
}) => {
  const { cards, createCard, updateCard } = useFlashcards();
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  
  const isEditMode = Boolean(cardId);
  
  useEffect(() => {
    if (cardId) {
      const card = cards.find(c => c.id === cardId);
      if (card) {
        setFront(card.front);
        setBack(card.back);
      }
    }
  }, [cardId, cards]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!front.trim() || !back.trim()) return;
    
    if (isEditMode && cardId) {
      const card = cards.find(c => c.id === cardId);
      if (card) {
        updateCard({
          ...card,
          front,
          back,
        });
      }
    } else {
      createCard(front, back, deckId);
    }
    
    onSave();
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {isEditMode ? "Edit Card" : "Add New Card"}
        </h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label 
            htmlFor="front" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Question (Front)
          </label>
          <textarea
            id="front"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter the question or front side of the card"
            required
          />
        </div>
        
        <div className="mb-6">
          <label 
            htmlFor="back" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Answer (Back)
          </label>
          <textarea
            id="back"
            value={back}
            onChange={(e) => setBack(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter the answer or back side of the card"
            required
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {isEditMode ? "Save Changes" : "Add Card"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CardForm;