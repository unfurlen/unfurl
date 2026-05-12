# ADR 008: Monorepo with Multi-Project Structure

- **Status:** Accepted
- **Date:** 2026-05-12

## Context

The unfurl project was initially a single game (Noughts & Crosses). Adding a second game (Cartographer) requires splitting into multiple projects while sharing dependencies (Vite, Vitest, TypeScript, ESLint).

## Decision

- Use a Vite multi-page build at the root level
- Each project lives in its own directory (e.g., `oxo/`, `carto/`) with its own `index.html`, `src/`, and test files
- Root `package.json` holds all shared dependencies
- Zero code sharing between projects — each is fully independent. This is an intentional constraint to keep projects decoupled and avoid premature abstraction.
- Root `index.html` serves as a landing page linking to each project
- Root `vite.config.ts` configures the multi-page build with `build.rolldownOptions.input` entries for each project's `index.html`

## Consequences

- Each project is fully self-contained — can be developed, tested, and deployed independently
- Vite dev server serves all projects: `/` (landing), `/oxo/`, `/carto/`
- Build produces `dist/index.html`, `dist/oxo/index.html`, `dist/carto/index.html` and their assets
- Easy to add new projects by adding a directory, `index.html`, and a vite input entry
- No shared code means potential duplication, but keeps projects decoupled
