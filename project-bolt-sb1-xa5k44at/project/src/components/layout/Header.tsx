import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { Moon, Sun, Menu } from "lucide-react";
import Button from "../ui/Button";

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="sm:hidden mr-2" 
            onClick={onMenuToggle}
            aria-label="Toggle menu"
            icon={<Menu size={20} />}
          />
          
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Flashcard Master
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            icon={theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;