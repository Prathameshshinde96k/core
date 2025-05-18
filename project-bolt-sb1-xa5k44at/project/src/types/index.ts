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
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  cardCount: number;
}

export interface ReviewLog {
  id: string;
  cardId: string;
  rating: "again" | "hard" | "medium" | "easy";
  reviewedAt: Date;
}

export interface StudyStats {
  cardsReviewed: number;
  cardsToReview: number;
  reviewsByRating: {
    again: number;
    hard: number;
    medium: number;
    easy: number;
  };
  streak: number;
}

export type ThemeMode = "light" | "dark";