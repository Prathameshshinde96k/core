import React, { createContext, useState, useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Deck, Flashcard, ReviewLog, StudyStats } from "../types";
import { 
  getDecks, saveDeck, deleteDeck,
  getCards, getCardsByDeck, saveCard, deleteCard,
  getReviewLogs, saveReviewLog
} from "../utils/localStorage";
import { calculateNextReview, calculateStudyStats } from "../utils/spacedRepetition";

interface FlashcardContextType {
  decks: Deck[];
  cards: Flashcard[];
  stats: StudyStats;
  currentDeck: Deck | null;
  studyCards: Flashcard[];
  createDeck: (name: string, description: string) => Deck;
  updateDeck: (deck: Deck) => void;
  removeDeck: (deckId: string) => void;
  selectDeck: (deckId: string) => void;
  createCard: (front: string, back: string, deckId: string) => Flashcard;
  updateCard: (card: Flashcard) => void;
  removeCard: (cardId: string) => void;
  startStudySession: (deckId: string) => void;
  reviewCard: (cardId: string, rating: "again" | "hard" | "medium" | "easy") => void;
  getCardsByDeckId: (deckId: string) => Flashcard[];
}

const FlashcardContext = createContext<FlashcardContextType>({
  decks: [],
  cards: [],
  stats: {
    cardsReviewed: 0,
    cardsToReview: 0,
    reviewsByRating: { again: 0, hard: 0, medium: 0, easy: 0 },
    streak: 0,
  },
  currentDeck: null,
  studyCards: [],
  createDeck: () => ({ id: "", name: "", description: "", createdAt: new Date(), updatedAt: new Date(), cardCount: 0 }),
  updateDeck: () => {},
  removeDeck: () => {},
  selectDeck: () => {},
  createCard: () => ({ 
    id: "", 
    front: "", 
    back: "", 
    deckId: "", 
    dueDate: new Date(), 
    interval: 0, 
    ease: 2.5, 
    reviews: 0, 
    lastReviewedAt: null 
  }),
  updateCard: () => {},
  removeCard: () => {},
  startStudySession: () => {},
  reviewCard: () => {},
  getCardsByDeckId: () => [],
});

export const useFlashcards = () => useContext(FlashcardContext);

