import React from "react";
import StatsDashboard from "../components/stats/StatsDashboard";
import DeckList from "../components/decks/DeckList";

interface DashboardProps {
  onSelectDeck: (deckId: string) => void;
  onAddDeck: () => void;
  onEditDeck: (deckId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  onSelectDeck, 
  onAddDeck, 
  onEditDeck 
}) => {
  return (
    <div className="space-y-10">
      <StatsDashboard className="mb-10" />
      
      <DeckList 
        onSelectDeck={onSelectDeck} 
        onAddDeck={onAddDeck} 
        onEditDeck={onEditDeck} 
      />
    </div>
  );
};

export default Dashboard;