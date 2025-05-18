import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  deckId: string;
  dueDate: Date;
  interval: number;
  ease: number;
  reviews: number;
  lastReviewedAt: Date | null;
  emotionTag?: '😎' | '😐' | '😟';
  memoryStrength: number;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  cardCount: number;
  xp: number;
}

interface FlashcardState {
  decks: Deck[];
  cards: Flashcard[];
  currentDeck: string | null;
  studySession: {
    active: boolean;
    currentCard: string | null;
    cardsRemaining: number;
  };
  stats: {
    streak: number;
    totalXP: number;
    reviewsByDifficulty: Record<string, number>;
    emotionTrends: Array<{ date: string; emotion: string }>;
  };
  addDeck: (name: string, description: string, color: string) => void;
  removeDeck: (id: string) => void;
  addCard: (front: string, back: string, deckId: string) => void;
  updateCard: (card: Flashcard) => void;
  startStudySession: (deckId: string) => void;
  recordReview: (cardId: string, difficulty: string, emotion: '😎' | '😐' | '😟') => void;
}

export const useFlashcardStore = create<FlashcardState>((set, get) => ({
  decks: [],
  cards: [],
  currentDeck: null,
  studySession: {
    active: false,
    currentCard: null,
    cardsRemaining: 0,
  },
  stats: {
    streak: 0,
    totalXP: 0,
    reviewsByDifficulty: {},
    emotionTrends: [],
  },

  addDeck: (name, description, color) => {
    const newDeck: Deck = {
      id: uuidv4(),
      name,
      description,
      color,
      createdAt: new Date(),
      updatedAt: new Date(),
      cardCount: 0,
      xp: 0,
    };

    set(state => ({
      decks: [...state.decks, newDeck],
    }));
  },

  removeDeck: (id) => {
    set(state => ({
      decks: state.decks.filter(deck => deck.id !== id),
      cards: state.cards.filter(card => card.deckId !== id),
    }));
  },

  addCard: (front, back, deckId) => {
    const newCard: Flashcard = {
      id: uuidv4(),
      front,
      back,
      deckId,
      dueDate: new Date(),
      interval: 0,
      ease: 2.5,
      reviews: 0,
      lastReviewedAt: null,
      memoryStrength: 0,
    };

    set(state => ({
      cards: [...state.cards, newCard],
      decks: state.decks.map(deck =>
        deck.id === deckId
          ? { ...deck, cardCount: deck.cardCount + 1 }
          : deck
      ),
    }));
  },

  updateCard: (updatedCard) => {
    set(state => ({
      cards: state.cards.map(card =>
        card.id === updatedCard.id ? updatedCard : card
      ),
    }));
  },

  startStudySession: (deckId) => {
    const { cards } = get();
    const dueCards = cards.filter(
      card => card.deckId === deckId && new Date(card.dueDate) <= new Date()
    );

    set({
      currentDeck: deckId,
      studySession: {
        active: true,
        currentCard: dueCards[0]?.id || null,
        cardsRemaining: dueCards.length,
      },
    });
  },

  recordReview: (cardId, difficulty, emotion) => {
    const { cards, stats } = get();
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    // Calculate new memory strength and interval based on difficulty
    const strengthModifier = {
      easy: 0.3,
      medium: 0.2,
      hard: 0.1,
      again: -0.1,
    }[difficulty] || 0;

    const updatedCard = {
      ...card,
      memoryStrength: Math.min(1, Math.max(0, card.memoryStrength + strengthModifier)),
      emotionTag: emotion,
      reviews: card.reviews + 1,
      lastReviewedAt: new Date(),
    };

    // Update stats
    const xpGained = Math.round(strengthModifier * 100);
    const updatedStats = {
      ...stats,
      totalXP: stats.totalXP + xpGained,
      reviewsByDifficulty: {
        ...stats.reviewsByDifficulty,
        [difficulty]: (stats.reviewsByDifficulty[difficulty] || 0) + 1,
      },
      emotionTrends: [
        ...stats.emotionTrends,
        { date: new Date().toISOString(), emotion },
      ],
    };

    set(state => ({
      cards: state.cards.map(c => (c.id === cardId ? updatedCard : c)),
      stats: updatedStats,
    }));
  },
}));