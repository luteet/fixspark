# Fix Spark — Harbor Navy Service System

> Category: Local Service / Conversion-First
> A calm, plainly competent look for a local appliance-repair company. Deep navy
> surfaces carry meaning, a single warm amber accent belongs to the phone call,
> and real photography replaces decorative illustration. Good for lead-generation
> service sites where the user scans prices and coverage, then calls.

## Visual Theme & Atmosphere
Quiet confidence, no ornament, content over chrome. The page reads like a well-run local
trade business: dark navy for authority, white and pale mist for the working area, one warm
accent that means "call us". Dense enough to scan ten services and their prices without
scrolling fatigue, airy enough around section edges to stay calm.

The atmosphere is deliberately un-marketing: no coupons, no promo bursts, no 3D, no isometric
illustration, no gradient hero, no glass panels. Weight comes from solid navy fills, tight
display typography, and photographs of an actual technician, van and repair work. The visual
promise is honesty — numbers, license, warranty and rating sit next to the call button instead
of a slogan.

## Color Palette & Roles
- Canvas: `#FFFFFF` — default background for cards and "clean" sections.
- Section alternate: `#F4F7F8` (Mist) — alternating band background; never used for text.
- Primary ink / brand: `#0B2A3C` (Harbor Navy) — hero surface, headings, filled Book button, footer accents.
- Navy deep: `#08202E` — footer, trust strip, pressed state of navy buttons.
- Navy raised: `#12394E` — cards, chips and inputs sitting on dark sections.
- Body text: `#2E4A5C`; Muted: `#63798A` — secondary text, metadata, placeholders.
- Steel: `#9DB8C9` — secondary text and icons on dark surfaces only (≈7:1 on navy, ≈2.3:1 on white — never on light).
- Accent: `#F2A93B` (Spark Amber) — phone CTA and rating stars. Nothing else.
- Secondary accent: `#0F7C7A` (Pacific Teal) — icons and text links on light surfaces, plus one filled band per page (the business offer).
- Borders: `#DCE5EA` hairline, `#C3D2DA` strong (inputs), `#1D4A5F` on dark.
- Semantic: Success `#1F8A5B`, Danger `#C0392B` (form validation only, as text and 2px border).
- Soft accents: `#FCEBD0` (rating pill background), `#E7F2F1` (icon tiles, open accordion row).

Rules: surface area per screen ≈ 70% white/mist, 15% teal (icons, links), 10% navy fills, ≤5%
amber. Amber never appears as text, link color, border, or fill larger than a button. Steel is
dark-surface only; teal is light-surface only. Text on amber is always navy. No gradients between
brand colors, no tinted photo overlays, no colors outside this list.

## Typography Rules
- Display / headings: 'Plus Jakarta Sans', system-ui, sans-serif — weight 700 for h1/h2, 600 for h3, card titles, labels and prices.
- Body: 'Inter', system-ui, sans-serif — weight 400 for paragraphs, 500 for inline emphasis, nav links and captions.
- No mono face; no serif; no third family.
- Scale (px): 12 · 13 · 14 · 16 · 18 · 20 · 26 · 32 · 40 · 56.
- Display: 56 / 40 / 32 / 26 px, line-height 1.08–1.22, letter-spacing −0.2 to −1.2px (negative tracking is mandatory above 32px).
- Body: 18 / 16 / 14 px, line-height 1.6; captions 13 px at 1.4; uppercase eyebrows 12 px with +1.2px tracking.
- Prices: Jakarta Sans 700 at 24 px with `font-variant-numeric: tabular-nums` so price columns don't shift.
- Buttons: 16 px / 600 / line-height 1. Sequence case everywhere; no uppercase buttons, no letter-spaced button labels.
- Phone number is treated as type: 18 px navy in the header, 16 px on the sticky bar.
- Maximum measure: 68ch for paragraphs, 60ch for leads. Minimum 14 px for body, 12 px for anything else.
- Never below weight 400; never bold serif-like display weights above 700; headings stay short and declarative.

