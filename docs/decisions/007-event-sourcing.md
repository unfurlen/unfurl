# ADR 007: Event Sourcing via URL Hash

**Date**: 2026-05-04
**Status**: Approved

## Context

We need a consistent pattern for encoding game state in URLs that scales across all experiences.

## Decision

Use event sourcing via URL hash - moves are encoded as concatenated cell indices.
- Noughts & Crosses: `#0214` means moves at indices 0, 2, 1, 4
- X plays even positions (0th, 2nd...), O plays odd positions (1st, 3rd...)
- Full game state is derived by replaying moves on load

## Consequences

- Any game state is recoverable from URL alone
- Can replay game history, derive whose turn it is, detect invalid moves
- Consistent pattern for chess and future experiences
- URL length is bounded (~2000 chars); for more complex games, we will need encoding strategies (compression, bit packing, state snapshots)
