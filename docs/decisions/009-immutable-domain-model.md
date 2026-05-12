# ADR 009: Immutable Domain Model

- **Status:** Accepted
- **Date:** 2026-05-12

## Context

Game state (cells, moves, winners) is derived from URL hash via event sourcing. Mutable state makes replaying moves error-prone and harder to reason about.

## Decision

- `Cell` is immutable — player is set at construction and never changes
- `Grid.applyMove` mutates cells in place. Safety comes from event sourcing: the grid is rebuilt from scratch each render cycle, so mutation never spans across renders.
- `Move` is a value object — read-only fields validated at construction
- No setters on Cell or Move. Grid is the only type with mutation, and it's confined to a single render cycle.

## Consequences

- Replaying moves from URL hash is safe — a fresh `Grid()` is created on each hash change
- Tests are simpler — no need to assert state after mutation
- Grid winner detection is a pure function of the cell array
- No allocation overhead from copying arrays per move
- Pattern extends naturally to larger grids
- Future projects can adopt the same tradeoff: immutable values, mutable containers reset per render
