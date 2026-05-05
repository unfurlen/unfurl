# ADR 006: TypeScript for Models and Invariants

**Date**: 2026-05-04
**Status**: Approved

## Context

We are introducing models with invariants. We want to enforce these invariants at compile time.

## Decision

Use TypeScript for type checking.

## Consequences

- Compile-time enforcement of model invariants
- Better IDE support and autocompletion
- Small overhead in setup, but aligns with our strict TDD and lean principles
