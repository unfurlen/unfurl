# ADR 004: Fixed Dependency Versions

**Date**: 2026-05-03
**Status**: Approved

## Context

Dependency version ranges (^) expose the project to unexpected changes and supply chain risks.

## Decision

Use fixed versions for all dependencies (no ^ or ~ ranges).

## Consequences

- Clarity of intent - exact versions known
- Reduced supply chain attack surface
- Manual updates required for version bumps
