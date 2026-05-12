# ADR 010: Pure Function Render Pipeline

- **Status:** Accepted
- **Date:** 2026-05-12

## Context

DOM rendering can easily mix concerns — state, event wiring, and DOM creation. For testability and clarity, each piece should be a pure function.

## Decision

- Render functions are pure: they take state in, return `HTMLElement` out. No side effects.
- Pipeline: `renderCell` → `renderGrid` → `renderResult` → `renderControls`
- Each function is independently testable: pass input, assert DOM output
- `index.ts` is the sole bootstrap module: calls render functions, mounts to DOM, sets up hashchange listener
- Event wiring is kept at the edge: `renderControls` and `renderGrid` attach click handlers inline

## Consequences

- All render logic is testable without jsdom setup per test
- Changing render order or adding new elements doesn't break existing tests
- `index.ts` stays thin — just orchestrates rendering and navigation
- Inline event handlers in render functions means they're recreated on each render, but for a 3×3 grid the overhead is negligible
- Pattern extends to larger UIs: compose more render functions in the same pipeline
