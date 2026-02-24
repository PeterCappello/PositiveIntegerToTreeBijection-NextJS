/**
 * Utility class for prime number operations
 */
export class PrimeUtils {
  private static primes: number[] = [2];

  /**
   * Initialize the first n primes
   */
  static initialize(count: number = 1000): void {
    if (this.primes.length >= count) return;

    let candidate = this.primes[this.primes.length - 1] + 1;
    while (this.primes.length < count) {
      if (this.isPrime(candidate)) {
        this.primes.push(candidate);
      }
      candidate++;
    }
  }

  /**
   * Get the k-th prime (1-indexed)
   */
  static getPrime(k: number): number {
    if (k < 1) throw new Error('k must be >= 1');

    // Ensure we have enough primes
    while (this.primes.length < k) {
      this.extendPrimes();
    }

    return this.primes[k - 1];
  }

  /**
   * Get rank of a prime (1-indexed), returns -1 if not prime
   */
  static getRank(prime: number): number {
    if (!this.isPrime(prime)) return -1;

    // Ensure we have this prime in our list
    while (this.primes[this.primes.length - 1] < prime) {
      this.extendPrimes();
    }

    return this.primes.indexOf(prime) + 1; // 1-indexed
  }

  /**
   * Check if a number is prime
   */
  static isPrime(n: number): boolean {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;

    const sqrt = Math.sqrt(n);
    for (let i = 3; i <= sqrt; i += 2) {
      if (n % i === 0) return false;
    }
    return true;
  }

  /**
   * Get prime factorization of n
   * Returns array of prime factors (with repetition)
   */
  static factorize(n: number): number[] {
    if (n < 1) throw new Error('n must be >= 1');
    if (n === 1) return [];

    const factors: number[] = [];
    let candidate = 2;

    while (n > 1) {
      while (n % candidate === 0) {
        factors.push(candidate);
        n /= candidate;
      }
      candidate++;
      if (candidate * candidate > n && n > 1) {
        factors.push(n);
        break;
      }
    }

    return factors;
  }

  /**
   * Get unique prime factors of n with their powers
   * Returns map of prime -> exponent
   */
  static factorizeUnique(n: number): Map<number, number> {
    const factors = this.factorize(n);
    const result = new Map<number, number>();

    for (const prime of factors) {
      result.set(prime, (result.get(prime) || 0) + 1);
    }

    return result;
  }

  /**
   * Get all primes up to index k
   */
  static getPrimes(k: number): number[] {
    this.initialize(k);
    return this.primes.slice(0, k);
  }

  /**
   * Extend primes by finding the next prime
   */
  private static extendPrimes(): void {
    let candidate = this.primes[this.primes.length - 1] + 1;
    while (!this.isPrime(candidate)) {
      candidate++;
    }
    this.primes.push(candidate);
  }
}
