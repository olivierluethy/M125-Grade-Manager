<template>
  <div>
    <div
      class="flex items-center gap-2 rounded-control border bg-paper-raised px-3 transition-colors duration-150 focus-within:border-brand-bright dark:bg-night-raised motion-reduce:transition-none"
      :class="
        error
          ? 'border-tone-fail-ring dark:border-tone-fail-dring'
          : 'border-paper-border dark:border-night-border'
      "
    >
      <input
        :id="fieldId"
        ref="inputEl"
        v-model="draft"
        type="text"
        inputmode="decimal"
        autocomplete="off"
        placeholder="Add grade"
        class="min-w-0 flex-1 bg-transparent py-2 font-mono text-sm text-paper-text outline-none placeholder:font-sans placeholder:text-paper-muted dark:text-night-text dark:placeholder:text-night-muted"
        :aria-label="`Add a grade to ${subjectName}`"
        :aria-invalid="Boolean(error)"
        :aria-describedby="error ? errorId : hintId"
        @keydown="onKeydown"
        @keydown.enter.prevent="submit"
        @paste="onPaste"
        @input="handleInput"
      />
      <span
        :id="hintId"
        class="shrink-0 font-mono text-[10px] uppercase tracking-wider text-paper-muted dark:text-night-muted"
      >
        1–6
      </span>
    </div>

    <p
      v-if="error"
      :id="errorId"
      class="mt-1 flex items-center gap-1 text-xs text-tone-fail-fg dark:text-tone-fail-dfg"
      role="alert"
    >
      <AlertCircle class="h-3 w-3 shrink-0" />
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { AlertCircle } from 'lucide-vue-next'
import { parseGrade } from '@/utils/validation'
import { useGradeField } from '@/composables/useGradeField'
import { nextUid } from '@/utils/uid'

defineProps({
  subjectName: { type: String, required: true },
})
const emit = defineEmits(['add'])

const draft = ref('')
const error = ref('')
const inputEl = ref(null)

const uid = nextUid()
const fieldId = `grade-${uid}`
const hintId = `grade-hint-${uid}`
const errorId = `grade-error-${uid}`

const { onKeydown, onPaste, onInput } = useGradeField(draft)

function handleInput(event) {
  onInput(event)
  if (error.value) error.value = ''
}

function submit() {
  const result = parseGrade(draft.value)
  if (!result.ok) {
    error.value = result.error
    return
  }
  emit('add', result.value)
  draft.value = ''
  error.value = ''
  /* Keep focus so several grades can be entered in a row. */
  inputEl.value?.focus()
}

defineExpose({ focus: () => inputEl.value?.focus() })
</script>
