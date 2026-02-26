# Setup & Deployment Guide

## Quick Start

### 1. Install Dependencies

```bash
cd /Users/petercappello/projects/PositiveIntegerToTreeBijection-NextJS
npm install
```

**Note**: You'll need Node.js 18+ installed on your system. If you don't have it, install via [nodejs.org](https://nodejs.org) or Homebrew:
```bash
brew install node
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Deployment

```bash
npm run build
```

This creates an optimized build in the `.next/` directory.

### 4. Export Static Site

```bash
npm run export
```

This creates a static export in the `out/` directory, ready for GitHub Pages.

---

## GitHub Repository Setup

### Create a New Repository on GitHub

1. Go to [GitHub.com](https://github.com)
2. Click **New Repository**
3. Name: `PositiveIntegerToTreeBijection-NextJS`
4. Description: `Interactive visualization of the bijection between positive integers and rooted trees`
5. Choose Public or Private
6. **Do NOT** initialize with README (we already have one)
7. Click **Create repository**

### Connect Local Repository to GitHub

After creating the GitHub repository, run:

```bash
cd /Users/petercappello/projects/PositiveIntegerToTreeBijection-NextJS

# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/PositiveIntegerToTreeBijection-NextJS.git

# Rename branch to main if needed
git branch -M main

# Push to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Enable GitHub Pages

### 1. Repository Settings

1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - **Source**: Deploy from a branch
   - **Branch**: Select `gh-pages`
   - **Folder**: Select `/ (root)`
4. Click **Save**

### 2. Automatic Deployment

The workflow in `.github/workflows/deploy.yml` will automatically:
- Build the Next.js project when you push to `main`
- Export static files
- Deploy to `gh-pages` branch
- Make site live at: `https://YOUR_USERNAME.github.io/PositiveIntegerToTreeBijection-NextJS/`

**First deployment may take 1-2 minutes.** Check the "Actions" tab in your GitHub repository to see the build status.

---

## Project Structure Overview

```
PositiveIntegerToTreeBijection-NextJS/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout wrapper
│   ├── page.tsx                 # Main page (Viewer + Game tabs)
│   └── globals.css              # Global Tailwind styles
│
├── core/                        # Core mathematical logic
│   ├── PrimeUtils.ts           # Prime number generation & utilities
│   ├── Tree.ts                 # Tree class & bijection algorithm
│   ├── TreeRenderer.ts         # Three layout algorithms (conventional, circular, planetary)
│   ├── Game.ts                 # Game state & logic
│   └── index.ts                # Module exports
│
├── components/                 # React components
│   ├── TreeCanvas.tsx          # Canvas rendering engine
│   ├── Viewer.tsx              # Explorer interface
│   ├── GameContainer.tsx       # Game controller
│   ├── GameSetup.tsx           # Game configuration
│   ├── GamePlay.tsx            # Game UI
│   └── index.ts                # Component exports
│
├── public/                     # Static assets
│   └── sounds/                # Audio files (for future use)
│
├── .github/workflows/         # CI/CD
│   └── deploy.yml             # Automatic GitHub Pages deployment
│
├── Configuration files:
├── package.json              # Dependencies & scripts
├── next.config.js            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── jest.config.js            # Testing configuration
├── .eslintrc.json            # ESLint rules
├── .gitignore                # Git ignore rules
├── LICENSE                   # MIT License
└── README.md                 # Project documentation
```

---

## Key Files Explained

### `core/Tree.ts`
Implements the mathematical bijection:
- `Tree.fromInteger(n)` - Converts a positive integer to a tree
- `tree.toInteger()` - Converts a tree back to an integer
- Uses prime factorization as the foundation

### `core/PrimeUtils.ts`
Prime number utilities:
- Lazy-loaded prime generation with caching
- Prime factorization
- Prime-to-rank and rank-to-prime conversions

### `core/TreeRenderer.ts`
Three tree visualization layouts:
1. **Conventional**: Top-down hierarchical tree
2. **Circular**: Nodes in sectors around parent
3. **Planetary**: Orbital mechanics simulation

### `components/Viewer.tsx`
Explorer interface where users can:
- Enter any positive integer
- See its tree visualization
- Query prime-rank relationships
- Download tree images

### `components/GamePlay.tsx`
Game interface where users:
- Guess the integer from a tree visualization
- Get real-time scoring
- Progress through configurable rounds

---

## Available npm Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production (.next directory)
npm run start       # Start production server
npm run export      # Build and export static site (for GitHub Pages)
npm run lint        # Run ESLint
npm test            # Run Jest tests
npm run test:watch  # Run tests in watch mode
```

---

## Troubleshooting

### Issue: "npm not found"
**Solution**: Install Node.js from [nodejs.org](https://nodejs.org) or via Homebrew:
```bash
brew install node
```

### Issue: Build fails with TypeScript errors
**Solution**: Ensure TypeScript strict mode passes:
```bash
npx tsc --noEmit
```

### Issue: GitHub Pages not updating
**Solution**: 
1. Check GitHub Actions tab for build errors
2. Verify `gh-pages` branch exists in your repository
3. Check Pages settings point to the correct branch/folder

### Issue: Canvas rendering appears blank
**Solution**: Check browser console for errors. Ensure:
- Integer is >= 1
- Browser supports HTML5 Canvas
- Try a smaller integer (12, 24, 100) first

---

## Performance Notes

- **Prime caching**: Primes are computed once and cached
- **Tree memoization**: Computed trees are cached to avoid recomputation
- **Canvas rendering**: Uses native Canvas API for fast rendering
- **Planetary animation**: Frame-rate controlled
- **Large integers**: May take longer; start with integers < 1000

---

## Next Steps

1. Install dependencies: `npm install`
2. Start local dev server: `npm run dev`
3. Test the Viewer and Game
4. Push to GitHub with `git push -u origin main`
5. Enable GitHub Pages in repository settings
6. Deployment will happen automatically on each push to `main`

For detailed documentation, see [README.md](./README.md)
