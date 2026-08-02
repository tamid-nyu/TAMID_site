# SJBA Frontend Style System

This document defines the current visual system for the SJBA site.

The goal is consistency. New pages and components should feel like part of the same site, not isolated redesigns.

The SJBA visual language should feel:

- editorial rather than app-like
- professional rather than playful
- premium but restrained
- readable first
- rooted in Stern purple without becoming purple-heavy

The site is for a student club at a business school. That means the visual tone should sit between campus community and early-career professionalism.

Use these reference ideas when making decisions:

- strong typography before decorative UI
- structured layouts before cards
- photography and whitespace before gradients
- a small number of colors before visual variety
- hierarchy and composition before effects

## System Layers

The styling system is intentionally split into layers.

### `index.css`

Use `index.css` for:

- design tokens
- HTML element defaults
- font family defaults
- site-wide colors
- shared motion timing values
- browser resets and base rendering behavior

Do not put page-specific composition in `index.css`.

### `App.css`

Use `App.css` for:

- app-shell layout
- root wrappers like `.app`, `.main-content`, `.page-container`
- shared content gutters and top offsets

Do not use `App.css` for component chrome, page-specific typography, or section-level art direction.

### Page and component CSS

Use page/component CSS files for:

- section composition
- local layout
- page-specific motion
- component appearance

These files must consume tokens from `:root` rather than introducing arbitrary new values unless there is a strong reason.

## Tokens

These are the current core tokens in `index.css`.

### Typography

- `--font-display`
  - Use for main headlines, section titles, and editorial statements.
  - This is the serif voice of the brand.
- `--font-sans`
  - Use for body copy, labels, navigation, controls, and utility text.
  - This is the operational voice of the brand.

Rule:

- Display serif for emphasis.
- Sans serif for everything people scan quickly or interact with.

### Color

- `--color-brand: #4c0d7f`
  - Primary brand color.
  - Use for primary actions, labels, key dividers, and branded emphasis.
- `--color-brand-deep: #20192e`
  - Darker supporting brand tone.
  - Use for serious dark surfaces when needed.
- `--color-ink: #171220`
  - Main text and dark surface anchor.
  - Prefer this over pure black.
- `--color-muted: #5c556d`
  - Secondary text.
  - Use for body copy, descriptions, captions, and less prominent UI.
- `--color-accent: #c4a86a`
  - Restrained warm accent.
  - Use sparingly for highlights, active indicators, or subtle editorial emphasis.
- `--color-surface: #f7f2e9`
  - Warm surface color.
  - Use for ribbons, panels, quiet containers, and layered surfaces.
- `--color-canvas: #fbf8f3`
  - Global page background.
  - Default page canvas.
- `--color-white: #ffffff`
  - For text on dark imagery and controlled high-contrast surfaces.
- `--border-subtle`
  - Default subtle border for refined light surfaces.
- `--surface-highlight`
  - Inner highlight for light panels that need separation without a heavy frame.
- `--surface-gradient-editorial`
  - Shared editorial light-surface gradient.
  - Use for refined containers like the Members directory surface and Events page content surfaces when they should feel like part of the same family.

Color rules:

- Keep the palette narrow.
- Purple is the anchor, not the wallpaper.
- Use the gold accent sparingly.
- Prefer neutral warmth over bright contrast.
- Avoid introducing new saturated colors unless the design system is being intentionally expanded.

### Layout and spacing

- `--page-gutter`
  - Shared page-side padding.
  - Use this instead of hardcoding `vw` gutters for standard pages.
- `--content-max-width`
  - Max width for readable content zones.
  - Use this for inner wrappers inside full-bleed sections.
- `--header-offset`
  - Space reserved for the header.
  - Use when positioning first-viewport content.
- `--header-compact-height`
  - Header height used before and after scroll.
- `--radius-soft`
  - Soft corner radius for elevated surfaces.
- `--shadow-soft`
  - Default elevated shadow for refined surfaces.
- `--shadow-panel`
  - Tighter panel shadow for surfaces that should separate from the page without looking floaty.

### Motion

- `--transition-medium`
  - Default transition timing for hover, focus, and small state changes.
- `--cta-primary-text`
  - Foreground color for the shared filled primary CTA system.
- `--cta-primary-border`
  - Border tone for primary CTAs.
- `--cta-primary-background`
  - Resting filled surface for primary CTAs.
- `--cta-primary-background-hover`
  - Hover and focus filled surface for primary CTAs.
