# ADR 009: Immutable Domain Model

- **Status:** Accepted
- **Date:** 2026-05-12

## Context

Game state (cells, moves, winners) is derived from URL hash via event sourcing. Mutable state makes replaying moves error-prone and harder to reason about.

## Decision

- `Cell` is immutable — player is set at construction and never changes
- `Grid.applyMove` returns a new `Grid` with the move applied, rather than mutating in place
- `Move` is a value object — read-only fields validated at construction
- No setters, no mutation. All state flows through constructor arguments

## Consequences

- Replaying moves from URL hash is safe — no stale references or side effects
- Tests are simpler — no need to assert state after mutation
- Grid winner detection is a pure function of the cell array
- Slightly more allocation per move, but trivial for a 3×3 grid
- Pattern extends naturally to larger grids
