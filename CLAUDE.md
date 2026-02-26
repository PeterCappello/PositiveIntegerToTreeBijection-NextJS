# CLAUDE.md — Agent Context for PositiveIntegerToTreeBijection-NextJS

## What This Project Is

An interactive Next.js web app that visualizes a mathematical bijection between positive integers and rooted trees. Every positive integer maps to a unique tree and vice versa.

**The bijection algorithm** (`core/Tree.ts`):
- `n = 1` → single-node tree
- `n > 1` → prime-factorize `n`; for each prime factor, find its rank in the prime sequence (2=rank 1, 3=rank 2, 5=rank 3, …); recursively map each rank to a subtree; the root has one child per prime factor (with repetition)
- Example: `399 = 3 × 7 × 19` → ranks `[2, 4, 8]` → root with children `τ(2)`, `τ(4)`, `τ(8)`
- Inverse: for each child subtree, recursively get its integer, look up the corresponding prime, multiply all primes together

---

## Environment

Node.js is installed via **Homebrew**. In non-interactive shells (e.g. Bash tool), npm is not on PATH by default. Always prefix npm/node commands with:

```bash
eval "$(/opt/homebrew/bin/brew shellenv)" && npm run dev
```

Or export the PATH at the start of a session:

```bash
export PATH="/opt/homebrew/bin:$PATH"
```

**Dev server**: `npm run dev` → [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
app/
  page.tsx            # Root page: two tabs — Viewer and PrimeTime Game
  layout.tsx          # Root layout
  globals.css         # Tailwind base styles

core/                 # Pure math — no React, no UI
  Tree.ts             # Tree class + bijection (fromInteger / toInteger)
  PrimeUtils.ts       # Prime generation, factorization, rank↔prime lookups
  TreeRenderer.ts     # Layout algorithms: conventional, circular, planetary
  Game.ts             # Game state, scoring, level ranges
  index.ts            # Re-exports everything

components/
  TreeCanvas.tsx      # Renders tree to HTML5 Canvas; handles animation loop
  Viewer.tsx          # Explorer tab: input integer, pick view mode, see stats
  GameContainer.tsx   # Orchestrates game lifecycle
  GameSetup.tsx       # Game config (level 1–10, rounds, view mode)
  GamePlay.tsx        # Active game: show tree, accept guess, score
  index.ts            # Re-exports everything

.github/workflows/
  deploy.yml          # Auto-deploys to GitHub Pages on push to main
```

---

## Key Files in Detail

### `core/TreeRenderer.ts` — `NodePosition` interface

```ts
interface NodePosition {
  id: string;
  x: number;
  y: number;
  value: number;   // the integer this node represents
  radius: number;
  level: number;   // depth from root; root = 0
}
```

**`level === 0` identifies the root node.**

### Three layout modes

| Mode | Function | Notes |
|------|----------|-------|
| `conventional` | `generateConventionalLayout()` | Top-down hierarchy; `level` set to depth |
| `circular` | `generateCircularLayout()` | Radial sectors; `level` always 0 (not meaningful) |
| `planetary` | `generatePlanetaryLayout(timeStep)` | Orbital animation; each node revolves around its parent |

**Planetary layout details:**
- Orbit radius = `120 / depth` (inner orbits are larger, outer shrink with depth)
- Angular speed follows Kepler's third law: `keplerC / orbitRadius^1.5`
- Siblings evenly distributed: `baseAngle = (siblingIndex * 2π) / siblingCount`
- Children receive the parent's *computed* (x, y) so they orbit the parent's moving position
- Edges are **not drawn** in planetary mode

### `components/TreeCanvas.tsx` — Rendering pipeline

1. Build `Tree.fromInteger(integer)`
2. Create `TreeRenderer` (800×800, nodeRadius=8, padding=24)
3. Call the appropriate `generate*Layout()` method
4. Clear canvas to white
5. Draw edges (skipped in planetary view)
6. For each node:
   - Blue filled circle with dark border
   - Value label **to the right** of the node
   - For non-root nodes (`level > 0`): `nthPrime(value)` label **to the left** of the node
7. In planetary mode: increment `timeRef.current` and call `requestAnimationFrame(render)` again

The `nthPrime(n)` helper is defined locally in `TreeCanvas.tsx`.

---

## npm Scripts

```bash
npm run dev          # Dev server on :3000
npm run build        # Production build (also static export via next.config.js)
npm run start        # Start production server
npm test             # Jest
npm run test:watch   # Jest watch mode
npm run lint         # ESLint
```

---

## Deployment

- Pushing to `main` triggers `.github/workflows/deploy.yml`
- Workflow: `npm install` → `npm run build` → deploy `out/` to `gh-pages` branch
- Live at: `https://petercappello.github.io/PositiveIntegerToTreeBijection-NextJS/`
- `next.config.js` has `output: 'export'` for static generation

---

## Gotchas

- `circular` layout does not set `level` correctly (always 0). Use `conventional` or `planetary` when `level` matters.
- The `Tree` class memoizes results in a static `Map`. Call `Tree.clearCache()` if you need a clean state in tests.
- `PrimeUtils` lazily extends its prime list. Call `PrimeUtils.initialize(n)` upfront if you'll need many primes (the Viewer and GameContainer both call `initialize(1000)` on mount).
- Konva and D3 are installed as dependencies but are not currently used.
- There are currently no test files despite Jest being configured.
