<template>
  <motion.article
    :initial="{ opacity: 0, y: 8, scale: 0.98 }"
    :animate="{ opacity: 1, y: 0, scale: 1 }"
    :exit="{ opacity: 0, scale: 0.97 }"
    :transition="{ duration: 0.2, ease: 'easeOut' }"
    layout
    class="group/card flex h-full flex-col rounded-card border border-paper-border bg-paper-card p-4 shadow-card transition-shadow duration-200 hover:shadow-card-hover dark:border-night-border dark:bg-night-card dark:shadow-card-dark motion-reduce:transition-none"
  >
    <!-- Header: title, rename, delete -->
    <header class="mb-3 flex min-h-[2rem] items-start justify-between gap-1">
      <template v-if="renaming">
        <div class="min-w-0 flex-1">
          <input
            ref="renameEl"
            v-model="renameDraft"
            type="text"
            :maxlength="SUBJECT_NAME_MAX"
            class="w-full rounded-md border border-brand-bright bg-paper-raised px-2 py-1 text-base font-semibold text-paper-text outline-none dark:bg-night-raised dark:text-night-text"
            :aria-label="`Rename ${subject.name}`"
            :aria-invalid="Boolean(renameError)"
            @keydown.enter.prevent="saveRename"
            @keydown.esc.prevent="cancelRename"
          />
          <p
            v-if="renameError"
            class="mt-1 text-xs text-tone-fail-fg dark:text-tone-fail-dfg"
            role="alert"
          >
            {{ renameError }}
          </p>
        </div>
        <button
          type="button"
          class="focus-ring-card mt-1 rounded-md p-1.5 text-paper-muted hover:text-brand-bright dark:text-night-muted"
          aria-label="Save subject name"
          @mousedown.prevent
          @click="saveRename"
        >
          <Check class="h-4 w-4" />
        </button>
      </template>

      <template v-else>
        <button
          type="button"
          class="focus-ring-card -ml-1 min-w-0 rounded-md px-1 py-0.5 text-left"
          :aria-label="`Rename ${subject.name}`"
          @click="startRename"
        >
          <h2
            class="truncate text-base font-semibold tracking-tight text-paper-text dark:text-night-text"
          >
            {{ subject.name }}
          </h2>
        </button>

        <!-- Same reasoning as the chip delete: always visible on touch. -->
        <div class="flex shrink-0 items-center opacity-70 transition-opacity duration-150 focus-within:opacity-100 hover:opacity-100 hoverable:opacity-0 hoverable:group-hover/card:opacity-100 motion-reduce:transition-none">
          <button
            type="button"
            class="focus-ring-card rounded-md p-1.5 text-paper-muted transition-colors duration-150 hover:text-brand-bright dark:text-night-muted motion-reduce:transition-none"
            :aria-label="`Rename ${subject.name}`"
            @click="startRename"
          >
            <Pencil class="h-3.5 w-3.5" />
          </button>

          <ConfirmPopover
            :title="`Delete ${subject.name}?`"
            :body="deleteBody"
            confirm-label="Delete"
            :trigger-label="`Delete ${subject.name}`"
            @confirm="$emit('remove-subject')"
          >
            <template #trigger>
              <Trash2 class="h-3.5 w-3.5" />
            </template>
          </ConfirmPopover>
        </div>
      </template>
    </header>

    <!-- Pinned input: never moves as grades are added -->
    <GradeInput
      :subject-name="subject.name"
      class="shrink-0"
      @add="$emit('add-mark', $event)"
    />

    <!--
      The only growing zone.

      The padding is load-bearing, not decoration. `overflow-y-auto` makes the
      other axis compute from `visible` to `auto` per the CSS overflow spec, so
      this element clips on both axes; without an inset, each chip's focus ring
      (4px outside its box, from ring-offset-2) and its hover/exit scale were
      cut off against all four edges. The negative margin keeps the chips
      optically aligned with the input above despite the inset.
    -->
    <div
      class="-mx-2 mt-1 min-h-0 flex-1 overflow-y-auto p-2"
      :class="subject.marks.length ? 'max-h-grades' : ''"
    >
      <p
        v-if="!subject.marks.length"
        class="py-2 text-xs text-paper-muted dark:text-night-muted"
      >
        Grades you add appear here.
      </p>

      <div v-else class="flex flex-wrap gap-x-2 gap-y-2">
        <AnimatePresence>
          <motion.div
            v-for="(mark, index) in subject.marks"
            :key="`${index}-${mark}`"
            :initial="{ opacity: 0, scale: 0.8 }"
            :animate="{ opacity: 1, scale: 1 }"
            :exit="{ opacity: 0, scale: 0.8 }"
            :transition="{ duration: 0.15, ease: 'easeOut' }"
            layout
          >
            <GradeChip
              :value="mark"
              @delete="$emit('remove-mark', index)"
              @update="$emit('update-mark', { index, value: $event })"
              @error="chipError = $event"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <p
        v-if="chipError"
        class="mt-2 text-xs text-tone-fail-fg dark:text-tone-fail-dfg"
        role="alert"
      >
        {{ chipError }}
      </p>
    </div>

    <!--
      Pinned footer. mt-auto (not mt-3) because once the grade list hits its
      max-height the leftover space is unallocated, and the footer would
      otherwise float up under a short list instead of sitting at the bottom.
    -->
    <div class="mt-auto shrink-0 pt-3">
      <AverageFooter :average="subject.average" :count="subject.count" />
    </div>
  </motion.article>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { AnimatePresence, motion } from 'motion-v'
import { Check, Pencil, Trash2 } from 'lucide-vue-next'
import GradeInput from './GradeInput.vue'
import GradeChip from './GradeChip.vue'
import AverageFooter from './AverageFooter.vue'
import ConfirmPopover from './ConfirmPopover.vue'
import { SUBJECT_NAME_MAX, validateSubjectName } from '@/utils/validation'

const props = defineProps({
  subject: { type: Object, required: true },
  existingNames: { type: Array, default: () => [] },
})
const emit = defineEmits([
  'add-mark',
  'remove-mark',
  'update-mark',
  'rename',
  'remove-subject',
])

const renaming = ref(false)
const renameDraft = ref('')
const renameError = ref('')
const renameEl = ref(null)
const chipError = ref('')

const deleteBody = computed(() =>
  props.subject.count
    ? `Its ${props.subject.count} ${props.subject.count === 1 ? 'grade' : 'grades'} will be removed too.`
    : 'This subject has no grades.'
)

/* Clear a chip error once the grades actually change. */
watch(() => props.subject.marks.length, () => (chipError.value = ''))

async function startRename() {
  renameDraft.value = props.subject.name
  renameError.value = ''
  renaming.value = true
  await nextTick()
  renameEl.value?.select()
}

function saveRename() {
  const result = validateSubjectName(
    renameDraft.value,
    props.existingNames,
    props.subject.name
  )
  if (!result.ok) {
    renameError.value = result.error
    return
  }
  if (result.value !== props.subject.name) emit('rename', result.value)
  renaming.value = false
}

function cancelRename() {
  renaming.value = false
  renameError.value = ''
}
</script>
