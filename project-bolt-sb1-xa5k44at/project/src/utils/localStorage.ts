import { Deck, Flashcard, ReviewLog } from "../types";

// Storage keys
const DECKS_KEY = "flashcards_decks";
const CARDS_KEY = "flashcards_cards";
const REVIEW_LOGS_KEY = "flashcards_review_logs";
const THEME_KEY = "flashcards_theme";

// Deck operations
export const getDecks = (): Deck[] => {
  const decks = localStorage.getItem(DECKS_KEY);
  return decks ? JSON.parse(decks) : [];
};

export const saveDeck = (deck: Deck): void => {
  const decks = getDecks();
  const existingIndex = decks.findIndex(d => d.id === deck.id);
  
  if (existingIndex >= 0) {
    decks[existingIndex] = { ...deck, updatedAt: new Date() };
  } else {
    decks.push({ ...deck, createdAt: new Date(), updatedAt: new Date() });
  }
  
  localStorage.setItem(DECKS_KEY, JSON.stringify(decks));
};

export const deleteDeck = (deckId: string): void => {
  let decks = getDecks();
  decks = decks.filter(deck => deck.id !== deckId);
  localStorage.setItem(DECKS_KEY, JSON.stringify(decks));
  
  // Also delete associated cards
  let cards = getCards();
  cards = cards.filter(card => card.deckId !== deckId);
  localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
};

// Card operations
export const getCards = (): Flashcard[] => {
  const cards = localStorage.getItem(CARDS_KEY);
  return cards ? JSON.parse(cards) : [];
};

export const getCardsByDeck = (deckId: string): Flashcard[] => {
  const cards = getCards();
  return cards.filter(card => card.deckId === deckId);
};

export const getCardById = (cardId: string): Flashcard | undefined => {
  const cards = getCards();
  return cards.find(card => card.id === cardId);
};

export const saveCard = (card: Flashcard): void => {
  const cards = getCards();
  const existingIndex = cards.findIndex(c => c.id === card.id);
  
  if (existingIndex >= 0) {
    cards[existingIndex] = card;
  } else {
    cards.push(card);
  }
  
  localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
  
  // Update card count in deck
  updateDeckCardCount(card.deckId);
};

export const deleteCard = (cardId: string): void => {
  const cards = getCards();
  const cardToDelete = cards.find(c => c.id === cardId);
  if (!cardToDelete) return;
  
  const filteredCards = cards.filter(card => card.id !== cardId);
  localStorage.setItem(CARDS_KEY, JSON.stringify(filteredCards));
  
  // Update card count in deck
  updateDeckCardCount(cardToDelete.deckId);
};

const updateDeckCardCount = (deckId: string): void => {
  const decks = getDecks();
  const cards = getCards();
  const deckIndex = decks.findIndex(d => d.id === deckId);
  
  if (deckIndex >= 0) {
    const cardCount = cards.filter(c => c.deckId === deckId).length;
    decks[deckIndex] = { ...decks[deckIndex], cardCount, updatedAt: new Date() };
    localStorage.setItem(DECKS_KEY, JSON.stringify(decks));
  }
};

// Review log operations
export const getReviewLogs = (): ReviewLog[] => {
  const logs = localStorage.getItem(REVIEW_LOGS_KEY);
  return logs ? JSON.parse(logs) : [];
};

export const saveReviewLog = (log: ReviewLog): void => {
  const logs = getReviewLogs();
  logs.push(log);
  localStorage.setItem(REVIEW_LOGS_KEY, JSON.stringify(logs));
};

// Theme operations
export const getTheme = (): string => {
  return localStorage.getItem(THEME_KEY) || "light";
};

export const saveTheme = (theme: string): void => {
  localStorage.setItem(THEME_KEY, theme);
};