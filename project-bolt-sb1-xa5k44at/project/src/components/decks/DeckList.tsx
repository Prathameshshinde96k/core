import React from "react";
import { useFlashcards } from "../../context/FlashcardContext";
import DeckCard from "./DeckCard";
import { Plus } from "lucide-react";
import Button from "../ui/Button";

interface DeckListProps {
  onSelectDeck: (deckId: string) => void;
  onAddDeck: () => void;
  onEditDeck: (deckId: string) => void;
}

const DeckList: React.FC<DeckListProps> = ({ 
  onSelectDeck, 
  onAddDeck,
  onEditDeck,
}) => {
  const { decks } = useFlashcards();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Decks</h2>
        <Button 
          variant="primary" 
          onClick={onAddDeck}
          icon={<Plus size={18} />}
        >
          Add Deck
        </Button>
      </div>
      
      {decks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300 mb-4">You don't have any decks yet.</p>
          <Button 
            variant="primary" 
            onClick={onAddDeck}
            icon={<Plus size={18} />}
          >
            Create Your First Deck
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map(deck => (
            <DeckCard 
              key={deck.id} 
              deck={deck} 
              onSelect={() => onSelectDeck(deck.id)}
              onEdit={() => onEditDeck(deck.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DeckList;