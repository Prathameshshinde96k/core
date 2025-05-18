import React from "react";
import { useFlashcards } from "../../context/FlashcardContext";
import { 
  LayoutDashboard, 
  Book, 
  BarChart2, 
  Plus
} from "lucide-react";
import Button from "../ui/Button";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddDeck: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  onAddDeck,
  isOpen,
  onClose,
}) => {
  const { decks } = useFlashcards();
  
  const handleTabClick = (tab: string) => {
    onTabChange(tab);
    onClose(); // Close sidebar on mobile when a tab is selected
  };
  
  return (
    <div className={`
      fixed inset-y-0 left-0 z-50 
      w-64 bg-white dark:bg-gray-900 shadow-lg 
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
      sm:static sm:z-0
    `}>
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Flashcard Master
        </h1>
      </div>
      
      <div className="p-4">
        <Button 
          variant="primary" 
          fullWidth
          icon={<Plus size={18} />}
          onClick={onAddDeck}
        >
          New Deck
        </Button>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          <NavItem 
            label="Dashboard" 
            icon={<LayoutDashboard size={18} />} 
            isActive={activeTab === "dashboard"} 
            onClick={() => handleTabClick("dashboard")} 
          />
          
          <NavItem 
            label="Decks" 
            icon={<Book size={18} />} 
            isActive={activeTab === "decks"} 
            onClick={() => handleTabClick("decks")} 
          />
          
          <NavItem 
            label="Statistics" 
            icon={<BarChart2 size={18} />} 
            isActive={activeTab === "stats"} 
            onClick={() => handleTabClick("stats")} 
          />
        </ul>
      </nav>
      
      {decks.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
            Your Decks
          </h3>
          <ul className="space-y-1">
            {decks.slice(0, 5).map(deck => (
              <li key={deck.id}>
                <button
                  className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  onClick={() => {
                    handleTabClick("deck-details");
                    onTabChange(`deck-${deck.id}`);
                  }}
                >
                  {deck.name}
                </button>
              </li>
            ))}
            
            {decks.length > 5 && (
              <li className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                + {decks.length - 5} more
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ 
  label, 
  icon, 
  isActive, 
  onClick 
}) => {
  return (
    <li>
      <button
        className={`
          w-full flex items-center px-3 py-2 rounded-md
          ${isActive 
            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:bg-opacity-50 dark:text-blue-400" 
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}
        `}
        onClick={onClick}
      >
        <span className="mr-3">{icon}</span>
        {label}
      </button>
    </li>
  );
};

export default Sidebar;