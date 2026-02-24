import { PrimeUtils } from './PrimeUtils';

/**
 * Represents a rooted tree node in the bijection
 */
export class Tree {
  readonly value: number; // The integer this tree represents
  readonly subtrees: Tree[]; // Child subtrees
  private heightCache: number = -1;
  private widthCache: number = -1;

  // Cache of computed trees
  private static cache = new Map<number, Tree>();

  constructor(value: number, subtrees: Tree[] = []) {
    this.value = value;
    this.subtrees = subtrees.length > 0 ? [...subtrees] : [];
  }

  /**
   * Initialize with first n primes
   */
  static initialize(primeCount: number = 1000): void {
    PrimeUtils.initialize(primeCount);
    this.cache.clear();
  }

  /**
   * Get or create tree for a given positive integer
   * Implements the bijection: integer -> tree
   */
  static fromInteger(n: number): Tree {
    if (n < 1) throw new Error('n must be a positive integer');

    // Check cache
    if (this.cache.has(n)) {
      return this.cache.get(n)!;
    }

    let tree: Tree;

    if (n === 1) {
      // Base case: 1 maps to single root
      tree = new Tree(1, []);
    } else {
      // Recursive case: get prime factorization
      const factors = PrimeUtils.factorize(n);

      // Create subtrees from prime ranks
      const subtrees: Tree[] = [];
      for (const prime of factors) {
        const rank = PrimeUtils.getRank(prime);
        subtrees.push(this.fromInteger(rank));
      }

      tree = new Tree(n, subtrees);
    }

    this.cache.set(n, tree);
    return tree;
  }

  /**
   * Convert tree back to integer
   * Implements the bijection: tree -> integer
   */
  toInteger(): number {
    if (this.subtrees.length === 0) {
      return 1; // Leaf node maps to 1
    }

    // Get prime for each subtree
    let result = 1;
    for (const subtree of this.subtrees) {
      const subtreeValue = subtree.toInteger();
      const prime = PrimeUtils.getPrime(subtreeValue);
      result *= prime;
    }

    return result;
  }

  /**
   * Get height of tree (max distance from root to leaf)
   * Leaf has height 1, single child has height 2, etc.
   */
  getHeight(): number {
    if (this.heightCache === -1) {
      if (this.subtrees.length === 0) {
        this.heightCache = 1;
      } else {
        let maxChildHeight = 0;
        for (const subtree of this.subtrees) {
          maxChildHeight = Math.max(maxChildHeight, subtree.getHeight());
        }
        this.heightCache = maxChildHeight + 1;
      }
    }
    return this.heightCache;
  }

  /**
   * Get width of tree (number of leaves)
   */
  getWidth(): number {
    if (this.widthCache === -1) {
      if (this.subtrees.length === 0) {
        this.widthCache = 1;
      } else {
        this.widthCache = 0;
        for (const subtree of this.subtrees) {
          this.widthCache += subtree.getWidth();
        }
      }
    }
    return this.widthCache;
  }

  /**
   * Get count of nodes in tree
   */
  getNodeCount(): number {
    let count = 1;
    for (const subtree of this.subtrees) {
      count += subtree.getNodeCount();
    }
    return count;
  }

  /**
   * Get string representation of tree
   */
  toString(): string {
    return this.toStringHelper(0);
  }

  private toStringHelper(depth: number): string {
    const indent = '  '.repeat(depth);
    let result = `${indent}Tree(${this.value})\n`;

    for (const subtree of this.subtrees) {
      result += subtree.toStringHelper(depth + 1);
    }

    return result;
  }

  /**
   * Get tree structure as indented lines
   */
  getStructureLines(): string[] {
    const lines: string[] = [];
    this.getStructureLinesHelper(0, lines);
    return lines;
  }

  private getStructureLinesHelper(depth: number, lines: string[]): void {
    const indent = '  '.repeat(depth);
    lines.push(`${indent}├─ ${this.value}`);

    for (let i = 0; i < this.subtrees.length; i++) {
      const subtree = this.subtrees[i];
      const childLines = subtree.getStructureLines();

      for (let j = 0; j < childLines.length; j++) {
        const childLine = childLines[j];
        const isLast = i === this.subtrees.length - 1;
        const prefix = isLast ? '  ' : '│ ';
        lines.push(prefix + childLine);
      }
    }
  }

  /**
   * Clears the cache (useful for memory management)
   */
  static clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache size (for debugging)
   */
  static getCacheSize(): number {
    return this.cache.size;
  }
}
