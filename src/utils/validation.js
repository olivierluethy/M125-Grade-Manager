import { GRADE_MAX, GRADE_MIN } from './gradeTone'

export const SUBJECT_NAME_MAX = 40

/*
 * Grade input handling.
 *
 * The field must make letters impossible to type rather than flagging them
 * afterwards, so everything here works on raw strings before they ever reach
 * the model.
 */

/** Characters a grade field is allowed to contain while being typed. */
const ALLOWED_GRADE_CHARS = /[^0-9.,]/g

/**
 * Strip anything that is not a digit or a decimal separator, normalise `,`
 * to `.`, and collapse repeated separators so "4,,5" and "4.5.5" cannot form.
 * Used for both keystrokes and pasted text.
 */
export function sanitizeGradeText(raw) {
  let text = String(raw ?? '').replace(ALLOWED_GRADE_CHARS, '')
  text = text.replace(/,/g, '.')

  const first = text.indexOf('.')
  if (first !== -1) {
    /* Keep the first separator, drop any later ones. */
    text = text.slice(0, first + 1) + text.slice(first + 1).replace(/\./g, '')
  }
  return text
}

/**
 * Would this keystroke produce a legal grade string? Used to block the
 * keypress itself.
 */
export function isAllowedGradeKey(key, currentValue) {
  if (key.length !== 1) return true /* Tab, Backspace, arrows, etc. */
  if (/[0-9]/.test(key)) return true
  if (key === '.' || key === ',') return !currentValue.includes('.')
  return false
}

/**
 * Validate a grade string against the Swiss 1.0-6.0 range.
 * @returns {{ok: true, value: number} | {ok: false, error: string}}
 */
export function parseGrade(raw) {
  const text = sanitizeGradeText(raw).trim()

  if (text === '' || text === '.') {
    return { ok: false, error: 'Enter a grade first.' }
  }

  const n = Number(text)
  if (!Number.isFinite(n)) {
    return { ok: false, error: 'That is not a number.' }
  }
  if (n < GRADE_MIN || n > GRADE_MAX) {
    return { ok: false, error: `Grades run from ${GRADE_MIN.toFixed(1)} to ${GRADE_MAX.toFixed(1)}.` }
  }

  /* Same quantisation the original app applied on entry. */
  return { ok: true, value: Math.round(n * 100) / 100 }
}

/**
 * Validate a subject name. Letters and digits are both allowed, so "M151",
 * "GES" and "Mathematik 2" are all valid.
 *
 * @param {string} raw
 * @param {string[]} existingNames names already in use
 * @param {string} [ignoreName] a name to exempt, so renaming to the same
 *                              value is not reported as a duplicate
 * @returns {{ok: true, value: string} | {ok: false, error: string}}
 */
export function validateSubjectName(raw, existingNames = [], ignoreName = null) {
  const name = String(raw ?? '').trim()

  if (name === '') {
    return { ok: false, error: 'Give the subject a name.' }
  }
  if (name.length > SUBJECT_NAME_MAX) {
    return {
      ok: false,
      error: `Keep it under ${SUBJECT_NAME_MAX} characters — that is ${name.length}.`,
    }
  }

  const lowered = name.toLowerCase()
  const ignored = ignoreName ? ignoreName.trim().toLowerCase() : null
  const clash = existingNames.some(
    (existing) => existing.toLowerCase() === lowered && existing.toLowerCase() !== ignored
  )
  if (clash) {
    return { ok: false, error: `${name} already exists.` }
  }

  return { ok: true, value: name }
}
