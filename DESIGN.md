# Daily Crumb Design System

## Brand Concept

Daily Crumb is a neighborhood bakery for everyday pastries and well-marked occasions. Its identity is quiet, generous, and editorial: a warm counter of things to bring home, pass around, or enjoy in the pause between plans.

**Target customer:** local-minded shoppers who want a memorable pastry, a practical gift, or a cake for an occasion without navigating a generic marketplace.

**Design dial:** ENERGY 2 / RHYTHM 3 / MOTION 1.

## Core Direction

The homepage uses the supplied Daily Crumb logo assets, a cream stage, serif-led typography, and a small number of API-ready pastry-photo crops. The composition is editorial rather than mascot-led: one generous hero statement, one offset image pair, and quiet product shelves.

## Photography

Photography supplies the tactile proof of the bakery. Final imagery should be warm, appetizing, high quality, and slightly editorial: flaky pastry layers, butter gloss, bread crust, paper bags, bakery counters, and cake crumbs. Hero images are offset in a cream composition. Catalog photography stays consistent and straightforward in portrait frames.

Until the API provides image URLs, image frames visibly state the photo brief. They are not final imagery.

## Logo Assets

Use the supplied raster artwork directly. Do not recreate the logo with CSS or substitute a text wordmark.

- `primary-logo.png`: stacked mark for hero use.
- `secondary-logo.png`: horizontal mark for navigation and footer use.
- `third-logo.png`: `dc.` monogram for a single supporting campaign surface and favicon direction.

## Tone Of Voice

Warm, direct, and specific. Speak about baking, carrying, sharing, and choosing something good. Do not use food puns in every sentence, generic startup language, or fake nostalgia.

## Typography

- Display: Georgia, then a system serif fallback. Its soft, high-contrast forms support the bakery's considered editorial tone.
- Interface: Arial, then a system sans-serif fallback. It keeps labels, pricing, filters, and future checkout fields practical.
- Annotation: restrained uppercase sans-serif labels. Never use decorative handwriting for functional UI.

## Tokens

```css
--cream: #f8f2e9;
--dark-brown: #3e2a24;
--burgundy: #7a3f46;
--soft-beige: #dcc8b6;
--muted-brown: #684e47;
--radius-control: 0.3rem;
--radius-media: 0.7rem;
```

Cream is the dominant canvas. Dark brown carries reading and anchoring surfaces. Burgundy is reserved for conversion and active states. Soft beige supplies a quiet photography field.

## Styling Architecture

- Do not introduce magic design values in component code. Colors, typography, spacing scale, radii, shadows, z-index layers, and motion values must come from named tokens.
- Literal values belong only in token declarations and in necessary token-based compositions, such as `color-mix()` and alpha overlays.
- Tailwind is available for local, one-off composition. Use only its token-backed utilities, such as `bg-daily-cream`, `text-daily-ink`, and `font-daily-display`.
- Do not use arbitrary Tailwind design values such as `bg-[#7A3F46]`, `p-[13px]`, or `z-[99]` without a documented exceptional reason.
- Use a semantic custom class for reusable UI, responsive behavior, pseudo-states, nested selectors, or complex component states. Those classes must also use named tokens rather than literal values.
- Do not mix utility and semantic class styling casually. A component governed by a semantic class may use a local utility only when it is truly one-off and non-reusable.
- Global CSS is limited to reset, tokens, typography, focus treatments, scrollbar styling, and shared primitives. New component styles belong with their feature area rather than in cascading override blocks.
- Content-driven layout values, including `minmax()`, grid spans, and `calc()`, are allowed when they describe layout behavior rather than reusable visual design decisions.
- Every admin action uses `AdminButton`, `AdminActionLink`, or `AdminActionGroup`. Do not add raw action buttons, styled action links, or page-specific action-group CSS to admin screens.
- The shared action primitives own default, hover, focus-visible, disabled, pending, danger, and 44px target states. Their business behavior and confirmation copy remain specific to the action.
- Native controls are permitted only inside the shared action primitives, for navigation links, or where a browser-native control is required, such as the hidden file input behind the image upload label.

## Layout And Components

- Use a 4px base scale and `clamp(4.5rem, 8vw, 8rem)` for major editorial sections.
- The desktop hero is a logo-led statement with two offset photo frames. Mobile uses a deliberate vertical order: logo, headline, CTA, large image, smaller image.
- Product cards are open shelf labels with a fixed media frame, product data, price, and future cart action.
- Primary button: burgundy fill, cream text, 44px minimum target.
- Secondary button: dark brown fill, cream text.
- Inputs have labels above, clear boundaries, and a 3px burgundy focus indicator.
- Navigation uses the supplied horizontal logo and links only to real storefront destinations. Cart is visibly marked coming soon until checkout is implemented.
- Shadows apply only to photo crops or one key campaign element, never every card.
- Admin uses the same cream, brown, burgundy, and beige palette in a denser operational layout. The sidebar carries the supplied `dc.` monogram, while forms and tables prioritize scanning and task completion.
- Scrollbars use a beige track, burgundy thumb, and dark-brown hover state in supported browsers.

## Motion

Product media may lift lightly on hover. Mobile navigation can transition open. All motion serves hierarchy or feedback, uses transform and opacity only, and stops with reduced-motion preferences.

## Accessibility

- Meet WCAG AA contrast for all text and controls.
- Keep keyboard focus visible and controls at least 44 by 44 pixels.
- Mark decorative SVGs `aria-hidden`; give meaningful illustrations a title.
- Never put essential product data directly over variable imagery.
- Preserve a simple semantic reading order when desktop compositions stack on mobile.

## Allowed Patterns

- The supplied Daily Crumb logo system.
- Cream space, serif editorial typography, and a few API-ready pastry-photo crops.
- Clean, conventional catalog and future checkout screens using the same tokens.

## Forbidden Patterns

- Recreating the supplied Daily Crumb wordmark with text or CSS.
- Purple-blue gradients, glassmorphism, neon, emoji, generic illustration libraries, and 3D clay objects.
- Repeated bento grids, invented testimonials or metrics, decorative status pills, dead controls, and childish all-over decoration.

## Asset Register

| Asset                   | Status          | Replacement brief                                                                                  |
| ----------------------- | --------------- | -------------------------------------------------------------------------------------------------- |
| Hero pastry pair        | Placeholder     | Two editorial pastry images in warm natural light, one larger close crop and one supporting detail |
| Product catalog set     | Placeholder     | Consistent 4:3 pastry, bread, cake, cookie, drink, and gift photography                            |
| Daily Crumb logo system | Implemented     | Supplied `primary-logo.png`, `secondary-logo.png`, and `third-logo.png`                            |
| Category art            | Placeholder     | Pastry crops in one warm, editorial color grade                                                    |
| Favicon                 | Implemented SVG | `dc.` monogram in dark brown and burgundy on cream                                                 |

## Decision Record

- Cream and dark brown make the product feel warm and legible, not sugary or generic.
- Burgundy is limited to action and state, preserving a single clear conversion accent.
- The two-photo hero gives the page an editorial focal point while remaining honest about missing imagery.
- Serif display type expresses care and occasion, while sans-serif controls retain practical clarity.
- The homepage has varied editorial compositions; catalog and checkout remain intentionally calmer.
- Admin shares the brand palette and type hierarchy so operational work feels connected to the storefront without competing with it.
- API-owned `imageUrl` fields replace temporary photo briefs when real product media is available.
- Semantic CSS remains the primary component styling approach. Tailwind utilities are available for token-backed local composition, not as a mandatory replacement for reusable component styles.