- `--cta-primary-focus-ring`
  - Focus halo for primary CTAs.

Motion rule:

- If motion is not doing hierarchy, affordance, or atmosphere work, remove it.

## Primary CTA System

The filled purple CTA is now a shared system used by CTA buttons across the website.

Rules:

- Use the shared CTA tokens from `index.css` instead of inventing one-off purple fills.
- Keep the resting state as a solid branded purple with light text and no ambient shadow.
- Hover and focus should use the simpler brightened purple button state with a slight lift.
- Keep sizing contextual to the component, but preserve the same surface language, border, and focus treatment.
- When a button includes the arrow icon, that arrow is a navigation signifier: it tells users the CTA will take them to another SJBA page or to an external website.

## Typography Rules

### Headings

Use serif display headings for major page moments:

- hero titles
- section titles
- newsletter titles when presented editorially

Heading characteristics:

- tight line-height
- slightly negative letter-spacing on large sizes
- compact, high-contrast copy

Avoid:

- long, paragraph-like headings
- all-caps serif headings
- generic web-app headline styling

### Body copy

Body copy should be:

- in `--font-sans`
- easy to scan
- set with comfortable line-height, usually around `1.7` to `1.85`
- muted rather than fully black

Use short paragraphs. Editorial does not mean verbose.

### Eyebrows and labels

Eyebrows are an important pattern in this system.

Use them for:

- section kickers
- ribbons
- proof labels
- small orientation text above major headings

Eyebrow rules:

- sans serif
- uppercase
- increased letter spacing
- visually restrained
- typically brand purple or a muted light-on-dark tone

## Layout Principles

### Prefer full-bleed moments with constrained inner content

For hero sections and major branded moments:

- allow the section background to run edge to edge
- constrain the inner content with `var(--content-max-width)`
- use `var(--page-gutter)` for inner padding

This is the pattern used in the Home hero.

### Prefer sections, columns, and dividers over cards

The current design system is intentionally anti-card by default.

Use:

- editorial columns
- section dividers
- whitespace
- surface changes
- image-to-text contrast

## Footer System

The footer is an approved full-bleed closing section in this system.

Rules:

- Use a full-bleed footer background, but constrain the inner content with `var(--content-max-width)` and `var(--page-gutter)`.
- Treat the footer as an editorial landing, not a utility card tray.
- Use serif sparingly for the main footer statement only.
- Keep navigation groups, metadata, and status links in `--font-sans`.
- Prefer quiet dividers, warm surfaces, and restrained hover states over glass, glossy gradients, or app-like panels.

## Header System

The site header now has two approved modes.

### Header modes

- `overlay`
  - Use on the home page at the top of the hero.
  - Header stays transparent-dark, uses light text, and should feel integrated with the image rather than boxed above it.
- `settled`
  - Use after scroll and on non-home pages.
  - Header shifts to a warm solid surface with ink text and a clearer bottom divider.

Rules:

- Home starts in `overlay` and settles once the page scrolls.
- Subpages that open with a full-bleed `SubpageHero` should also start in `overlay` so the header sits on top of the hero image, then settle once the page scrolls.
- Pages without a full-bleed hero should render directly in `settled`.
- The header should stay fixed; do not create page-specific alternate navigation shells.

### Navigation typography

- Navigation uses `--font-sans`, uppercase tracking on desktop, and quieter editorial scale than the hero.
- Default desktop nav items should read as links first, not buttons.
- Use underlines, spacing, and contrast for hover/active states before adding fills or shadows.
- On mobile, nav items can drop uppercase and scale up significantly for a more editorial sheet layout.

### Navigation CTA

- `Contact Us` is the only primary header CTA.
- On desktop it may use a restrained pill treatment.
- On overlay headers, the CTA should stay readable without looking like a glossy app button.
- On mobile, the CTA should sit apart as a subdued utility action near the bottom of the menu sheet.

### Dropdowns and mobile menu

- Desktop dropdowns should use warm surfaces, tight spacing, and calm motion.
- Dropdown panels should feel like part of the page system, not floating glass widgets.
- Mobile navigation should open as a full-screen editorial sheet, not a narrow drawer.
- When the mobile sheet is open, body scroll should be locked using the `menu-open` body class.

Only use a card or panel when the surface itself is part of the interaction or meaning.

Good uses:

- newsletter signup container
- modal-like surfaces
- highly bounded utilities

Bad uses:

- turning every proof point into a separate card
- stacking generic panels to create fake structure

### Keep sections singular

Each section should do one job:

