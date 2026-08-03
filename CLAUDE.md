# CLAUDE.md — TAMID Group at NYU (public site)

Practical guide for a future Claude/dev session. Verify against the repo; don't guess.

## What it is
Public marketing site for **TAMID Group at NYU**.

- **Stack:** React 19 + Vite 6 + TypeScript + plain CSS. Path-based routing via `react-router-dom` (`BrowserRouter` in `src/App.tsx` — NOT hash routing). SSR prerender for static hosting via `build-tools/prerender.mjs` (+ `src/entry-server.tsx`).
- **Origin:** Adapted from the open-source **SJBA_site** template (MIT, Stern Jewish Business Association) and rebranded to TAMID. See `NOTICE`.
- Node **24.x** (`engines` in package.json). Extras: `motion` (animation), `react-hot-toast`, `axios`.

## Commands
- `npm install`
- `npm run dev` — Vite dev server. Config default port is 5173, but the project has been run on **port 5180** (`npm run dev -- --port 5180`) to avoid a local clash.
- `npm run build` — `tsc -b` + Vite client build + SSR build (`vite build --ssr src/entry-server.tsx`) + `node build-tools/prerender.mjs`.
- `npm run lint` (`eslint .`), `npm run lint:fix`
- `npm test` (Vitest, jsdom), `npm run test:coverage`
- `npm run format` (Prettier). Husky + lint-staged run on commit.
- Deploy target: **Vercel** (`vercel.json`).

## Structure
- `src/pages/*` — Home, OurMission, OurBoard, OurMembers, Events, Contact, Programs (overview), ProgramDetail (`/programs/:slug`), NotFound. Barrel: `src/pages/index.ts`.
- `src/components/*` — Header (with Dropdown nav + NavButton), SubpageHero, LogoGallery, Footer, Seo, ScrollToTop, etc.
- `src/seo.ts` — per-route SEO metadata + JSON-LD. `SITE_URL = https://nyu-tamid.org`.
- `src/index.css` — global design tokens in `:root` (see Brand).
- `src/constants.ts`, `src/types/SiteConfig.ts` — site-config contract (see Gotchas).
- `src/api/*` — data service (Supabase-backed buckets + backend `/v1`).
- `public/` — static assets (`tamid/`, `home-gallery/`, `events-gallery/`, `mentorship-gallery/`).

## Routes (`src/App.tsx`)
`/`, `/our-mission`, `/our-board`, `/our-members`, `/programs`, `/programs/:slug`, `/events`, `/contact`, `*` (NotFound).

## Nav / IA (`src/components/Header/Header.tsx`)
Top nav: **Events** · **Programs** (dropdown) · **About** (dropdown) · **Contact** (primary CTA).
- Programs dropdown: Investment Fund `/programs/fund`, Consulting `/programs/consulting`, Quant `/programs/quant`, Fellowship `/programs/fellowship`.
- About dropdown: The TAMID Mission `/our-mission`, Executive Board `/our-board`, General Members `/our-members`.
- Program detail pages are driven by the `PROGRAM_CONTENT` map (keys `fund | consulting | quant | fellowship`) in `src/pages/ProgramDetail/ProgramDetail.tsx`.

## Brand (canonical: `brand/STYLE.md`; tokens in `src/index.css :root`)
Colors:
- navy `#18274B` (primary / `--color-navy`, `--color-brand`, `--color-ink`)
- sky-blue `#41B5E8` (accent / `--color-sky`)
- blue-deep `#0F94CF` (links / CTA / accent text, AA-safe — sky is too low-contrast for text)
- blue-mid `#219CD3`, tint `#F5FBFE` (`--color-blue-tint`), wash `#EBF5FB`, grays `--color-gray-100..600`.

Fonts:
- **Lora** (serif — headings/display, `--font-display` / `--font-accent`)
- **Roboto** (UI, `--font-ui`)
- **Open Sans** (body, `--font-sans`)

Logo (`public/tamid/`): official "TAMID GROUP / AT NYU" lockup — `tamid-logo-full.png` (dark, for solid header), `tamid-logo-full-white.png` / `-inverted` (white, for overlay header), `tamid-logo-clear-no-text.png` (icon, mobile). The clear icon is the original Michigan-chapter TG monogram. Header shows one logo per state (overlay/settled/mobile).

## Hero / header behavior (`Header.tsx`, `Home.tsx`)
- Home hero background: `public/home-gallery/tamid-gallery-1.JPG` (AI-generated NYC blue-hour skyline). `HERO_GALLERY_IMAGES` in `Home.tsx`.
- Header is a transparent overlay on hero routes (`OVERLAY_HEADER_ROUTES` set in `Header.tsx`) and turns solid white on scroll (threshold 36px).
- Hero page titles are white (`SubpageHero__title` / `programs-title`) to avoid navy-on-navy over the hero.

## Deploy / hosting
- Org: **github.com/tamid-nyu** (public). Remote is HTTPS `https://github.com/tamid-nyu/TAMID_site.git`.
- **Push via SSH** — the HTTPS token lacks the `workflow` scope needed for `.github/workflows/`. Use `git@github.com:tamid-nyu/TAMID_site.git` (or `git push origin HEAD`).
- Hosting: **Vercel**. Domain placeholders `nyu-tamid.org` (+ `api.` / `admin.` / `status.`).
- Backend data via Supabase buckets + a `/v1` API (`.env.example`). Copy `.env.example` -> `.env`.
- `tamid@nyu.edu`, socials `linkedin.com/company/tamidgroup` and `@nyutamid` are **PLACEHOLDERS** (`src/seo.ts`).

## Gotchas
- Run `git status -u` before pushing — the working tree has many uncommitted changes; stage explicit paths only.
- Do **NOT** rename the config key strings `mentorship_application_open` / `mentorship_application_url` (`src/constants.ts`, `src/types/SiteConfig.ts`) — backend WIRE contract, marked **INV3**.
- `noUnusedLocals` is on — remove unused imports or `tsc -b` / build fails.
- Much gallery/candid imagery is AI-generated or reference-based (home hero is AI; `mentorship-gallery/` and `events-gallery/` still contain template/SJBA-derived or generated photos per `README.md`). Treat as placeholder until real chapter photography lands.
- Supabase project referenced in `.env.example` (`ivhsrdfhjxtrxvrwswuk`) is inherited from the template — needs a fresh TAMID project + keys.

## Human-TODOs (before launch)
- Real domain, email (`tamid@nyu.edu`), and socials.
- Real chapter photography to replace AI/stock/template imagery.
- New Supabase project + keys (board-headshots + event-flyers buckets).
- Confirm logo usage rights.
- Final marketing copy, including the home hero headline.