## Component Stylings
- Header: 72px tall, white with hairline bottom border on inner pages; transparent over the navy hero, white text and steel menu, turning solid on scroll. Logo (monochrome lockup) left, nav center-left, phone number and amber Call button right.
- Mobile menu: full-height white panel, 18 px 600 items with hairline dividers, amber Call button pinned at the bottom.
- Sticky call bar (phone < 768px): 64px tall plus safe-area inset, white, hairline top border, padding 8px 12px; amber "Call now" pill with phone icon on the left, navy "Book service" pill on the right. Always visible; body reserves bottom padding equal to its height.
- Buttons: height 48px (44px minimum in the sticky bar), radius 10px, padding 14px 22px, label on one line.
  - Primary "Call": amber fill `#F2A93B`, navy label `#0B2A3C`, pressed `#D99226`. Reserved for phone actions only.
  - Secondary "Book": navy fill `#0B2A3C`, white label, pressed `#08202E`.
  - Outline: transparent, navy label, 1px `#C3D2DA` border; on dark, 1px steel border with white label.
  - Text link: teal, no underline, underline on hover/focus only.
- Cards: white, 1px `#DCE5EA` border, 14px radius, 24px internal padding, no shadow by default; on hover a single soft lift (`0 2px 8px rgba(11,42,60,.06)`). Images inside a card take the top corners only.
- Service card: 40px icon tile (radius 8px, `#E7F2F1` fill, teal 1.5px stroke icon), 20px 600 service name, one line of "Diagnostic $X · Repairs from $Y" metadata with navy figures, teal text link. Entire card is clickable.
- Price table: rows 56px, hairline separators, no zebra stripes; service name left at 16px/400, price range right at 24px/700 in navy with tabular figures. One highlighted diagnostic row on `#E7F2F1`.
- Case card: 4:3 photo on top, caption metadata (area · brand · date) in muted 13px, problem title at 20px/600, one-line outcome at 14px, price bottom-right at 24px/700 navy.
- Review card: quote at 16px/400 in `#2E4A5C`, five amber stars at 14px, name and area in 13px muted, small teal source link.
- Business band: the only teal-filled section — white heading, white body at 80% opacity, segment list, inverted button (white fill, teal label).
- FAQ rows: 20px 24px padding, 16px/600 question, 20px teal plus/minus glyph, hairline border; open state switches to mist background with the answer at 16px/400.
- Form card: 20px radius, 32px padding; four required fields only — Name, Phone, ZIP, Service select — with optional details collapsed behind a ghost disclosure. Submit is a full-width navy button with a caption underneath.
- Inputs: 48px tall, 16px font (prevents iOS zoom), radius 8px, 1px `#C3D2DA` border, muted placeholder; focus is a 2px teal border with no glow; error is a 2px `#C0392B` border plus a 13px red caption below. No shadows on inputs.
- Badges: rating pill (`#FCEBD0` fill, amber stars, navy text, radius 9999px, 6px 12px padding), trust chips on dark (`#12394E` fill, white text), brand filters as outline buttons with the active one filling navy.
- Footer: `#08202E`, 64px padding, four columns (services, brands, areas, contact); column headings 12px uppercase steel, links 14px `#9DB8C9`, white on hover. Never inverted to light.

## Layout Principles
- 12-column grid, 1200px max width, 24px gutters; side padding 24px desktop, 20px tablet, 16px mobile.
- Section spacing: 80px desktop, 56px tablet, 48px phone. Gap inside grids: 24px desktop, 16px below.
- Hero: asymmetric 6/6 split on the navy surface — eyebrow, H1, lead, action row, rating pill and trust chips on the left; 16:9 video frame (radius 20px, raised navy fill) with a technician poster on the right. Hero reads 40–60vh, content top-biased, never vertically centered.
- Section rhythm: white → mist → white, with the teal business band as the single interruption and navy reserved for the hero (and optionally the closing form). Never two dark sections in a row.
- Text column: 760px for FAQ, long descriptions and legal pages.
- Service grid 3-up / 2-up / 1-up; case grid 3-up / 2-up / 1-up (the first card may span two columns); area cards 4-up / 2-up / 1-up.
- Price and service name always sit as one visual pair, at most 8px apart; whitespace separates sections, hairlines separate rows inside a table.
- Use whitespace as the primary separator; dividers only between unrelated top-level sections. No decorative section headers, no numbered section labels, no background patterns.

