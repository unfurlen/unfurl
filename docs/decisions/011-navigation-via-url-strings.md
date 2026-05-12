# ADR 011: Navigation via Precomputed URL Strings

- **Status:** Accepted
- **Date:** 2026-05-12

## Context

Back and forward navigation in noughts & crosses could be implemented many ways: browser history API, callback functions, state variables, or URL strings.

## Decision

- `renderControls` accepts `backUrl` and `forwardUrl` as nullable strings, not callbacks or history API calls
- Navigation URLs are precomputed in `index.ts` from `currHistory` and `fullHistory` arrays
- The render function itself sets `location.hash = url` when a button is clicked
- Only the share button receives a callback, because the Web Share API requires async fallback logic
- This keeps the render layer purely concerned with presentation

## Consequences

- `renderControls` is stateless — no need to know about history, state, or navigation logic
- Testing is simple: pass URL strings, assert button wiring, assert disabled state for null
- All navigation logic stays in `index.ts` (or `url.ts` for the pure functions that compute URLs)
- Precomputing URLs means double the string work per render, but negligible for short hashes
- Future projects follow the same pattern: compute URL strings, pass to controls
