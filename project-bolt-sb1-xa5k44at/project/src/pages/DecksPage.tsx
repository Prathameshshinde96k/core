import React from "react";
import DeckList from "../components/decks/DeckList";

interface DecksPageProps {
  onSelectDeck: (deckId: string) => void;
  onAddDeck: () => void;
  onEditDeck: (deckId: string) => void;
}

const DecksPage: React.FC<DecksPageProps> = ({ 
  onSelectDeck, 
  onAddDeck,
  onEditDeck,
}) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Your Flashcard Decks
      </h1>
      
      <DeckList 
        onSelectDeck={onSelectDeck} 
        onAddDeck={onAddDeck} 
        onEditDeck={onEditDeck} 
      />
    </div>
  );
};

export default DecksPage;