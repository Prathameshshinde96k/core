import React, { useState } from "react";
import { Flashcard } from "../../types";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { Edit, Trash2 } from "lucide-react";
import { useFlashcards } from "../../context/FlashcardContext";

interface CardItemProps {
  card: Flashcard;
  onEdit: () => void;
}

const CardItem: React.FC<CardItemProps> = ({ card, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { removeCard } = useFlashcards();
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (confirm("Are you sure you want to delete this card?")) {
      removeCard(card.id);
    }
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };
  
  const daysUntilDue = () => {
    const now = new Date();
    const dueDate = new Date(card.dueDate);
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Due today";
    return `Due in ${diffDays} day${diffDays === 1 ? "" : "s"}`;
  };
  
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={toggleExpand}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="font-medium text-gray-800 dark:text-white">
              {card.front}
            </p>
            
            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Answer:</p>
                <p className="text-gray-800 dark:text-white">{card.back}</p>
              </div>
            )}
          </div>
          
          <div className="flex items-center ml-4">
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 mr-3">
              {daysUntilDue()}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
              onClick={handleEdit}
              icon={<Edit size={16} />}
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200 p-1 ml-1"
              onClick={handleDelete}
              icon={<Trash2 size={16} />}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CardItem;