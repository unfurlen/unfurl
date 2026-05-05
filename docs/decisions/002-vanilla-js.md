# ADR 002: Vanilla JS for First Experience

**Date**: 2026-05-03
**Status**: Superseded by [ADR 006](006-typescript.md)

## Context

We needed to choose how to build the first experience (Noughts & Crosses).

## Decision

Use vanilla JavaScript - no framework.

## Consequences

- Zero framework overhead, smallest bundle
- Faster iteration for simple experiences
- Can adopt frameworks later if complexity demands it

## Superseded By

[ADR 006: TypeScript for Models and Invariants](006-typescript.md)
