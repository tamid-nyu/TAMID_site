# TAMID Group at NYU Website Frontend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![CI](https://github.com/ohortig/TAMID_site/actions/workflows/ci.yml/badge.svg)](https://github.com/ohortig/TAMID_site/actions/workflows/ci.yml)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel&logoColor=white)](https://nyu-tamid.org)
[![Node.js](https://img.shields.io/badge/node-24.x-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1-blue?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.3-purple?logo=vite&logoColor=white)](https://vitejs.dev/)

A React frontend for the TAMID Group at NYU website.

**Live Frontend**: [nyu-tamid.org](https://nyu-tamid.org)
**Live API**: [api.nyu-tamid.org](https://api.nyu-tamid.org)
**Live Admin Panel**: [admin.nyu-tamid.org](https://admin.nyu-tamid.org)
**Status Page**: [status.nyu-tamid.org](https://status.nyu-tamid.org)

## Documentation

- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [SEO.md](./SEO.md)
- [STYLE.md](./STYLE.md)
- [AGENTS.md](./AGENTS.md)

## Contact

TAMID Group at NYU

Email: [tamid@nyu.edu](mailto:tamid@nyu.edu)

Feel free to reach out to report bugs, ask questions, or inquire about joining the development team.

## TAMID Rebrand — Human TODOs

This site was adapted from the open-source SJBA_site template. The following placeholders were introduced during the rebranding process (Phases 1-4) and require human review and completion before final launch.

### Real Domain
Replace all instances of the placeholder domain `nyu-tamid.org` and subdomains with the real domain:
- `README.md:5` — Vercel badge URL
- `README.md:13` — Live Frontend link
- `README.md:14` — Live API link
- `README.md:15` — Live Admin Panel link
- `README.md:16` — Status Page link
- `index.html:16` — Canonical link `<link rel="canonical">`
- `index.html:21` — OpenGraph URL `og:url`
- `index.html:27` — OpenGraph image domain
- `index.html:32` — Twitter card URL
- `index.html:38` — Twitter image domain
- `index.html:53-54` — JSON-LD Organization URL and logo URL
- `index.html:72`, `index.html:85` — JSON-LD WebSite and WebPage URLs
- `public/robots.txt` — Sitemap domain in sitemap reference
- `public/sitemap.xml` — All `<loc>` elements (8 instances across 7 pages)
- `src/seo.ts:1` — `SITE_URL` constant
- `src/seo.ts:104` — JSON-LD logo URL
- `src/constants.ts:1` — `DEFAULT_BACKEND_URL` (set to `https://api.nyu-tamid.org/v1`)
- `src/constants.ts:7` — `STATUS_PAGE_URL` (set to `https://status.nyu-tamid.org`)
- `src/components/ErrorDisplay/ErrorDisplay.tsx:14` — Status page URL in error detection
- `AGENTS.md:5` — Production site URL reference
- `AGENTS.md:7` — Production API URL reference
- `CONTRIBUTING.md:35` — Production API URL in contribution guidelines

### Real Email
Replace the placeholder email `tamid@nyu.edu` with the actual TAMID contact email:
- `README.md:29` — Contact email in the README
- `src/pages/Contact/Contact.tsx:28-29` — Contact channel metadata (value and href)
- `src/pages/Contact/Contact.tsx:180-181` — Email link in contact form

### Real Social Media Handles
Confirm or replace the placeholder social media handles:
- **LinkedIn**: `company/tamidgroup` (referenced in multiple locations)
  - `index.html:63` — JSON-LD sameAs
  - `src/seo.ts:113` — sameAs array
  - `src/components/Footer/Footer.tsx:26` — Footer LinkedIn link href
  - `src/pages/Contact/Contact.tsx:39` — Contact page LinkedIn link
- **Instagram**: `nyutamid` (referenced in multiple locations)
  - `index.html:63` — JSON-LD sameAs
  - `src/seo.ts:113` — sameAs array
  - `src/components/Footer/Footer.tsx:34, 37` — Footer Instagram link and handle
  - `src/pages/Contact/Contact.tsx:47, 50` — Contact page Instagram link and handle

### Real GitHub Organization and Repository
The repository currently uses placeholder GitHub references. Update these to the real TAMID organization/repo:
- `.github/CODEOWNERS:1-2` — Update team/org references (currently `@tamid-admin`)
- `.github/workflows/ci.yml` — Update any repository-specific CI/CD references if needed
- `README.md:4` — CI badge URL (currently points to `github.com/ohortig/TAMID_site`)
- `package.json:2` — Package name (currently `tamid-site`; verify this matches the org/repo naming)

### Real Logo Artwork
The logo files in `public/tamid/` currently contain SJBA artwork. Replace with TAMID brand logos:
- `public/tamid/tamid-logo-clear.png` — Transparent logo (referenced in favicons and JSON-LD)
- `public/tamid/tamid-logo-clear-inverted.png` — Inverted transparent logo (used in footer navigation)
- `public/tamid/tamid-logo-clear-no-text.png` — Logo without text
- `public/tamid/tamid-logo-full.png` — Full logo with text (referenced in header and JSON-LD)
- `public/tamid/tamid-logo-full-inverted.png` — Full logo inverted
- `public/tamid/tamid-logo-full-white.png` — Full logo in white (large file, used in header)
- `public/tamid/tamid-logo-purple.png` — Purple logo variant
- `public/tamid/tamid-logo-white.jpg` — White logo variant

All references to these files are located in:
- `index.html:5-8` — Favicon references
- `src/seo.ts:104` — JSON-LD logo URL
- `src/components/Header/Header.tsx:31-32, 81, 86` — Header logo display (mobile and desktop)

### Real Photography
Gallery images currently contain SJBA photography. Replace with TAMID event/organization photos in these directories:
- `public/home-gallery/tamid-gallery-1.JPG` through `tamid-gallery-4.JPG` — Hero gallery rotation
  - Referenced in `index.html:44-45` (preload tags)
  - Referenced in `src/pages/Home/Home.tsx:26-29` (HERO_GALLERY_IMAGES array)
  - Also used as `DEFAULT_SOCIAL_IMAGE` in `src/seo.ts:6`
- `public/board-gallery/board-gallery-1.jpg` — Executive Board page thumbnail
  - Referenced in `src/seo.ts:37` (route image)
  - Referenced in `src/pages/OurBoard/OurBoard.tsx:169` (background image)
- `public/members-gallery/members-gallery-1.jpeg` — General Members page thumbnail
  - Referenced in `src/seo.ts:44` (route image)
  - Referenced in `src/pages/OurMembers/OurMembers.tsx:150` (background image)
- `public/mentorship-gallery/mentorship-gallery-*.jpeg` — Programs (formerly Mentorship) gallery images
  - Referenced in `src/seo.ts:52` (route image)
  - Referenced in `src/pages/Programs/Programs.tsx:99, 106, 114, 121` (pillar section images)
- `public/events-gallery/events-gallery-1.jpeg` — Events page thumbnail
  - Referenced in `src/seo.ts:59` (route image)
- `public/mission-gallery/stern-building.jpg` — Mission page thumbnail (may depict NYU campus, verify ownership)
  - Referenced in `src/seo.ts:30` (route image)

Note: `public/home-gallery/tamid-gallery-1-placeholder.jpg` is a placeholder image referenced in `src/pages/Home/Home.tsx:31` for progressive image loading; replace with a low-res version of the final hero gallery image.

### Real People Data
Board and Members pages are API-driven and display empty states until populated. The backend must supply this data:
- `src/pages/OurBoard/OurBoard.tsx` — Fetches from `dataService.board.getPeople()`; currently renders empty state
- `src/pages/OurMembers/OurMembers.tsx` — Fetches from `dataService.members.getPeople()`; currently renders empty state
- Test fixtures have been replaced with placeholders (e.g., `jane-doe-placeholder`); verify real person data does not appear in shipped fixtures
- Confirm that `src/test/server.ts` (MSW handlers) do not return hardcoded SJBA member data

### Physical Address
The footer and JSON-LD currently use a placeholder address (SJBA's "44 West 4th Street"). Replace with TAMID's actual physical address:
- `src/components/Footer/Footer.tsx:76-79` — Footer address block (currently marked `TODO(human): TAMID physical address placeholder`)
- `src/seo.ts:107-111` — JSON-LD PostalAddress (currently "44 West 4th Street, New York, NY 10012")
- `index.html:55-62` — JSON-LD Organization address (same as above)
- `src/pages/Contact/Contact.tsx:33` — Contact page address display
- `src/pages/Events/Events.tsx:118` — Event detail JSON-LD address

### Final Marketing Copy
Review and finalize the following placeholder/draft copy:
- `src/pages/Home/Home.tsx:151-159` — Hero title and description (currently "Bridging NYU and the Israeli economy" + description of four programs)
- `src/pages/Home/Home.tsx:57-73` — HOME_PROOF_POINTS array (three proof-point cards with labels, titles, and copy; currently drafted)
- `src/pages/Home/Home.tsx:193-195` — TODO comment on the speaker/partner-logo strip framing (currently "These are firm logos kept as a neutral 'where our members go / partner firms' cloud; do NOT present as TAMID-specific speaker claims")
  - If the logo strip is kept, finalize the section copy in HTML (currently not visible; likely rendered by LogoGallery)
- `src/seo.ts:4-5` — SITE_DESCRIPTION (currently "TAMID Group at NYU is a nonprofit, apolitical, and areligious student organization...")
- `src/seo.ts:27-31` — Per-route descriptions (Our Mission, Our Board, Our Members, Programs, Events, Contact) — verify alignment with final messaging

### Backend-Contract Decision (INV3)
The Programs page uses API configuration keys that are shared with the backend. A decision is needed on whether to keep or rename these keys:
- Current config keys: `'mentorship_application_open'` and `'mentorship_application_url'` (backend wire-contract literals)
- Location: `src/constants.ts:13-18` (MENTORSHIP_APPLICATION_CONFIG_DEFAULTS)
- Also used in: `src/constants.ts:21` (storage key `programs:mentorshipApplicationConfig`)
- Current decision: Keys are LEFT UNCHANGED to preserve the backend API contract (see INV3 comment in src/constants.ts)
- **TODO**: Confirm with the backend owner whether these config keys should remain as `mentorship_application_*` or be renamed to a program-neutral identifier. If a rename is desired, coordinate the change across frontend (constants/forms) and backend (SiteConfig schema).

## License

This project is licensed under the [MIT License](./LICENSE).
