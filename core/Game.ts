import { Tree } from './Tree';
import { PrimeUtils } from './PrimeUtils';

/**
 * Game logic for PrimeTimeGame
 */
export class Game {
  private level: number; // 1-10, determines range
  private rounds: number; // Total rounds to play
  private currentRound: number; // Current round number
  private score: number; // Current score
  private currentInteger: number; // Current integer to guess
  private currentTree: Tree; // Current tree
  private answerShown: boolean; // Whether answer has been revealed

  // Level ranges: level 1 is 1-2, level 2 is 1-4, etc.
  private levelRanges: Map<number, [number, number]>;

  constructor(level: number = 1, rounds: number = 10) {
    this.level = Math.max(1, Math.min(10, level)); // Clamp to 1-10
    this.rounds = Math.max(1, rounds);
    this.currentRound = 1;
    this.score = 0;
    this.answerShown = false;

    // Initialize level ranges
    this.levelRanges = new Map();
    for (let i = 1; i <= 10; i++) {
      const max = Math.pow(2, i);
      this.levelRanges.set(i, [1, max]);
    }

    // Generate first integer
    this.currentInteger = this.generateRandomInteger();
    this.currentTree = Tree.fromInteger(this.currentInteger);
  }

  /**
   * Get the level (1-10)
   */
  getLevel(): number {
    return this.level;
  }

  /**
   * Get total rounds
   */
  getTotalRounds(): number {
    return this.rounds;
  }

  /**
   * Get current round number
   */
  getCurrentRound(): number {
    return this.currentRound;
  }

  /**
   * Get current score
   */
  getScore(): number {
    return this.score;
  }

  /**
   * Get the current integer to guess
   */
  getCurrentInteger(): number {
    return this.currentInteger;
  }

  /**
   * Get the current tree
   */
  getCurrentTree(): Tree {
    return this.currentTree;
  }

  /**
   * Get the range for current level
   */
  getLevelRange(): [number, number] {
    return this.levelRanges.get(this.level) || [1, 1024];
  }

  /**
   * Check if game is over
   */
  isGameOver(): boolean {
    return this.currentRound > this.rounds;
  }

  /**
   * Submit an answer
   * Returns true if correct, false if incorrect
   */
  submitAnswer(answer: number): boolean {
    if (this.isGameOver()) {
      throw new Error('Game is over');
    }

    const correct = answer === this.currentInteger;

    if (correct) {
      this.score += 1;
    } else {
      this.score -= 1;
    }

    this.answerShown = true;

    return correct;
  }

  /**
   * Move to next round
   */
  nextRound(): void {
    if (!this.answerShown) {
      throw new Error('Must submit answer before moving to next round');
    }

    if (this.currentRound < this.rounds) {
      this.currentRound += 1;
      this.currentInteger = this.generateRandomInteger();
      this.currentTree = Tree.fromInteger(this.currentInteger);
      this.answerShown = false;
    }
  }

  /**
   * Get final score
   */
  getFinalScore(): number {
    if (!this.isGameOver()) {
      throw new Error('Game is not over');
    }
    return this.score;
  }

  /**
   * Generate a random integer within the level range
   */
  private generateRandomInteger(): number {
    const [min, max] = this.getLevelRange();
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Reset game
   */
  reset(): void {
    this.currentRound = 1;
    this.score = 0;
    this.answerShown = false;
    this.currentInteger = this.generateRandomInteger();
    this.currentTree = Tree.fromInteger(this.currentInteger);
  }

  /**
   * Get hint: helps narrow down the answer
   */
  getHint(): string {
    const height = this.currentTree.getHeight();
    const width = this.currentTree.getWidth();
    const nodeCount = this.currentTree.getNodeCount();

    return `Tree height: ${height}, width: ${width}, nodes: ${nodeCount}`;
  }

  /**
   * Get all statistics
   */
  getStats(): {
    level: number;
    totalRounds: number;
    currentRound: number;
    score: number;
    isGameOver: boolean;
  } {
    return {
      level: this.level,
      totalRounds: this.rounds,
      currentRound: this.currentRound,
      score: this.score,
      isGameOver: this.isGameOver(),
    };
  }
}
