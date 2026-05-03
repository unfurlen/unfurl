# ADR 001: Noughts & Crosses as First Experience

**Date**: 2026-05-03
**Status**: Approved

## Context

We need to validate the URL-based state pattern with the simplest possible useful experience.

## Decision

Start with Noughts & Crosses (tic-tac-toe) because:
- State is minimal (9 cells, turn indicator)
- No AI required (pass-and-play)
- URL encoding is straightforward
- Fully demonstrates shareability (mid-game, win states)
- Familiar rules, no explanation needed

## Consequences

- Proves the core pattern before building more complex experiences
- Establishes project structure and conventions
- May feel too simple for long-term value, but that's fine for validation