- orient
- prove
- deepen
- convert

Do not combine multiple competing ideas into one section.

## Home Page Patterns To Reuse

The Home page is now the clearest expression of the system.

Use `Home.css` as the primary composition reference.

### Hero pattern

The Home hero establishes several reusable decisions:

- text is left-anchored, not centered
- imagery is darkened so copy remains readable
- inner content is constrained
- CTA row uses one primary and one secondary action
- navigation dots are minimal and not decorative
- the logo ribbon is physically connected to the hero

When building future heroes:

- start with one dominant visual plane
- place copy in the calmest area of the image
- use overlay gradients to protect readability
- do not place headline text over busy image detail
- avoid hero cards

### Editorial split section pattern

The narrative/newsletter section demonstrates the preferred two-column pattern:

- one editorial text column
- one structured conversion or utility block
- balanced whitespace
- clear hierarchy without decorative clutter

Use this for future combinations like:

- story + CTA
- program explanation + registration
- mission + contact form

## Subpage Framework

`src/pages/Mentorship/Mentorship.tsx` is now the clearest reference for how a branded interior subpage should be assembled.

Use Mentorship as the default subpage blueprint unless a page has a clear structural reason to differ.

### Approved subpage stack

The preferred structure for future subpages is:

1. full-bleed `SubpageHero`
2. constrained overview or framing section
3. one or more detail sections using shared content primitives
4. a final conversion or contact section
5. the shared `Footer`

This keeps subpages aligned with the home page without copying the home page exactly.

### Shared primitives to reuse first

Before creating new page-specific layout patterns, check whether the subpage can be built from these existing pieces:

- `SubpageHero`
  - Use for the opening section on interior pages.
  - It already handles full-bleed imagery, dark overlay treatment, constrained inner content, and mobile CTA stacking.
- `ZigzagView`
  - Use for alternating image-and-copy story rows.
  - This is the approved pattern for program tracks, benefits, featured initiatives, and similar paired content.
- `NumberedList`
  - Use for step-based explanations such as process, timeline, or how-it-works sections.
  - Do not rebuild numbered process layouts locally unless the content genuinely needs a different structure.
- `LinkButtonPrimary`
  - Use `variant="subpage"` for the main action in subpage heroes and conversion sections.
- `LinkButtonSecondary`
  - Use `variant="status"` for supportive hero actions, status indicators, or quiet secondary controls on dark surfaces.
- `InlineLink`
  - Use inside headings or editorial copy when a text-level action should stay integrated with the sentence.

Rule:

- prefer extending these primitives with page wrapper classes before creating new component-specific patterns
- if a local page class is styling the same structure already covered by a shared component, move the rule to the shared component instead of copying it again

### Subpage hero rules

Mentorship confirms that subpages should use the same core hero language:

- full-bleed image
- darkened image treatment for readable copy
- constrained inner shell using `var(--content-max-width)` and `var(--page-gutter)`
- left-aligned copy
- serif display headline
- short sans-serif lead
- one primary action and one quieter supporting action
- the same vertical hero sizing established by the shared `SubpageHero` default offset, with `--subpage-hero-photo-offset: 15.2rem` as the baseline page setting unless a page has a specific documented reason to differ

Implementation guidance:

- use `SubpageHero` instead of building a one-off hero in the page CSS
- subpages using `SubpageHero` should render the site header in `overlay` mode at the top of the page
- use `--subpage-hero-photo-offset: 15.2rem` on the page root as the default hero-height tuning for these subpages
- only change `--subpage-hero-photo-offset` when the page has a specific composition reason to show more or less image below the fold
- keep hero copy narrow, usually around the existing `36rem` max width
- keep hero actions in a simple row that wraps on desktop and stacks on mobile
- use real photography rather than abstract graphics for subpage heroes whenever possible

Avoid:

- centered hero copy by default
- boxed hero containers
- extra promo cards or stat tiles inside the hero
- adding a different button system just for subpages

### Interior section pattern

Mentorship uses a reliable editorial sequence that should guide future subpages:

- overview section for orientation
- alternating story/detail section for proof or explanation
- process section for structured steps
- final call-to-action or contact section

Each section should do one job.

Recommended section behavior:

- keep sections on the shared content width rather than inventing new max widths
- use top padding to create rhythm between sections instead of boxed panels
- use quiet borders to separate process and overview content when needed
- keep headings serif and body copy sans
- use section labels or eyebrows to orient the reader before the main heading

### Layout and alignment rules for subpages

