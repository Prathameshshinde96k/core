import React, { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { FlashcardProvider } from "./context/FlashcardContext";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import DeckDetails from "./pages/DeckDetails";
import DecksPage from "./pages/DecksPage";
import StatsPage from "./pages/StatsPage";
import DeckForm from "./components/decks/DeckForm";
import FlashcardView from "./components/flashcards/FlashcardView";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showDeckForm, setShowDeckForm] = useState(false);
  const [editDeckId, setEditDeckId] = useState<string | null>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleAddDeck = () => {
    setShowDeckForm(true);
    setEditDeckId(null);
  };

  const handleEditDeck = (deckId: string) => {
    setEditDeckId(deckId);
    setShowDeckForm(true);
  };

  const handleCloseDeckForm = () => {
    setShowDeckForm(false);
    setEditDeckId(null);
  };

  const handleSelectDeck = (deckId: string) => {
    setActiveTab(`deck-${deckId}`);
  };

  const handleStudyDeck = (deckId: string) => {
    setActiveTab(`study-${deckId}`);
  };

  const handleBackToDecks = () => {
    setActiveTab("decks");
  };

  // Extract deck ID from activeTab if it starts with 'deck-' or 'study-'
  const getDeckIdFromTab = () => {
    if (activeTab.startsWith("deck-")) {
      return activeTab.replace("deck-", "");
    }
    if (activeTab.startsWith("study-")) {
      return activeTab.replace("study-", "");
    }
    return "";
  };

  const renderContent = () => {
    // Show deck form modal if needed
    if (showDeckForm) {
      return (
        <div className="max-w-2xl mx-auto mt-6">
          <DeckForm
            deckId={editDeckId || undefined}
            onClose={handleCloseDeckForm}
            onSave={handleCloseDeckForm}
          />
        </div>
      );
    }

    // Show main content
    if (activeTab === "dashboard") {
      return (
        <Dashboard
          onSelectDeck={handleSelectDeck}
          onAddDeck={handleAddDeck}
          onEditDeck={handleEditDeck}
        />
      );
    }

    if (activeTab === "decks") {
      return (
        <DecksPage
          onSelectDeck={handleSelectDeck}
          onAddDeck={handleAddDeck}
          onEditDeck={handleEditDeck}
        />
      );
    }

    if (activeTab === "stats") {
      return <StatsPage />;
    }

    if (activeTab.startsWith("deck-")) {
      return (
        <DeckDetails
          deckId={getDeckIdFromTab()}
          onBack={handleBackToDecks}
          onStudy={handleStudyDeck}
          onEditDeck={handleEditDeck}
        />
      );
    }

    if (activeTab.startsWith("study-")) {
      return (
        <FlashcardView
          deckId={getDeckIdFromTab()}
          onBack={() => setActiveTab(`deck-${getDeckIdFromTab()}`)}
        />
      );
    }

    return <Dashboard onSelectDeck={handleSelectDeck} onAddDeck={handleAddDeck} onEditDeck={handleEditDeck} />;
  };

  return (
    <ThemeProvider>
      <FlashcardProvider>
        <Layout
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onAddDeck={handleAddDeck}
        >
          {renderContent()}
        </Layout>
      </FlashcardProvider>
    </ThemeProvider>
  );
}

export default App;