export const FlashcardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [reviewLogs, setReviewLogs] = useState<ReviewLog[]>([]);
  const [currentDeck, setCurrentDeck] = useState<Deck | null>(null);
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [stats, setStats] = useState<StudyStats>({
    cardsReviewed: 0,
    cardsToReview: 0,
    reviewsByRating: { again: 0, hard: 0, medium: 0, easy: 0 },
    streak: 0,
  });

  // Load data from localStorage on initial load
  useEffect(() => {
    setDecks(getDecks());
    setCards(getCards());
    setReviewLogs(getReviewLogs());
  }, []);

  // Update stats whenever cards or review logs change
  useEffect(() => {
    const updatedStats = calculateStudyStats(cards, reviewLogs);
    setStats(updatedStats);
  }, [cards, reviewLogs]);

  // Deck operations
  const createDeck = (name: string, description: string): Deck => {
    const newDeck: Deck = {
      id: uuidv4(),
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      cardCount: 0,
    };
    
    saveDeck(newDeck);
    setDecks([...decks, newDeck]);
    return newDeck;
  };

  const updateDeck = (updatedDeck: Deck): void => {
    const newDecks = decks.map(deck => 
      deck.id === updatedDeck.id ? { ...updatedDeck, updatedAt: new Date() } : deck
    );
    
    saveDeck(updatedDeck);
    setDecks(newDecks);
    
    if (currentDeck?.id === updatedDeck.id) {
      setCurrentDeck({ ...updatedDeck, updatedAt: new Date() });
    }
  };

  const removeDeck = (deckId: string): void => {
    deleteDeck(deckId);
    setDecks(decks.filter(deck => deck.id !== deckId));
    
    if (currentDeck?.id === deckId) {
      setCurrentDeck(null);
    }
    
    setCards(cards.filter(card => card.deckId !== deckId));
  };

  const selectDeck = (deckId: string): void => {
    const deck = decks.find(d => d.id === deckId) || null;
    setCurrentDeck(deck);
  };

  // Card operations
  const createCard = (front: string, back: string, deckId: string): Flashcard => {
    const newCard: Flashcard = {
      id: uuidv4(),
      front,
      back,
      deckId,
      dueDate: new Date(), // Due immediately
      interval: 0,
      ease: 2.5, // Default ease factor
      reviews: 0,
      lastReviewedAt: null,
    };
    
    saveCard(newCard);
    setCards([...cards, newCard]);
    
    // Update deck card count
    const deckToUpdate = decks.find(d => d.id === deckId);
    if (deckToUpdate) {
      const updatedDeck = { 
        ...deckToUpdate, 
        cardCount: deckToUpdate.cardCount + 1,
        updatedAt: new Date()
      };
      updateDeck(updatedDeck);
    }
    
    return newCard;
  };

  const updateCard = (updatedCard: Flashcard): void => {
    const newCards = cards.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    );
    
    saveCard(updatedCard);
    setCards(newCards);
  };

  const removeCard = (cardId: string): void => {
    const cardToDelete = cards.find(card => card.id === cardId);
    if (!cardToDelete) return;
    
    deleteCard(cardId);
    setCards(cards.filter(card => card.id !== cardId));
    
    // Update deck card count
    const deckToUpdate = decks.find(d => d.id === cardToDelete.deckId);
    if (deckToUpdate) {
      const updatedDeck = { 
        ...deckToUpdate, 
        cardCount: Math.max(0, deckToUpdate.cardCount - 1),
        updatedAt: new Date()
      };
      updateDeck(updatedDeck);
    }
  };

  // Study session operations
  const startStudySession = (deckId: string): void => {
    selectDeck(deckId);
    
    // Get due cards for the selected deck
    const deckCards = cards.filter(card => card.deckId === deckId);
    const dueCards = deckCards.filter(card => new Date(card.dueDate) <= new Date());
    
    // Shuffle cards for study session
    const shuffled = [...dueCards].sort(() => Math.random() - 0.5);
    setStudyCards(shuffled);
  };

  const reviewCard = (cardId: string, rating: "again" | "hard" | "medium" | "easy"): void => {
    const cardIndex = cards.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return;
    
    const card = cards[cardIndex];
    
    // Calculate new card parameters based on rating
    const { dueDate, interval, ease } = calculateNextReview(card, rating);
    
    // Update card with new parameters
    const updatedCard: Flashcard = {
      ...card,
      dueDate,
      interval,
      ease,
      reviews: card.reviews + 1,
      lastReviewedAt: new Date(),
    };
    
    // Save updated card
    updateCard(updatedCard);
    
    // Log the review
    const reviewLog: ReviewLog = {
      id: uuidv4(),
      cardId,
      rating,
      reviewedAt: new Date(),
    };
    
    saveReviewLog(reviewLog);
    setReviewLogs([...reviewLogs, reviewLog]);
    
    // Remove the card from the study session
    setStudyCards(studyCards.filter(c => c.id !== cardId));
  };

  const getCardsByDeckId = (deckId: string): Flashcard[] => {
    return cards.filter(card => card.deckId === deckId);
  };

  return (
    <FlashcardContext.Provider
      value={{
        decks,
        cards,
        stats,
        currentDeck,
        studyCards,
        createDeck,
        updateDeck,
        removeDeck,
        selectDeck,
        createCard,
        updateCard,
        removeCard,
        startStudySession,
        reviewCard,
        getCardsByDeckId,
      }}
    >
      {children}
    </FlashcardContext.Provider>
  );
};