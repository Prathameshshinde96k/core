import React from "react";
import { Deck } from "../../types";
import Card, { CardContent, CardFooter } from "../ui/Card";
import { Calendar, Edit, Clock } from "lucide-react";
import Button from "../ui/Button";

interface DeckCardProps {
  deck: Deck;
  onSelect: () => void;
  onEdit: () => void;
}

const DeckCard: React.FC<DeckCardProps> = ({ deck, onSelect, onEdit }) => {
  const formattedDate = new Date(deck.updatedAt).toLocaleDateString();
  
  return (
    <Card className="h-full flex flex-col" hoverable>
      <CardContent className="flex-1" onClick={onSelect}>
        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
          {deck.name}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {deck.description || "No description"}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
          <Calendar size={16} className="mr-2" />
          <span>Last updated: {formattedDate}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Clock size={16} className="mr-2" />
          <span>{deck.cardCount} {deck.cardCount === 1 ? "card" : "cards"}</span>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-gray-200 dark:border-gray-700 flex justify-between">
        <Button variant="primary" onClick={onSelect}>
          Study
        </Button>
        <Button variant="outline" onClick={onEdit} icon={<Edit size={16} />}>
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeckCard;