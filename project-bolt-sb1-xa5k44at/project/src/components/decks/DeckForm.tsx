import React, { useState, useEffect } from "react";
import { useFlashcards } from "../../context/FlashcardContext";
import Button from "../ui/Button";
import { X } from "lucide-react";

interface DeckFormProps {
  deckId?: string;
  onClose: () => void;
  onSave: () => void;
}

const DeckForm: React.FC<DeckFormProps> = ({ deckId, onClose, onSave }) => {
  const { decks, createDeck, updateDeck } = useFlashcards();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  const isEditMode = Boolean(deckId);
  
  useEffect(() => {
    if (deckId) {
      const deck = decks.find(d => d.id === deckId);
      if (deck) {
        setName(deck.name);
        setDescription(deck.description);
      }
    }
  }, [deckId, decks]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    if (isEditMode && deckId) {
      const deck = decks.find(d => d.id === deckId);
      if (deck) {
        updateDeck({
          ...deck,
          name,
          description,
        });
      }
    } else {
      createDeck(name, description);
    }
    
    onSave();
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {isEditMode ? "Edit Deck" : "Create New Deck"}
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
            htmlFor="name" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Deck Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter deck name"
            required
          />
        </div>
        
        <div className="mb-6">
          <label 
            htmlFor="description" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter deck description (optional)"
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {isEditMode ? "Save Changes" : "Create Deck"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DeckForm;