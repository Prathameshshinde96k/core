import { Flashcard } from "../types";

// SM-2 algorithm constants
const MINIMUM_INTERVAL = 1; // 1 day
const MAXIMUM_INTERVAL = 365; // 365 days
const EASE_BONUS = 1.3;
const EASE_PENALTY = 0.15;

// Rating factors
const RATING_FACTORS = {
  again: 0, // Reset interval
  hard: 1.2,
  medium: 1.8,
  easy: 2.5,
};

// Calculate next review date based on SM-2 algorithm
export function calculateNextReview(
  card: Flashcard,
  rating: "again" | "hard" | "medium" | "easy"
): { dueDate: Date; interval: number; ease: number } {
  // Initialize or update interval and ease factor
  let { interval, ease } = card;
  const now = new Date();

  // Adjust ease based on rating
  if (rating === "again") {
    ease = Math.max(1.3, ease - EASE_PENALTY * 2);
  } else if (rating === "hard") {
    ease = Math.max(1.3, ease - EASE_PENALTY);
  } else if (rating === "easy") {
    ease = Math.min(2.5, ease + EASE_BONUS);
  }

  // Calculate new interval based on rating
  if (rating === "again") {
    interval = MINIMUM_INTERVAL; // Reset to 1 day
  } else {
    // If it's the first review or was reset by "again"
    if (interval <= MINIMUM_INTERVAL) {
      interval = RATING_FACTORS[rating]; // 1-2.5 days based on rating
    } else {
      interval = Math.min(MAXIMUM_INTERVAL, Math.round(interval * RATING_FACTORS[rating] * ease));
    }
  }

  // Calculate due date
  const dueDate = new Date(now);
  dueDate.setDate(dueDate.getDate() + interval);

  return { dueDate, interval, ease };
}

// Get cards due for review
export function getDueCards(cards: Flashcard[]): Flashcard[] {
  const now = new Date();
  return cards.filter((card) => new Date(card.dueDate) <= now);
}

// Calculate study statistics
export function calculateStudyStats(cards: Flashcard[], logs: ReviewLog[]): StudyStats {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const dueCards = cards.filter(card => new Date(card.dueDate) <= now);
  const todayLogs = logs.filter(log => new Date(log.reviewedAt) >= today);
  
  const reviewsByRating = {
    again: todayLogs.filter(log => log.rating === "again").length,
    hard: todayLogs.filter(log => log.rating === "hard").length,
    medium: todayLogs.filter(log => log.rating === "medium").length,
    easy: todayLogs.filter(log => log.rating === "easy").length,
  };
  
  // Calculate streak (simplified version)
  // In a real app, would need to check consecutive days
  const streak = hasReviewedToday(todayLogs) ? 1 : 0;
  
  return {
    cardsReviewed: todayLogs.length,
    cardsToReview: dueCards.length,
    reviewsByRating,
    streak,
  };
}

function hasReviewedToday(todayLogs: ReviewLog[]): boolean {
  return todayLogs.length > 0;
}

// Define ReviewLog type for this file
interface ReviewLog {
  id: string;
  cardId: string;
  rating: "again" | "hard" | "medium" | "easy";
  reviewedAt: Date;
}