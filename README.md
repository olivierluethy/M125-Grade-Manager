# Grade-Manager

A grade tracker for the Swiss school system. Create subjects, enter grades, and
see at a glance whether each subject sits above the 4.0 pass line.

Built with Vue 3 and Tailwind CSS. Data lives in the browser — there is no
backend and no account.

---

## The grading scale

Swiss grades run from 1 (worst) to 6 (best), and 4.0 is the pass mark. The whole
interface is built around distance from that line rather than the raw number:
every average is plotted on a 1–6 rail with the pass mark etched at 60%, so
pass or fail reads from the marker's position.

| Range | Meaning | Tone |
| --- | --- | --- |
| below 4.0 | insufficient | red |
| 4.0 – 4.99 | sufficient | amber |
| 5.0 and above | good | green |

Colour is never the only signal. Each tone also carries a text label, its own
icon, and the marker position on the rail, so the coding survives colour
blindness and greyscale printing.

Thresholds live in exactly one place, `src/utils/gradeTone.js`. Both the
individual grade chips and the average displays read from it.

---

## Features

- **Subjects** — create, rename inline, and delete with a confirmation step.
  Names accept letters and digits, so `M151`, `GES` and `Mathematik 2` are all
  valid. Empty names, names over 40 characters, and case-insensitive duplicates
  are rejected with an inline message.
- **Grades** — enter, edit inline, and delete. The field accepts numbers only:
  letters cannot be typed and pasted text is sanitised. Both `.` and `,` work as
  the decimal separator. Values outside 1.0–6.0 are rejected.
- **Averages** — per subject, plus an overall standing across every grade.
  Recomputes immediately on every add, edit and delete.
- **Dark and light themes** — dark by default, toggled from the header, and
  remembered between visits. The theme is applied before first paint, so there
  is no flash of the wrong one.
- **Persistence** — subjects and grades are saved to `localStorage`.
- **Keyboard operable end to end**, with visible focus rings on every control.
- **Respects `prefers-reduced-motion`** — animations are disabled when the
  system asks for it.

---

## Getting started

Requires Node.js 18 or newer (developed on Node 24).

```bash
npm install
```

Start the dev server with hot reload:

```bash
npm run serve
```

Build for production into `dist/`:

```bash
npm run build
```

These are the only two scripts. The project has no linter or automated test
suite configured.

---

## Project structure

```
src/
├── assets/
│   ├── logo.png              Unused Vue CLI scaffold leftover
│   └── main.css              Tailwind entry, fonts, focus-ring utilities
├── components/
│   ├── AddSubjectCard.vue    Collapsed "+" card and the create form
│   ├── AverageFooter.vue     Per-subject average, pinned to the card bottom
│   ├── ConfirmPopover.vue    Inline confirmation for destructive actions
│   ├── EmptyState.vue        Shown when no subjects exist
│   ├── GradeChip.vue         One grade: value, inline edit, delete
│   ├── GradeInput.vue        Numeric-only add-grade field
│   ├── OverallStanding.vue   Header summary across all subjects
│   ├── PassRail.vue          The 1–6 scale with the 4.0 pass mark
│   ├── SubjectCard.vue       Card shell: title, input, grade list, average
│   └── ThemeToggle.vue       Sun/moon switch
├── composables/
│   ├── useCountUp.js         Tweens a number when it changes
│   ├── useGradeField.js      Numeric-only keystroke and paste handling
│   ├── useGrades.js          State, mutations, averages, persistence
│   └── useTheme.js           Theme class and persistence
├── utils/
│   ├── gradeTone.js          Swiss thresholds and tone classes
│   ├── uid.js                Ids for label/error wiring
│   └── validation.js         Grade and subject-name validation
└── views/
    └── HomeView.vue          Page layout and the card grid
```

---

## How it works

### State

All state lives in `useGrades.js` as a single module-level `ref`, shared by
every component that calls the composable. A subject is
`{ id, name, marks: number[] }`.

Averages are **derived, not stored** — a subject's average is a computed value
over its marks rather than a field updated by each mutation, so it cannot go
stale as editing and deletion paths are added. The arithmetic is a plain
`sum / count`; the overall standing is the mean of every mark pooled together,
not the mean of the per-subject averages.

A subject with no grades has no average. That case is surfaced as a "No grades
yet" empty state rather than printing `NaN` or a misleading `0.00`.

### Persistence

Two `localStorage` keys:

| Key | Contents |
| --- | --- |
| `gm-subjects` | `[{ name, marks }]` |
| `gm-theme` | `"dark"` or `"light"` |

Stored data is treated as untrusted on load: entries without a valid name are
dropped, and marks are range-checked against 1.0–6.0 rather than merely checked
for being finite. If storage is corrupt, unparseable or blocked entirely, the
app falls back to the seed subjects and keeps working in memory.

On first run the app ships with nine seed subjects (`GES`, `M146`, `M151`,
`M152`, `M153`, `M306`, `NWS`, `SPK`, `WUR`). They are ordinary subjects and can
be renamed or deleted; deleting all of them reveals the empty state.

### Theming

`darkMode: 'class'` in `tailwind.config.js`, with the `dark` class applied to
`<html>` by an inline script in `public/index.html` that runs before first
paint.

Dark wins on first load. A stored choice always overrides it.

---

## Design tokens

Colours, radii and shadows are defined in `tailwind.config.js` rather than
hardcoded in templates. `#0A2463` is the brand navy; dark-mode surfaces are
navy-tinted rather than neutral grey so the brand colour reads as the
substrate.

Every foreground/background pair in both themes meets WCAG AA contrast. Note
that `brand.bright` (`#4C6FFF`) is used for focus rings only, where the 3:1
non-text threshold applies; button fills use the slightly deeper `brand.fill`
(`#4364F5`), because white text on `#4C6FFF` measures 4.18:1 and fails AA.

`main.css` is the only stylesheet. It uses `@apply` in three places — the base
body colours and the two shared focus-ring utilities (`.focus-ring` and
`.focus-ring-card`, which differ only in the background they offset against).
Everything else is utility classes on the elements themselves.

---

## Built with

| | |
| --- | --- |
| [Vue 3](https://vuejs.org) | UI framework, Composition API via `<script setup>` |
| [Vue CLI 5](https://cli.vuejs.org) | Build tooling (webpack) |
| [Tailwind CSS 3.4](https://tailwindcss.com) | Styling, via PostCSS |
| [motion-v](https://motion.dev/docs/vue) | Animation (Motion for Vue) |
| [lucide-vue-next](https://lucide.dev) | Icons |
| [IBM Plex Sans / Mono](https://www.ibm.com/plex/) | Typography, self-hosted |

Tailwind v3 rather than v4, because the design tokens and `darkMode: 'class'`
are declared in `tailwind.config.js`, which v4 moves into CSS.

---

## Design notes

The reasoning behind the interface — colour choices with their measured
contrast, the pass-rail concept, and the trade-offs taken during the migration
from SCSS — is written up in
[`docs/superpowers/specs/`](docs/superpowers/specs/).

---

## Known limitations

- Data is per-browser. Clearing site data removes all subjects and grades, and
  nothing syncs between devices.
- The `/about` route in `src/router/index.js` is declared without a component
  and does not resolve. It predates this work and is unused.
