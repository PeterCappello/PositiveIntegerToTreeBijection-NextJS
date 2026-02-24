# Positive Integer to Tree Bijection - Next.js Port

An interactive web-based educational tool that demonstrates the mathematical bijection between positive integers and rooted trees. This is a Next.js/React port of the original Java application.

## Overview

This project implements and visualizes the elegant mathematical bijection discovered by Peter Cappello (1988) and independently rediscovered by Gobel (1980) and Abe (1994). The bijection establishes a one-to-one correspondence between:

- **Positive integers** (1, 2, 3, 4, ...)
- **Rooted, undirected trees** (with various structural forms)

### The Bijection

For any positive integer `n`:
1. If `n = 1`: maps to a single-node tree
2. If `n = p₁ × p₂ × ... × pₖ` (prime factorization):
   - Find the rank r of each prime p in the sequence of all primes
   - Create subtrees by recursively mapping each rank r
   - The root has k children: the trees mapped from each rank

**Example**: `τ(399)` where `399 = 3 × 7 × 19`
- Prime 3 (rank 2) → subtree τ(2)
- Prime 7 (rank 4) → subtree τ(4)  
- Prime 19 (rank 8) → subtree τ(8)

The inverse function reconstructs the integer from the tree by multiplying the primes corresponding to each subtree's structure.

## Features

### 🔍 Viewer (Explorer)

Interactively explore any positive integer:
- Enter any positive integer to see its tree representation
- Query prime-to-rank and rank-to-prime mappings
- Three visualization modes:
  - **Conventional**: Traditional hierarchical tree layout
  - **Circular**: Nodes arranged in sectors around parent
  - **Planetary**: Orbital mechanics simulation
- View tree statistics (height, width, node count)
- Download tree visualization as PNG
- See text representation of tree structure

### 🎮 PrimeTime Game

An educational game testing tree comprehension:
- 10 difficulty levels (ranges from 1-2 to 1-1024)
- Configurable number of rounds
- Three visualization modes for trees
- Real-time score tracking (+1 correct, -1 incorrect)
- Tree statistics hints
- Valid range indicators

## Technology Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Rendering**: HTML5 Canvas for tree visualization
- **Testing**: Jest + React Testing Library
- **Deployment**: GitHub Pages (static export)

## Installation & Local Development

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/PositiveIntegerToTreeBijection-NextJS.git
cd PositiveIntegerToTreeBijection-NextJS

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Building
npm run build        # Build for production
npm run build && npm run export  # Static export for GitHub Pages

# Testing
npm test             # Run Jest tests
npm run test:watch   # Watch mode

# Linting
npm run lint         # Run ESLint
```

## Project Structure

```
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main page
│   └── globals.css          # Global styles
├── core/                    # Mathematical logic
│   ├── PrimeUtils.ts        # Prime number utilities
│   ├── Tree.ts              # Tree class & bijection logic
│   ├── TreeRenderer.ts      # Layout algorithms
│   ├── Game.ts              # Game logic
│   └── index.ts             # Exports
├── components/              # React components
│   ├── TreeCanvas.tsx       # Tree visualization
│   ├── Viewer.tsx           # Explorer interface
│   ├── GameContainer.tsx    # Game orchestration
│   ├── GameSetup.tsx        # Game configuration
│   ├── GamePlay.tsx         # Game UI
│   └── index.ts             # Exports
├── public/                  # Static assets
│   └── sounds/             # Audio files
├── .github/workflows/       # CI/CD
│   └── deploy.yml          # GitHub Pages deployment
└── [config files]
    ├── next.config.js      # Next.js config
    ├── tsconfig.json       # TypeScript config
    ├── tailwind.config.js  # Tailwind config
    ├── package.json        # Dependencies
    └── jest.config.js      # Jest config
```

## Core Algorithm Details

### Prime Utilities (`core/PrimeUtils.ts`)
- Efficient prime generation with lazy loading
- Prime factorization of integers
- Prime-to-rank and rank-to-prime conversions
- Caching for performance

### Tree Implementation (`core/Tree.ts`)
- Integer-to-tree bijection mapping
- Tree-to-integer conversion
- Tree metrics (height, width, node count)
- Memoization of computed trees

### Tree Visualization (`core/TreeRenderer.ts`)
- **Conventional Layout**: Top-down hierarchical with sorted subtrees
- **Circular Layout**: Nodes arranged in sectors, smaller radius per level
- **Planetary Layout**: Orbital mechanics with gravitational simulation

### Game Logic (`core/Game.ts`)
- Level-based difficulty (1-10)
- Random integer generation within level range
- Score tracking with +1/-1 scoring
- Round management

## Deployment

### GitHub Pages Automatic Deployment

The project uses GitHub Actions to automatically build and deploy to GitHub Pages.

1. **Configure your repository**:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / root

2. **Push changes**:
   ```bash
   git push origin main
   ```

3. **Automatic deployment**:
   - Workflow runs automatically on push
   - Site available at: `https://yourusername.github.io/PositiveIntegerToTreeBijection-NextJS/`

### Local Static Build

```bash
npm run build && npm run export
# Output in ./out directory
```

## Mathematical Background

### Prime Factorization
Every positive integer can be uniquely expressed as a product of prime numbers. This fundamental theorem provides the foundation for the bijection.

### Tree Structure
The algorithm maps:
- Each prime factor pᵢ to its rank rᵢ in the prime sequence
- Each rank rᵢ recursively to its tree representation τ(rᵢ)

### Inverse Mapping
Given a tree:
1. For each subtree, recursively compute its integer value
2. Map that integer to its corresponding prime
3. Multiply all primes together

## References

- [Cappello, P. (1988)](https://doi.org) - Original bijection
- [Gobel, F. (1980)](https://doi.org) - Independent discovery
- [Abe, K. (1994)](https://doi.org) - Independent discovery

## Contributing

Contributions are welcome! Areas for enhancement:
- Additional visualization modes
- Performance optimizations for large integers
- More game modes and variations
- Audio effects (dinging sound on game events)
- Mobile responsiveness improvements
- Additional test coverage

## License

MIT License - see LICENSE file for details

## Original Java Version

This project is based on the original Java implementation by Peter Cappello. The Java version provided the foundation for all mathematical logic and UI/UX patterns.

---

**Educational Value**: This tool helps visualize abstract mathematical concepts and demonstrates the beauty of bijective mappings in discrete mathematics.
