# AGENTS.md

## Project Overview
- React + Vite + TypeScript frontend for the Stern Jewish Business Association website
- Production site: `https://nyu-sjba.org`
- Backend API
     - Production URL: `https://api.nyu-sjba.org`
     - Development URL: `http://localhost:3000`
- Backend API docs: `http://localhost:3000/docs.json`
     - Fetch up-to-date backend docs with: `curl -L http://localhost:3000/docs.json`
- This frontend is deployed using Vercel

## Styling & Design System
- Follow `STYLE.md` as the authoritative design system
     - When altering, deleting, or adding a reusable style feature, such as a component, global token, or design philosophy, always update the documentation at `STYLE.md`
- Use global tokens from `src/index.css`
- Keep page-specific layout/styling in page or component CSS files
- Reuse components from `src/components` when practical
- Match the visual language of newer pages; avoid one-off redesigns

## API & Data
- Use the frontend API wrapper in `src/api/dataService.ts`
- Prefer documented backend contracts over assumptions
- Media assets should use thumbnails where available and preload full images only for interactive views
- Tests should not depend on a live backend; use Vitest mocks or the shared MSW server in `src/test/server.ts`

## Testing & CI
- Use Vitest for unit tests and React Testing Library for component tests
- Keep tests close to implementation files as `*.test.ts` or `*.test.tsx`
- Run `npm run test` for the test suite
- Run `npm run test:coverage` when adding or substantially changing a page, API adapter, or shared utility
- Run `npm run build` when changes affect routing, TypeScript types, imports, or deployment behavior
- CI runs lint, Prettier check, tests, and production build for pushes and pull requests to `main`
- Add tests for new form validation, API request/response mapping, loading/error/empty states, route/navigation behavior, and date/time logic
- Static copy or visual-only CSS changes do not need tests unless they affect accessible labels, conditional rendering, or navigation
- Prefer user-visible assertions over broad snapshots

## Working Rules
- Prefer `rg` / `rg --files` for codebase search
- Do not revert unrelated user changes
- Avoid destructive git commands unless explicitly requested
- Prefer non-interactive commands and minimal diffs
