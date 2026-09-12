# UI Direction: "Warm Kitchen"

This document specifies a visual redesign of the app — editorial and organic,
built around a cream background, forest green + terracotta accents, and a
serif/sans type pairing. It replaces the current default light theme; it does
not change any behavior, routes, data model, or component structure.

Reference mockups (5 screens, static): a Claude Design canvas at
https://claude.ai/code/artifact/d713c87f-c9fa-42cf-b0ae-a7692126e1bd
(page 1 = "Design" = this direction; page 2 = two rejected alternates, kept
for reference only).

## 1. Tokens — `src/index.css`

Replace the light-mode block of `:root` with:

```css
:root {
  --text: #2b241a;
  --text-muted: #8a7f6a;
  --text-h: #211b12;
  --bg: #faf6ee;
  --surface: #fffefb;
  --border: #e8dfcc;
  --accent: #3f6b4a;
  --accent-bg: #e8f0e5;

  --pass-bg: #eaf1e4;
  --pass-border: #7a9c66;
  --pass-text: #3f5c31;
  --fail-bg: #fbe7dc;
  --fail-border: #c9713f;
  --fail-text: #9a4b26;
  --unknown-bg: #f2ede1;
  --unknown-border: #cbbfa3;
  --unknown-text: #8a7f68;

  --serif: 'Lora', serif;
  --sans: 'Work Sans', system-ui, sans-serif;
  color-scheme: light dark;
  font: 16px/145% var(--sans);
  color: var(--text);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

**Dark mode is not designed yet.** The mockups only cover light mode. Either
leave the existing `@media (prefers-color-scheme: dark)` block as a
placeholder (it will look mismatched — off-brand blue-gray against the new
warm palette) or ask for a dark variant of Warm Kitchen before shipping. Don't
invent dark values from the light ones without checking contrast.

Add the Google Fonts link to `index.html`'s `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lora:wght@500;600&family=Work+Sans:wght@400;500;600&display=swap" rel="stylesheet">
```

Headings (`h1`/`h2`/screen titles) use `var(--serif)` at weight 600; body
text, buttons, and labels stay on `var(--sans)`.

## 2. Component-level changes

**Icons**: replace the plain-glyph icons (`⚙` gear, `✎` pencil, `×` close,
`✓`/checkbox) with inline stroke SVGs (feather-style, 2px stroke,
round caps), colored via `currentColor` so they inherit `--text-muted` /
`--accent` per state. The mockups use this exact gear path — reuse it:

```html
<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
```

Pencil (edit tags), X (remove), and check icons are the same feather set —
see the mockup source in the artifact (`Main.dc.html`, `CatalogA.dc.html`, etc.
via "Export" in the canvas, or ask Claude to pull the exact paths again).

**`AppShell.tsx` / `AppShell.css`**: add a small brand mark (see §4 — the
terracotta checkmark, 18px) to the left of the "Grocery List" title. Title
font becomes `var(--serif)`, weight 600, 21px.

**`TabBar.css`**: unchanged structurally (top border + accent on active tab);
just inherits the new `--accent`/`--border`/`--text-muted`.

**`DietToggleBar.css`**: chips get `border-radius: 999px`, `padding: 6px 12px`,
active state = `background: var(--accent-bg); border-color: var(--accent);
color: var(--accent); font-weight: 600`.

**`ItemRow.css` / `ThisWeekItemRow.css`**: card radius `14px` (up from
`10px`), padding `13px 14px`. Checkbox becomes a custom 24px circle
(`border: 2px solid var(--text-muted)`, filled `var(--accent)` + white check
SVG when checked) instead of a native `<input type="checkbox">` — this is a
visual-only change; keep the native input for accessibility/state and style
it via a wrapping span, or use `appearance: none` + background-image.

**`DietTagEditor.css`**: pass/fail buttons become pill-shaped
(`border-radius: 999px`) with the pass/fail tint colors; unchanged layout.

**`SettingsScreen.css`**: invite-code box gets a dashed accent border,
`border-radius: 16px`, code text in `var(--serif)`. Buttons: `border-radius:
12px`; primary = filled `var(--accent)`; danger = `var(--fail-bg)` background
with `var(--fail-border)`/`var(--fail-text)`.

**`OnboardingScreen.css`**: centered layout, add the brand mark (see §4) in a
64px rounded-square badge (`background: var(--accent-bg)`) above the title;
title in `var(--serif)` 26px; buttons `border-radius: 14px`.

## 3. Not covered / left as-is

- Dark mode (see above).
- The two rejected directions (Checklist Mono, Bold Fresh) — page 2 of the
  canvas, kept only as a record of what was considered.
- No new screens or flows — this is a re-skin of the existing five screens
  (Onboarding, This Week, High Frequency / Less Frequent, Catalog, Settings).

## 4. App icon — decided: "Checklist Card"

Forest-green background (`#3f6b4a`), cream rounded card with three list
lines, top one checked off in terracotta. **This is already applied**:

- `icon-src/icon.svg`, `icon-foreground.svg`, `icon-background.svg`,
  `icon-maskable.svg` have been overwritten with this design (source is also
  kept at `icon-src/candidate-c-checklist/` for reference).
- `public/icons/*` (icon-192, icon-512, maskable-512, apple-touch-icon,
  favicon-32) and `assets/icon.png` / `assets/icon-foreground.png` /
  `assets/icon-background.png` have already been regenerated to match — you
  do not need to run `icon-src/generate.mjs` yourself, though re-running it
  is harmless (it will just reproduce the same files from the same sources).
- The rejected candidate, `icon-src/candidate-b-basket/` (cream background,
  basket silhouette), is left in place only as a record — delete it whenever
  you want.
- `assets/splash.png` / `icon-src/splash.svg` are **untouched** — still the
  old green/white cart mark. Worth a matching pass (cream background,
  checklist mark, centered) before shipping, but not done here.

**In-app mark**: the small brand mark in the header (next to "Grocery List"),
in the Settings header, and the logo on the Onboarding screen has been
updated to match — a filled terracotta circle with a cream checkmark
(the same checkmark used inside the icon's card), simple enough to read at
~18px:

```html
<svg width="18" height="18" viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="#c9713f"/><path d="M32 52 L44 64 L70 36" fill="none" stroke="#fdf9f0" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>
```

This replaces the basket mark used in the previous draft of this document —
see the updated mockups (page 1 of the canvas) for it in context.
