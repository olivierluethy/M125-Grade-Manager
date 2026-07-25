<template>
  <div class="min-h-screen bg-paper-base transition-colors duration-200 dark:bg-night-base motion-reduce:transition-none">
    <div class="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
      <header class="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1
            class="text-xl font-semibold tracking-tight text-paper-text dark:text-night-text sm:text-2xl"
          >
            Grade-Manager
          </h1>
          <p class="mt-0.5 text-xs text-paper-muted dark:text-night-muted">
            Swiss scale — 1 to 6, pass at 4.0
          </p>
        </div>
        <ThemeToggle />
      </header>

      <OverallStanding
        class="mb-6"
        :average="overallAverage"
        :grade-count="totalGradeCount"
        :subject-count="subjects.length"
      />

      <EmptyState v-if="showEmptyState" @add="revealAddCard" />

      <div
        v-else
        class="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
      >
        <AnimatePresence>
          <SubjectCard
            v-for="subject in subjects"
            :key="subject.id"
            :subject="subject"
            :existing-names="subjectNames"
            @add-mark="addMark(subject.id, $event)"
            @remove-mark="removeMarkAt(subject.id, $event)"
            @update-mark="updateMarkAt(subject.id, $event.index, $event.value)"
            @rename="renameSubject(subject.id, $event)"
            @remove-subject="removeSubject(subject.id)"
          />
        </AnimatePresence>

        <AddSubjectCard
          ref="addCardEl"
          :existing-names="subjectNames"
          @add="addSubject"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { AnimatePresence } from 'motion-v'
import SubjectCard from '@/components/SubjectCard.vue'
import AddSubjectCard from '@/components/AddSubjectCard.vue'
import OverallStanding from '@/components/OverallStanding.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import EmptyState from '@/components/EmptyState.vue'
import { useGrades } from '@/composables/useGrades'

const {
  subjects,
  subjectNames,
  overallAverage,
  totalGradeCount,
  addSubject,
  renameSubject,
  removeSubject,
  addMark,
  removeMarkAt,
  updateMarkAt,
} = useGrades()

const addCardEl = ref(null)

/*
 * With no subjects the empty state stands alone; choosing "Add subject" there
 * swaps in the grid so the add card can take focus. Deleting the last subject
 * returns to the empty state.
 */
const addCardRevealed = ref(false)
const showEmptyState = computed(() => !subjects.value.length && !addCardRevealed.value)

watch(
  () => subjects.value.length,
  (count) => {
    if (count === 0) addCardRevealed.value = false
  }
)

async function revealAddCard() {
  addCardRevealed.value = true
  await nextTick()
  addCardEl.value?.expand()
}
</script>
