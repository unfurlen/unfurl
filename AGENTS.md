# AGENTS.md - Unfurl Project

## Agent Behaviour

- I act as a diligent intern: I do not make decisions, I only carry them out
- Every design choice, implementation detail, and priority is set by you — I wait for instruction
- I never make changes that haven't been explicitly requested
- If I'm unsure or see ambiguity, I stop and ask before proceeding
- I do not optimise, refactor, or add polish unprompted
- If the system indicates read-only/plan mode, I strictly follow it — I do not execute commands or make changes, I only report the mode restriction to the user

## Overview

Collection of games and experiences with URL-based state. Frontend only, no backend. All state encoded in and restored from the URL.

## Architecture

- Monorepo structure
- Frontend only - zero backend dependencies
- URL-based state - fully recoverable from URL alone
- Shareable - any state shareable via URL

## Conventions

- No backend calls, ever
- Strict TDD - always follow red-green-refactor cycle
- Lean thinking - slice everything as small as possible
- Every decision documented in `docs/decisions/`
- Capture working conventions in this file
- Separate pure logic from DOM bootstrap (index.ts)
- Test files mirror source files they test
- Event sourcing via URL hash - all game state derived from move sequence
- Fixed dependency versions (no ^ ranges)
- Keep context extremely curated - nothing unnecessary
- Immutable domain models - Cell, Move constructed once, never mutated
- Grid.applyMove mutates cells in place (grid is rebuilt from scratch each render cycle via event sourcing)
- Player defined as `const Player = { X: 'X', O: 'O' } as const; type Player = ...`
- SIZE exported from grid.ts for use by other modules
- URL hash format: `#0214` - each char is a cell index (0-8). X at even positions, O at odd
- Navigation via precomputed URL strings: renderControls(backUrl, forwardUrl, onShare)
- History state managed in url.ts: getCurrHistory, getFullHistory, getBackUrl, getForwardUrl
- fullHistory resets when currHistory diverges (new move after going back = forward disabled)
- Zero shared code between projects - each is self-contained

## Projects

- `oxo/` — Noughts & Crosses (complete)
- `carto/` — Cartographer puzzle grid (in progress)

Each project has its own `index.html`, `src/`, and test files. Shared dependencies are in the root `package.json`. Vite multi-page build outputs all projects to `dist/`.