## Depth & Elevation
Three levels, and only three:
- Flat (0): default — sections, hero, trust strip, table rows.
- Hairline (1): 1px `#DCE5EA` border on cards, 1px `#C3D2DA` on inputs. This is the system's main separative device.
- Raised (2): hovered cards and the fixed mobile bar — `0 2px 8px rgba(11,42,60,.06)` and `0 -1px 0 #DCE5EA` respectively.

Depth otherwise comes from surface contrast: navy vs white vs mist, and `#12394E` inside navy blocks.
No neumorphism, no glassmorphism, no colored shadows, no inset shadows, no drop shadows on inputs,
no layered cards with multiple borders.

## Do's and Don'ts
- ✅ Anchor every page on white, alternating with mist bands; keep navy for the hero and the footer.
- ✅ Reserve amber for the phone: one amber button per viewport plus the rating stars — nothing else.
- ✅ Keep the logo lockup monochrome: Harbor Navy on light surfaces, white on navy; never recolor the mark amber or red.
- ✅ Put a price next to every service; treat the price as part of the component, not a paragraph.
- ✅ Use real photographs of the technician, van, and repairs; caption cases with area, brand and price.
- ✅ Keep the phone number and the sticky Call bar visible on every mobile screen.
- ✅ Cap the booking form at four required fields.
- ✅ Use a hairline or a surface change before reaching for a shadow.
- ✅ Keep type to three sizes per screen and headings declarative.
- ❌ No gradients, 3D renders, isometric art, glass panels, or patterned backgrounds.
- ❌ No coupon badges, countdowns, "SALE" bursts, or stock photography of smiling technicians.
- ❌ No amber text, links, icons, or large amber fills; no teal on dark surfaces; no steel on light surfaces.
- ❌ No shadows on inputs, no glow focus rings, no rounded-pill cards for content.
- ❌ No animations beyond 200ms opacity/transform; no autoplaying video with sound; no parallax.
- ❌ No two consecutive dark sections and no second teal band on a page.
- ❌ No inventing colors outside this palette — reach for the nearest existing token instead.

## Responsive Behavior
- Desktop ≥ 1024px: 12-column grid, full 72px header with phone and Call button, 3-up service and case grids, 4-up areas, 4-column footer.
- Tablet 768–1023px: horizontal nav without the phone number in the header, 2-up service and case grids, 2×2 areas, 2-column footer, sticky bar hidden.
- Phone < 640px: 4-column grid, 16px side padding; hamburger menu; H1 56→32px; hero stacks (eyebrow → H1 → lead → buttons → rating → video); service, case and area grids 1-up; price table becomes a card list with the price right-aligned; footer 1 column; sticky Call/Book bar appears.
- Touch targets ≥ 48px (`44px` minimum in the bar), ≥ 8px apart; inputs 48px tall with 16px text.
- Collapsing strategy: grids lose columns instead of shrinking cards; the hero keeps the video inside the first screen rather than pushing it below the fold; the trust strip becomes a horizontally scrolling row with scroll-snap.
- Media: hero video loads after first paint and never becomes the largest contentful paint element — the poster frame is; images ship in AVIF/WebP with `srcset`, explicit dimensions and lazy loading below the fold.
- Motion respects `prefers-reduced-motion`: accordions and card hovers collapse to instant state changes.

## Agent Prompt Guide
- Read this document as the only source of truth: colors, type, spacing and radii come from here, never invented.
- Start every page from the navy hero → white body → mist band rhythm; decide early which band, if any, becomes the teal business block.
- Amber means "call". If an amber button is not a phone action, change it to navy or outline.
- Every service surface needs a price line; if the copy has no price, leave a clearly marked `$—` placeholder rather than omitting the row.
- Show the phone in the header on desktop and in the sticky bar on mobile before styling anything else.
- When in doubt, subtract: fewer boxes, fewer borders, less chrome, more whitespace; prefer a hairline over a shadow and a bigger heading over a louder color.
- Never introduce a fourth surface tone, a second accent hue, or a gradient; if a request demands one, use the closest existing token and note the substitution.
