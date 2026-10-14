---
name: editorial-pastry-commerce
description: Applies the approved Daily Crumb editorial pastry commerce design system.
---

# Daily Crumb Bakery Rules

Read `DESIGN.md` before changing UI. It is the project authority where it differs from generic design guidance.

## Non-Negotiables

- Use warm cream, dark brown, muted burgundy, and soft beige as defined in `DESIGN.md`.
- Homepage: supplied Daily Crumb logo, serif-led display type, a few API-ready pastry-photo crops, and one burgundy shopping CTA.
- Use the supplied logo files directly. Never recreate the wordmark with text, CSS, or a substitute font.
- Never copy a reference brand's logo, typography, image crop, composition, or mascot features.
- If an API image URL is missing, show a clear replacement brief rather than fabricated photography.
- Keep catalog, future cart, checkout, account, and admin patterns practical, accessible, and quieter than the homepage.
- Do not add emoji, generic illustration packs, gradients, glassmorphism, fake metrics, fake testimonials, or dead controls.

## Styling Rules

- Never introduce magic design values in component code. Colors, type, spacing, radii, shadows, z-index layers, and motion values must use named tokens.
- Literal values are permitted only in the token definitions and necessary token-based color compositions.
- For one-off, component-local layout, Tailwind utilities are permitted only when they resolve to the Daily Crumb token bridge in `globals.css`.
- Do not use arbitrary Tailwind values for design decisions, including hexadecimal colors, pixel spacing, or numeric z-indexes, without a documented exception.
- Use semantic custom classes for reusable UI, responsive behavior, pseudo-states, nested selectors, and complex state. Custom classes must use tokens.
- Do not add Tailwind utilities to a component already controlled by semantic styles unless the utility is local and non-reusable.
- Keep global CSS for tokens and global primitives. New component styles should not be appended as broad cascade overrides.

## Checks

- Mobile deliberately stacks logo, hero type, CTA, and photo crops with no essential overlap.
- All controls have real behavior, accessible names, visible focus, and 44px targets.
- Motion uses transform and opacity only, serves hierarchy or feedback, and respects reduced motion.
- Record new asset statuses in `DESIGN.md`; do not imply a placeholder is final photography.
- Before delivery, verify new styling uses tokens and does not introduce arbitrary Tailwind design values.
