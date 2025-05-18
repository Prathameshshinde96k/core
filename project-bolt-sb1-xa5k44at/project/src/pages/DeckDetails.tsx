import React, { useState } from "react";
import { useFlashcards } from "../context/FlashcardContext";
import Button from "../components/ui/Button";
import CardList from "../components/cards/CardList";
import CardForm from "../components/cards/CardForm";
import { ArrowLeft, Play, Edit, Trash2 } from "lucide-react";

interface DeckDetailsProps {
  deckId: string;
  onBack: () => void;
  onStudy: (deckId: string) => void;
  onEditDeck: (deckId: string) => void;
}

const DeckDetails: React.FC<DeckDetailsProps> = ({ 
  deckId, 
  onBack, 
  onStudy,
  onEditDeck,
}) => {
  const { decks, removeDeck, stats } = useFlashcards();
  const [showAddCard, setShowAddCard] = useState(false);
  const [editCardId, setEditCardId] = useState<string | null>(null);
  
  const deck = decks.find(d => d.id === deckId);
  
  if (!deck) {
    return (
      <div className="p-6 text-center">
        <p>Deck not found.</p>
        <Button variant="primary" onClick={onBack} className="mt-4">
          Go back
        </Button>
      </div>
    );
  }
  
  const handleDeleteDeck = () => {
    if (confirm(`Are you sure you want to delete the deck "${deck.name}"?`)) {
      removeDeck(deckId);
      onBack();
    }
  };
  
  const handleAddCard = () => {
    setShowAddCard(true);
    setEditCardId(null);
  };
  
  const handleEditCard = (cardId: string) => {
    setEditCardId(cardId);
    setShowAddCard(true);
  };
  
  const handleCloseCardForm = () => {
    setShowAddCard(false);
    setEditCardId(null);
  };

  // Calculate ready to study cards for this deck
  const dueCardCount = stats.cardsToReview;
  
  return (
    <>
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          icon={<ArrowLeft size={18} />}
          className="mb-4"
        >
          Back to Decks
        </Button>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {deck.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {deck.description || "No description"}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="primary" 
              onClick={() => onStudy(deckId)}
              icon={<Play size={18} />}
              disabled={deck.cardCount === 0}
            >
              Study Now {dueCardCount > 0 && `(${dueCardCount})`}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => onEditDeck(deckId)}
              icon={<Edit size={18} />}
            >
              Edit
            </Button>
            
            <Button 
              variant="outline" 
              className="text-red-600 hover:text-white hover:bg-red-600 border-red-600"
              onClick={handleDeleteDeck}
              icon={<Trash2 size={18} />}
            >
              Delete
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Cards</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {deck.cardCount}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Due Cards</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {dueCardCount}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {new Date(deck.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      
      {showAddCard ? (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <CardForm 
            deckId={deckId}
            cardId={editCardId || undefined}
            onClose={handleCloseCardForm}
            onSave={handleCloseCardForm}
          />
        </div>
      ) : (
        <CardList 
          deckId={deckId} 
          onAddCard={handleAddCard}
          onEditCard={handleEditCard}
        />
      )}
    </>
  );
};

export default DeckDetails;