Future subpages should follow these alignment defaults from Mentorship:

- first interior sections should sit on `width: min(100%, var(--content-max-width))` with `margin: 0 auto`
- two-column editorial sections should use asymmetrical ratios rather than equal columns when one side is clearly intro copy and the other is detail
- alternating media/text rows should reverse only the media and copy order, not the overall visual language
- image blocks may use soft shadow for depth, but should stay edge-defined and calm
- body copy should usually stay near `1rem` with generous line-height around `1.8`

Do not:

- center everything just because the page is narrower than home
- replace editorial columns with card grids
- mix multiple unrelated section widths on the same subpage without a strong reason

### Motion and interaction on subpages

Mentorship also establishes the expected motion model for interior pages:

- sections can fade and rise in using `useScrollAnimation`
- motion timing should stay restrained and consistent, around the existing `560ms` reveal window
- image hover motion should be subtle scale and saturation changes only
- CTA hover motion should remain a slight lift plus arrow movement

Rules:

- use `useScrollAnimation` for section reveal sequencing when the page benefits from progressive entrance
- keep one reveal treatment across the page instead of inventing a different animation per section
- preserve `prefers-reduced-motion` handling on shared and local styles

### Responsive behavior for subpages

Subpages should collapse cleanly without changing their design language.

Use the Mentorship behavior as the default:

- hero actions stack on mobile
- two-column sections collapse to one column around tablet widths
- reversed zigzag rows should return to natural document order on smaller screens
- text blocks can expand to full width on mobile
- hero height can relax from strict viewport locking on smaller screens

Avoid:

- mobile-only redesigns
- keeping complex side-by-side layouts too long
- tiny desktop-scaled text on phones

### Content and data behavior

Mentorship is not only a visual reference. It also shows how subpages should integrate dynamic content:

- fetch live data inside the page when the content is page-specific
- keep async status visible in the UI rather than hiding the action entirely
- use progressive enhancement patterns like cached config and loading-safe fallback copy when a CTA depends on remote data
- keep contact or ownership details near the final action, not buried higher on the page

### When page-level CSS is appropriate

Page CSS is still valid for:

- spacing between sections
- page-specific hero offset tuning
- small content-width adjustments for a specific section
- page-only utility states such as a loading status modifier

Page CSS should not duplicate:

- hero base structure already owned by `SubpageHero.css`
- alternating media/text structure already owned by `ZigzagView.css`
- numbered process structure already owned by `NumberedList.css`
- shared CTA styling already owned by the button components

### Subpage checklist

Before shipping a new subpage, verify:

- the page opens with `SubpageHero` unless there is a documented reason not to
- the main body uses shared content width and editorial spacing
- repeated section patterns use shared components before local one-offs
- there is one clear primary action
- mobile layout collapses cleanly into stacked sections
- motion is restrained and reduced-motion safe
- the page still feels like SJBA, not a microsite or campaign landing page

## Component Patterns

### Buttons and links

Current button logic on the Home page:

- primary actions use brand purple
- secondary actions on dark surfaces use translucent white
- both use uppercase sans-serif text with tracked letters
- hover behavior is subtle lift, not dramatic animation

Rules:

- keep action labels short
- use one primary action per area
- secondary actions should feel quieter, not merely color-swapped

### Logo marquee

The logo gallery now has a deliberate brand role.

Rules:

- logos are smaller than a typical sponsor wall
- default state is grayscale and partially muted
- hover/focus restores clarity
- the ribbon is a support texture, not the main attraction
- spacing should feel compact and editorial, not spacious and celebratory

The `variant="hero-ribbon"` mode in `LogoGallery.tsx` should be used when the logo gallery is attached to a first-viewport branded section.

### Forms

The newsletter component establishes the form styling direction:

- quiet warm surface
- serif heading
- sans body copy
- large input hit areas
- thin purple-tinted borders
- soft focus rings
- one clearly branded submit action
- simple eyebrow + headline + short supporting copy
- flat paper surface with subtle edge definition instead of decorative texture

When styling future forms:

- optimize for clarity over flair
- use soft shadows sparingly
- keep placeholders muted
- use accessible focus treatment

For editorial signup or call-to-action surfaces:

