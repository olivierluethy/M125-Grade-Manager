<template>
  <motion.div
    layout
    class="flex h-full flex-col rounded-card border border-dashed p-4 transition-colors duration-200 motion-reduce:transition-none"
    :class="
      open
        ? 'border-brand-bright bg-paper-card dark:bg-night-card'
        : 'border-paper-border bg-transparent hover:border-brand-bright dark:border-night-border'
    "
  >
    <!-- Collapsed -->
    <button
      v-if="!open"
      type="button"
      class="focus-ring group/add flex h-full min-h-[8rem] w-full flex-col items-center justify-center gap-2 rounded-control text-paper-muted transition-colors duration-150 hover:text-brand-bright dark:text-night-muted motion-reduce:transition-none"
      aria-label="Add a subject"
      @click="expand"
    >
      <span
        class="flex h-10 w-10 items-center justify-center rounded-full border border-current transition-transform duration-150 group-hover/add:scale-110 group-active/add:scale-95 motion-reduce:transition-none motion-reduce:group-hover/add:scale-100"
      >
        <Plus class="h-5 w-5" />
      </span>
      <span class="text-sm font-medium">Add subject</span>
    </button>

    <!-- Expanded -->
    <motion.form
      v-else
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :transition="{ duration: 0.18, ease: 'easeOut' }"
      class="flex h-full flex-col"
      @submit.prevent="submit"
    >
      <label
        :for="fieldId"
        class="font-mono text-[10px] font-medium uppercase tracking-wider text-paper-muted dark:text-night-muted"
      >
        Subject name
      </label>

      <input
        :id="fieldId"
        ref="inputEl"
        v-model="draft"
        type="text"
        :maxlength="SUBJECT_NAME_MAX"
        autocomplete="off"
        placeholder="e.g. Mathematics, M151, History"
        class="mt-1.5 w-full rounded-control border bg-paper-raised px-3 py-2 text-sm text-paper-text outline-none transition-colors duration-150 placeholder:text-paper-muted focus:border-brand-bright dark:bg-night-raised dark:text-night-text dark:placeholder:text-night-muted motion-reduce:transition-none"
        :class="
          error
            ? 'border-tone-fail-ring dark:border-tone-fail-dring'
            : 'border-paper-border dark:border-night-border'
        "
        :aria-invalid="Boolean(error)"
        :aria-describedby="error ? errorId : undefined"
        @keydown.esc.prevent="collapse"
        @input="error = ''"
      />

      <p
        v-if="error"
        :id="errorId"
        class="mt-1.5 flex items-center gap-1 text-xs text-tone-fail-fg dark:text-tone-fail-dfg"
        role="alert"
      >
        <AlertCircle class="h-3 w-3 shrink-0" />
        {{ error }}
      </p>

      <div class="mt-auto flex items-center justify-end gap-2 pt-3">
        <button
          type="button"
          class="focus-ring-card rounded-control px-3 py-1.5 text-sm font-medium text-paper-muted transition-colors duration-150 hover:bg-paper-raised dark:text-night-muted dark:hover:bg-night-raised motion-reduce:transition-none"
          @click="collapse"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="focus-ring-card rounded-control bg-brand px-3 py-1.5 text-sm font-medium text-white transition-[background-color,transform] duration-150 hover:bg-brand-soft active:scale-95 dark:bg-brand-fill dark:hover:opacity-90 motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          Add subject
        </button>
      </div>
    </motion.form>
  </motion.div>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import { motion } from 'motion-v'
import { AlertCircle, Plus } from 'lucide-vue-next'
import { SUBJECT_NAME_MAX, validateSubjectName } from '@/utils/validation'
import { nextUid } from '@/utils/uid'

const props = defineProps({
  existingNames: { type: Array, default: () => [] },
})
const emit = defineEmits(['add'])

const open = ref(false)
const draft = ref('')
const error = ref('')
const inputEl = ref(null)

const uid = nextUid()
const fieldId = `subject-${uid}`
const errorId = `subject-error-${uid}`

async function expand() {
  open.value = true
  error.value = ''
  await nextTick()
  inputEl.value?.focus()
}

function collapse() {
  open.value = false
  draft.value = ''
  error.value = ''
}

function submit() {
  const result = validateSubjectName(draft.value, props.existingNames)
  if (!result.ok) {
    error.value = result.error
    return
  }
  emit('add', result.value)
  draft.value = ''
  error.value = ''
  /* Stay open so several subjects can be added in a row. */
  inputEl.value?.focus()
}

defineExpose({ expand })
</script>
