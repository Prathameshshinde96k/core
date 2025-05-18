import React from "react";
import { useFlashcards } from "../../context/FlashcardContext";
import CardItem from "./CardItem";
import Button from "../ui/Button";
import { Plus } from "lucide-react";

interface CardListProps {
  deckId: string;
  onAddCard: () => void;
  onEditCard: (cardId: string) => void;
}

const CardList: React.FC<CardListProps> = ({ deckId, onAddCard, onEditCard }) => {
  const { getCardsByDeckId } = useFlashcards();
  const cards = getCardsByDeckId(deckId);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Cards</h3>
        <Button 
          variant="primary" 
          onClick={onAddCard}
          icon={<Plus size={18} />}
        >
          Add Card
        </Button>
      </div>
      
      {cards.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            There are no cards in this deck yet.
          </p>
          <Button 
            variant="primary" 
            onClick={onAddCard}
            icon={<Plus size={18} />}
          >
            Add Your First Card
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {cards.map(card => (
            <CardItem 
              key={card.id} 
              card={card} 
              onEdit={() => onEditCard(card.id)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CardList;