- prefer warm paper tones and restrained editorial hierarchy over decorative textures
- avoid blob gradients that feel cosmetic rather than structural
- if the content starts feeling too tall for the available width, widen the usable content area or simplify the copy before adding more visual structure
- when a component lives inside a constrained column, use container queries or single-column defaults so the component responds to its own width, not just the viewport
- prefer simple editorial cues like an eyebrow, a strong headline, and clear spacing before adding mastheads, seals, or novelty structure
- prefer form fields with restrained editorial structure, such as bottom rules or lightly tinted paper fills, before defaulting to heavy boxed inputs

## Motion Rules

Motion should be restrained and intentional.

Use motion for:

- content entrance sequencing
- hover feedback
- image crossfades
- subtle depth and presence

Do not use motion for:

- constant decorative movement unrelated to meaning
- large bouncy transitions
- distracting parallax

Reduced motion:

- always respect `prefers-reduced-motion`
- disable non-essential animation in that mode

## Responsive Rules

The system should remain editorial on mobile, not collapse into generic stacked cards.

Responsive priorities:

- keep first-viewport hierarchy intact
- preserve the heading as the dominant text element
- stack columns cleanly when needed
- keep CTA rows legible and finger-friendly
- maintain visible connection between hero and logo ribbon

Avoid:

- shrinking text too aggressively
- introducing separate mobile-only visual styles that change the design language
- collapsing everything into centered content unless the composition demands it

## Copy And Tone Guidance

The interface copy should sound:

- informed
- concise
- professional
- direct

Avoid copy that sounds:

- overly promotional
- generic startup marketing
- playful or slang-heavy
- needlessly academic

Avoid phrases that feel inflated or vague:

- "unlock your potential"
- "next-level opportunities"
- "where innovation meets excellence"

## Rules For Human Developers

When adding or editing UI:

- start by checking `index.css` for an existing token before adding a new raw value
- use `App.css` only for shared shell/layout concerns
- keep page-specific composition inside that page's CSS file
- prefer existing Home page patterns when inventing a new section
- use serif display headings intentionally, not everywhere
- keep actions short and hierarchy obvious
- test desktop and mobile before considering a style complete

Before adding a new color, font, or spacing constant, ask:

- can an existing token do this?
- is this a system need or a one-off preference?
- will this make the site feel more coherent or less coherent?

## Rules For AI Agents

If you are an AI agent editing this codebase, follow these rules unless the user explicitly requests a different direction.

### Default assumptions

- prefer `var(...)` tokens over raw hex values, pixel values, and one-off fonts
- preserve the editorial/professional tone
- preserve the limited color system
- preserve the no-cards-by-default rule

### What to do before styling

- inspect `index.css` for existing tokens
- inspect the nearest related page/component CSS for pattern reuse
- reuse existing class naming patterns when reasonable
- verify whether the new UI is a hero, proof, editorial, or utility section before choosing layout

### What not to do

- do not introduce bright new accent colors
- do not default to generic dashboard cards
- do not center everything by habit
- do not place low-contrast text on photography
- do not add decorative gradients if the section already has a clear visual structure
- do not replace serif display with default sans for major headings
- do not add motion without a clear interaction or hierarchy reason

### When adding new tokens

Add a new token only if:

- the value will be reused
- the existing system cannot express the need cleanly
- the new token fits the current design language

If a value is truly local and not reusable, keep it local to the component/page CSS.

### Output quality bar

A new page or section should pass these checks:

- Does it immediately look like SJBA?
- Is the headline clearly readable?
- Does the section have one dominant idea?
- Is the palette restrained?
- Would the layout still feel good if shadows were removed?
- Does the mobile version preserve hierarchy rather than flattening it?

## Preferred Implementation Patterns

Good pattern:

```css
.section-title {
  font-family: var(--font-display);
  color: var(--color-ink);
}
```

Bad pattern:

```css
.section-title {
  font-family: Georgia, serif;
  color: #222;
}
```

Good pattern:

```css
.page-section {
  width: min(100%, var(--content-max-width));
  margin: 0 auto;
  padding-inline: var(--page-gutter);
}
```

Bad pattern:

```css
.page-section {
  width: 1180px;
  margin-left: 143px;
  margin-right: 143px;
}
```

Good pattern:

```css
.body-copy {
  color: var(--color-muted);
  line-height: 1.8;
}
```

Bad pattern:

```css
.body-copy {
  color: #000;
  line-height: 1.3;
}
```

## When To Update This Document

Update this file when:

- new global tokens are added
- a new reusable section pattern is introduced
- the brand direction changes
- a major component establishes a new standard worth reusing

Do not update this file for trivial CSS tweaks.

If there is ever a conflict between this document and the implemented token system, update the code or this document so they match again.
