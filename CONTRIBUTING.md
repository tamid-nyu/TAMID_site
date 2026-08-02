# Contributing

## Local Development

### Prerequisites

- Node.js (v24.x)
- npm
- Git

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/ohortig/SJBA_site.git
   cd SJBA_site
   ```

2. **Install dependencies**

   ```bash
   npm install --save-dev
   ```

3. **Environment Configuration**

   Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

   **Backend URL options:**
   - **Production**: `https://api.nyu-sjba.org/v1`
   - **Local Development**: `/v1`

   Local development requests to `/v1` are proxied to `http://localhost:3000` by Vite.

   For local database data, start local Supabase and the backend API from
   `SJBA_site_backend`. The backend repository owns Supabase CLI usage, migrations,
   local database reset/seed workflows, and backend Supabase environment values.

   > See: [SJBA Backend Repository](https://github.com/ohortig/SJBA_site_backend)

4. **Start development server**

   ```bash
   npm run dev
   ```

   By default, the site will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run test` - Run the Vitest test suite
- `npm run test:coverage` - Run tests with a local coverage report
- `npm run test:watch` - Run Vitest in watch mode for local development
- `npm run format` - Format code

### Pre-commit Checks

This repo uses Husky and lint-staged. After `npm install`, the `prepare` script installs the
Git hooks. On commit, staged TypeScript files are linted and formatted, and staged CSS files are
formatted. If the hook rewrites a file, review and re-stage it before committing again.

### Testing

This project uses Vitest with React Testing Library, jsdom, and MSW.

- Put tests next to the code they cover as `*.test.ts` or `*.test.tsx`.
- Use unit tests for reusable utilities, API request/response mapping, and non-trivial date/time logic.
- Use React Testing Library for forms, navigation, loading/error/empty states, and important user interactions.
- Use the shared MSW server in `src/test/server.ts` for API-backed tests that should not call the live backend.
- Mock the frontend API wrapper for component tests when the component only needs to prove what it submits or renders.
- Avoid snapshot tests for whole pages; prefer assertions on headings, links, messages, and user-visible state.
- Run `npm run test` before opening a PR. Use `npm run test:coverage` when adding a larger page or feature to check for obvious gaps.

Expected coverage for this project is practical rather than exhaustive. New features should include tests for meaningful branching behavior, validation, API transformations, and error states. Purely static copy/layout changes usually do not need new tests unless they change routing, accessibility labels, or conditional rendering.

#### Coverage Reports

Running `npm run test:coverage` creates a local `coverage/` folder. This folder is generated output, is ignored by Git, and should not be committed. Open `coverage/index.html` in a browser to inspect the report. The top-level percentage is useful context, but it should not be treated as a strict quality score for this project because many pages and reusable visual components are mostly static.

CI runs linting, Prettier checks, tests, and a production build on pushes and pull requests targeting `main`.

## Contributions

### Code ownership

Code ownership is controlled by SJBA's Director of Technology.

To propose a change, create a new Git branch based on `main`:

```bash
git switch -c your-name/title-of-change-or-addition
```

A code owner will review and merge your changes in a timely manner.

Contact the Director of Technology with any questions.