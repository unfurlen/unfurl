# AGENTS.md - Unfurl Project

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
- Propose small changes, one file at a time
- Every decision documented in `docs/decisions/`
- Preview all changes before writing
- Capture working conventions in this file
- Separate pure logic from DOM bootstrap (index.ts)
- Test files mirror source files they test
- Event sourcing via URL hash - all game state derived from move sequence
- Fixed dependency versions (no ^ ranges)
- Keep context extremely curated - nothing unnecessary

## Projects

- `oxo/` — Noughts & Crosses (complete)
- `carto/` — Cartographer puzzle grid (in progress)

Each project has its own `index.html`, `src/`, and test files. Shared dependencies are in the root `package.json`. Vite multi-page build outputs all projects to `dist/`.
