# Maison Veil — Black / Gold / White Color System

**Date:** 2026-09-03  
**Approach:** Palette + semantic scheme roles (Approach 2)  
**Out of scope for this phase:** Homepage section restructuring (deferred)

## Goal

Reposition Maison Veil as a dark-primary luxury fragrance brand using black, gold, and white, with a rose-gold accent derived from the existing brand color `#7c244f`. White remains for invert/secondary sections and for text on primary-colored surfaces.

Inspiration: dark luxury fragrance houses (e.g. [Parfums Du Ciel](https://parfumsduciel.com/)), with a restrained metallic finish — not glitter or neon.

## Decisions locked

| Decision | Choice |
|----------|--------|
| Primary mood | Balanced layout, **dark reads as primary** |
| Button mix | Black CTAs on light sections; **gold CTAs on dark/invert-primary sections** |
| Accent | Rose-gold variant of `#7c244f` (not the raw hex) |
| Homepage rebuild | Later — do not rearrange `index.json` sections in this phase |

## Palette

| Token | Hex | Role |
|-------|-----|------|
| Black | `#0A0A0A` | Primary surfaces |
| Gold | `#C9A962` | CTAs on dark, hairline borders, metallic highlights |
| Soft gold | `#E4D5A8` | Hover / secondary metallic text on black (CSS polish only if needed) |
| White | `#FFFFFF` | Text on dark; invert section backgrounds |
| Soft invert | `#F7F5F2` | Cards / soft secondary backgrounds |
| Rose gold | `#B76E79` | Accent scheme (badges, announcement, highlight blocks) |

## Color scheme roles

Update `config/settings_data.json` → `current.color_schemes` (and mirror into `presets.Default.color_schemes` for consistency).

| Scheme ID | Role | Background | Text | Button | Button label | Secondary button label | Shadow |
|-----------|------|------------|------|--------|--------------|------------------------|--------|
| `scheme-1` | White invert | `#FFFFFF` | `#0A0A0A` | `#0A0A0A` | `#FFFFFF` | `#0A0A0A` | `#0A0A0A` |
| `scheme-2` | Soft invert (cards) | `#F7F5F2` | `#0A0A0A` | `#0A0A0A` | `#F7F5F2` | `#0A0A0A` | `#0A0A0A` |
| `scheme-3` | Dark primary | `#0A0A0A` | `#FFFFFF` | `#C9A962` | `#0A0A0A` | `#C9A962` | `#0A0A0A` |
| `scheme-4` | Deep black alt | `#121212` | `#FFFFFF` | `#C9A962` | `#0A0A0A` | `#C9A962` | `#0A0A0A` |
| `scheme-5` | Rose-gold accent | `#B76E79` | `#FFFFFF` | `#FFFFFF` | `#B76E79` | `#FFFFFF` | `#0A0A0A` |
| `scheme-899854cd-…` (custom) | Footer / deep dark | `#0A0A0A` | `#FFFFFF` | `#C9A962` | `#0A0A0A` | `#C9A962` | `#0A0A0A` |

Leave `background_gradient` empty for all schemes unless a later pass adds metallic gradients.

## Global semantic assignments

Minimal chrome updates so dark feels primary without rewriting page templates:

| Setting / group | Target scheme |
|-----------------|---------------|
| Announcement bar (`sections/header-group.json`) | `scheme-5` (rose gold) — already; keep |
| Header (`sections/header-group.json`) | `scheme-3` (dark primary); menu scheme `scheme-3` |
| Footer (`sections/footer-group.json`) | custom dark scheme (already on custom ID; colors updated) |
| Card / collection card / blog card color scheme | `scheme-2` |
| Sale badge | `scheme-5` |
| Sold-out badge | `scheme-4` |
| Cart color scheme | `scheme-3` (dark-primary chrome) |

Do **not** bulk-edit `templates/index.json` or other page templates’ section `color_scheme` values in this phase. Existing assignments will pick up new scheme colors automatically (e.g. pink `scheme-2` becomes soft invert).

## Metallic finish (optional light CSS)

If gold buttons feel flat after scheme updates, add a **minimal** sheen via existing button styles (e.g. subtle linear-gradient on `.button` using gold → soft gold). Constraints:

- No purple/glow trends
- No new dependencies
- Prefer scoped `{% stylesheet %}` or small addition in `assets/base.css`
- Skip if scheme hex alone reads sufficiently metallic

## Files to touch

1. `config/settings_data.json` — `current.color_schemes` + `presets.Default.color_schemes` + badge/cart/card scheme IDs as needed  
2. `sections/header-group.json` — header → `scheme-3`  
3. `sections/footer-group.json` — only if color values on custom scheme aren’t enough (assignment already dark)  
4. Optionally `assets/base.css` — metallic button sheen  

## Out of scope

- Homepage section order / new sections / Parfums Du Ciel layout recreation  
- Typography / font changes  
- Logo replacement  
- Rewriting content copy  
- Hardcoding colors outside the scheme system except optional metallic sheen  

## Success criteria

1. Storefront chrome (header/footer) reads black + gold, not berry/pink.  
2. Light sections use white/soft invert with black buttons.  
3. Dark sections use gold primary buttons.  
4. Accent moments use rose gold `#B76E79`, not raw `#7c244f` or old pink `#ca83a6`.  
5. Homepage structure unchanged; colors update wherever schemes are already assigned.  

## Follow-up (later)

Homepage rearrange/recreate aligned to Parfums Du Ciel flow with Maison Veil metallic styling — separate plan after this palette lands.
