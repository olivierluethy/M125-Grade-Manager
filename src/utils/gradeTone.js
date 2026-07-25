/*
 * Swiss grading scale: 1 is worst, 6 is best, 4.0 is the pass line.
 *
 * This is the single source of truth for the thresholds. Both the individual
 * grade chips and the average display read from here — the numbers 4.0 and 5.0
 * must not appear as tone thresholds anywhere else.
 */

import { Minus, TrendingDown, TrendingUp } from 'lucide-vue-next'

export const GRADE_MIN = 1
export const GRADE_MAX = 6
export const GRADE_PASS = 4

/**
 * Classify a grade or average into a tone.
 *
 * Class strings are written out in full rather than composed, because
 * Tailwind's scanner only sees literal class names in the source.
 *
 * @param {number|null|undefined} value
 * @returns {{key: string, label: string, icon: object, chip: string, text: string, rail: string, dot: string}}
 */
export function getGradeTone(value) {
  const n = Number(value)

  if (!Number.isFinite(n)) return TONES.none
  if (n < GRADE_PASS) return TONES.fail
  if (n < 5) return TONES.pass
  return TONES.good
}

const TONES = {
  fail: {
    key: 'fail',
    /* Label and icon both accompany the colour, so hue is never the sole signal. */
    label: 'Insufficient',
    icon: TrendingDown,
    chip:
      'bg-tone-fail-bg text-tone-fail-fg ring-tone-fail-ring ' +
      'dark:bg-tone-fail-dbg dark:text-tone-fail-dfg dark:ring-tone-fail-dring',
    text: 'text-tone-fail-fg dark:text-tone-fail-dfg',
    rail: 'bg-tone-fail-fg dark:bg-tone-fail-dfg',
    dot: 'bg-tone-fail-fg dark:bg-tone-fail-dfg',
  },
  pass: {
    key: 'pass',
    label: 'Sufficient',
    icon: Minus,
    chip:
      'bg-tone-pass-bg text-tone-pass-fg ring-tone-pass-ring ' +
      'dark:bg-tone-pass-dbg dark:text-tone-pass-dfg dark:ring-tone-pass-dring',
    text: 'text-tone-pass-fg dark:text-tone-pass-dfg',
    rail: 'bg-tone-pass-fg dark:bg-tone-pass-dfg',
    dot: 'bg-tone-pass-fg dark:bg-tone-pass-dfg',
  },
  good: {
    key: 'good',
    label: 'Good',
    icon: TrendingUp,
    chip:
      'bg-tone-good-bg text-tone-good-fg ring-tone-good-ring ' +
      'dark:bg-tone-good-dbg dark:text-tone-good-dfg dark:ring-tone-good-dring',
    text: 'text-tone-good-fg dark:text-tone-good-dfg',
    rail: 'bg-tone-good-fg dark:bg-tone-good-dfg',
    dot: 'bg-tone-good-fg dark:bg-tone-good-dfg',
  },
  none: {
    key: 'none',
    label: 'No grades',
    icon: Minus,
    chip:
      'bg-paper-raised text-paper-muted ring-paper-border ' +
      'dark:bg-night-raised dark:text-night-muted dark:ring-night-border',
    text: 'text-paper-muted dark:text-night-muted',
    rail: 'bg-paper-border dark:bg-night-border',
    dot: 'bg-paper-border dark:bg-night-border',
  },
}

/**
 * Position of a value on the 1..6 rail, as a 0..1 fraction.
 * 4.0 lands at exactly 0.6.
 */
export function railPosition(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return 0
  const clamped = Math.min(GRADE_MAX, Math.max(GRADE_MIN, n))
  return (clamped - GRADE_MIN) / (GRADE_MAX - GRADE_MIN)
}
