import { computed, ref, watch } from 'vue'
import { GRADE_MAX, GRADE_MIN } from '@/utils/gradeTone'

const STORAGE_KEY = 'gm-subjects'

/*
 * Subjects the app ships with on first run. These were hardcoded in the
 * original app; they are now seed data, and can be renamed or deleted.
 */
const SEED_SUBJECTS = [
  'GES',
  'M146',
  'M151',
  'M152',
  'M153',
  'M306',
  'NWS',
  'SPK',
  'WUR',
]

let nextId = 1
const makeId = () => `s${nextId++}`

function seed() {
  return SEED_SUBJECTS.map((name) => ({ id: makeId(), name, marks: [] }))
}

/*
 * Only values that are real grades survive a reload. Checking the range
 * matters as much as checking for NaN: Number(null) is 0, which is finite but
 * not a grade, and letting it through would drag the average down.
 */
function isStoredGrade(value) {
  return (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    value >= GRADE_MIN &&
    value <= GRADE_MAX
  )
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seed()

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return seed()

    /* Rebuild defensively — stored data is user-editable. */
    const restored = parsed
      .filter((s) => s && typeof s.name === 'string')
      .map((s) => ({
        id: makeId(),
        name: s.name,
        marks: Array.isArray(s.marks) ? s.marks.filter(isStoredGrade) : [],
      }))

    /* An empty stored array is a real state (user deleted everything). */
    return restored
  } catch (e) {
    return seed()
  }
}

/**
 * Mean of a list of marks.
 *
 * Deliberately identical to the original: total divided by count, with no
 * rounding. An empty list yields NaN, which callers surface as an empty state
 * rather than printing "0.00".
 */
function averageOf(marks) {
  if (!marks.length) return NaN
  let total = 0
  for (let i = 0; i < marks.length; i++) total += marks[i]
  return total / marks.length
}

/** Round to the nearest half. Unchanged from the original app. */
export function roundHalf(num) {
  return Math.round(num * 2) / 2
}

const subjects = ref(load())

watch(
  subjects,
  (value) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(value.map(({ name, marks }) => ({ name, marks })))
      )
    } catch (e) {
      /* Storage full or blocked — the app still works in memory. */
    }
  },
  { deep: true }
)

/*
 * Averages are derived rather than stored. The original recomputed a stored
 * `average` field inside every mutation; with editing and deletion added there
 * are now six mutation paths, and a computed value cannot go stale.
 * The arithmetic itself is unchanged.
 */
const subjectsView = computed(() =>
  subjects.value.map((s) => ({
    ...s,
    average: averageOf(s.marks),
    count: s.marks.length,
  }))
)

/**
 * Mean across every mark in every subject.
 *
 * Note this is the mean of all marks pooled together, not the mean of the
 * per-subject averages — matching the original implementation.
 */
const overallAverage = computed(() => {
  let total = 0
  let count = 0
  for (const subject of subjects.value) {
    for (const mark of subject.marks) {
      total += mark
      count++
    }
  }
  return count ? total / count : NaN
})

const totalGradeCount = computed(() =>
  subjects.value.reduce((sum, s) => sum + s.marks.length, 0)
)

const subjectNames = computed(() => subjects.value.map((s) => s.name))

function findSubject(id) {
  return subjects.value.find((s) => s.id === id) || null
}

function addSubject(name) {
  const subject = { id: makeId(), name, marks: [] }
  subjects.value.push(subject)
  return subject
}

function renameSubject(id, name) {
  const subject = findSubject(id)
  if (subject) subject.name = name
}

function removeSubject(id) {
  const index = subjects.value.findIndex((s) => s.id === id)
  if (index !== -1) subjects.value.splice(index, 1)
}

function addMark(id, grade) {
  const subject = findSubject(id)
  if (subject) subject.marks.push(grade)
}

/** Remove by position, so duplicate values delete the one actually clicked. */
function removeMarkAt(id, index) {
  const subject = findSubject(id)
  if (subject && index >= 0 && index < subject.marks.length) {
    subject.marks.splice(index, 1)
  }
}

function updateMarkAt(id, index, grade) {
  const subject = findSubject(id)
  if (subject && index >= 0 && index < subject.marks.length) {
    subject.marks[index] = grade
  }
}

export function useGrades() {
  return {
    subjects: subjectsView,
    subjectNames,
    overallAverage,
    totalGradeCount,
    addSubject,
    renameSubject,
    removeSubject,
    addMark,
    removeMarkAt,
    updateMarkAt,
    roundHalf,
  }
}
