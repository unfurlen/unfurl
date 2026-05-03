# AGENTS.md - Unfurl Project

## Overview

Collection of games and experiences with URL-based state. Frontend only, no backend. All state encoded in and restored from the URL.

## Architecture

- Monorepo structure
- Frontend only - zero backend dependencies
- URL-based state - fully recoverable from URL alone
- Shareable - any state shareable via URL

## Conventions

- No backend calls, ever
- Strict TDD - always follow red-green-refactor cycle
- Lean thinking - slice everything as small as possible
- Propose small changes, one file at a time
- Every decision documented in `docs/decisions/`
- Preview all changes before writing
- Capture working conventions in this file
- Keep context extremely curated - nothing unnecessary
