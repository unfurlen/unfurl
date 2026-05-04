# ADR 005: Vite Base Path for GitHub Pages

**Date**: 2026-05-04
**Status**: Approved

## Context

GitHub Pages serves from a subpath (e.g. `/unfurl/`), not root. Vite defaults to `/`.

## Decision

Set `base: '/unfurl/'` in `vite.config.js`.

## Consequences

- Assets resolve correctly on GitHub Pages
- If moving to a custom domain, this line can be removed entirely
