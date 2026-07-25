# Grade-Manager — Restyle & Harden

**Date:** 2026-07-25
**Status:** Approved

## Goal

Restyle the Grade-Manager Vue app onto Tailwind, add dark/light theming, fix the
card layout, and add the validation and editing affordances the app is missing.
Business logic (average calculation) is preserved exactly.

## Starting point

- Vue 3.2.33, Vue CLI 5 (webpack), vue-router 4. **Not** Vite.
- All styling lives in two `<style lang="scss">` blocks: `src/App.vue` (global,
  unscoped) and `src/components/HelloWorld.vue` (scoped, component unused).
  There are **no standalone `.scss` files**.
- All state and logic is inline in `src/views/HomeView.vue`'s `setup()`.
  No composables, no store, **no persistence**.
- Subjects are stored as **object keys** on a single `ref({})`, seeded with 9
  hardcoded entries: GES, M146, M151, M152, M153, M306, NWS, SPK, WUR.

## Decisions

| Question | Decision |
| --- | --- |
| Persistence | **Add** `localStorage` for subjects + grades (none existed). |
| Seed subjects | Keep the 9 as **first-run seed**, now deletable. |
| Aesthetic | Keep navy `#0A2463` as the brand anchor. |
| Tailwind version | **v3.4.19** — the brief requires `tailwind.config` tokens and `darkMode: 'class'`; v4 moves config into CSS and would fight that. |
| Motion library | **`motion-v`** (brief's preference). Built and ran cleanly on Vue 3.2 under webpack, so the `@vueuse/motion` fallback was not needed. |
| Theme on first load | **Dark always wins.** The brief asks for both "dark is the default" and "fall back to prefers-color-scheme"; Chrome no longer reports `no-preference`, so every user reports light or dark and the two rules cannot both hold. A stored choice still overrides. |

## Design direction

### Thesis

The audience thinks in one question: *am I above 4?* The 4.0 pass line is the
central fact of the Swiss scale, so the design is built around **distance from
4.0**, not the raw number.

### Signature: the pass rail

A 1–6 scale track with the 4.0 threshold etched at 60% (`(4-1)/(6-1)`), and the
average plotted as a marker. Large in the header for overall standing; small and
repeated in each card footer.

It earns its place twice: it comes from the subject's own world (a report-card
scale), and it satisfies the "do not rely on colour alone" requirement
structurally — pass/fail is encoded as **position**, not just hue.

Everything else in the UI stays quiet so the rail carries the design.

### Colour tokens

Dark surfaces are navy-*tinted*, not grey, so `#0A2463` reads as the substrate.

| Role | Dark (default) | Light |
| --- | --- | --- |
| page | `#060B1A` | `#F5F7FC` |
| card | `#0E1730` | `#FFFFFF` |
| raised | `#16203D` | `#EEF1F9` |
| border | `#24304F` | `#D8DEEE` |
| text | `#E8ECF7` | `#0A2463` |
| muted | `#93A0C0` | `#55618A` |
| accent (focus) | `#4C6FFF` | `#4C6FFF` |
| button fill | `#4364F5` | `#0A2463` |

`brand.fill` (`#4364F5`) exists separately from `brand.bright` (`#4C6FFF`)
because white text on `#4C6FFF` measures 4.18:1, below WCAG AA. `bright` is
kept for focus rings, where the 3:1 non-text threshold applies.

Grade tones are tuned per theme rather than inverted:

| Range | Tone | Dark text / bg | Light text / bg |
| --- | --- | --- | --- |
| `< 4.0` | insufficient | `#FF9B92` / `#3A1512` | `#B3261E` / `#FDECEA` |
| `4.0–4.99` | sufficient | `#FFC46B` / `#3A2A0D` | `#8A5200` / `#FFF4E0` |
| `>= 5.0` | good | `#6EE7A0` / `#0D2D1C` | `#146B3A` / `#E6F5EC` |

### Typography

**IBM Plex Sans** + **IBM Plex Mono** — one superfamily, two roles. Mono carries
the personality: every numeral, plus small tracked-uppercase labels. Plex's
institutional-technical register suits a technical school, and its true tabular
figures align the grade chips without width hacks.

## Architecture

`HomeView.vue` is split. New files:

- `src/composables/useGrades.js` — state, mutations, localStorage.
- `src/composables/useTheme.js` — theme class + persistence.
- `src/utils/gradeTone.js` — the single `getGradeTone(value)` helper.
- `src/components/` — `SubjectCard`, `GradeInput`, `GradeChip`, `PassRail`,
  `AverageFooter`, `AddSubjectCard`, `ThemeToggle`, `ConfirmPopover`,
  `EmptyState`.
- `src/assets/main.css` — the single global stylesheet.
- `tailwind.config.js`, `postcss.config.js`.

Removed: `HelloWorld.vue`, both SCSS blocks, `sass` + `sass-loader`.

### Data shape change

Subjects move from object-keyed to an **array of `{ id, name, marks }`**.
Required because object keys make rename impossible and let duplicate names
silently overwrite each other — both blocked by the brief.

### Preserved logic (must not change)

- Average = `sum / count` over a subject's marks.
- Grades quantised on entry with `Math.round(g * 100) / 100`.
- All-subjects average displayed through `roundHalf(n) = Math.round(n*2)/2`.
- Zero grades yields no average — surfaced as an empty state instead of `NaN`.

## Card layout

Fixed three-zone card, `h-full` in a `items-stretch` grid:

1. **Header** — subject title, inline rename, delete.
2. **Input** — pinned directly under the title, never moves.
3. **Grade list** — the only growing zone, `max-h-*` + `overflow-y-auto`.
4. **Footer** — average + pass rail, pinned to the bottom.

Responsive: 1 col mobile, 2 tablet, 3–5 desktop.

## Validation

**Subject name:** letters *and* digits both allowed (`M151`, `GES`,
`Mathematik 2` are valid). Reject only empty/whitespace-only, >40 chars, and
case-insensitive duplicates. Inline errors, no `alert()`.

**Grade:** numeric only — keystrokes blocked and pasted input sanitised, not
flagged after the fact. `inputmode="decimal"`. Range 1.0–6.0. Both `.` and `,`
accepted and normalised to `.`. Enter submits, field clears and keeps focus.

## Out of scope

- The broken `/about` route in `src/router/index.js` (declared with no
  `component`) — pre-existing, unrelated to this brief.
- Pre-existing uncommitted `package-lock.json` churn is left alone.
