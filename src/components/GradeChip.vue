<template>
  <!--
    Editing. Matches the display chip's min-height so switching between the
    two states never changes the chip's box and reflows the list.
  -->
  <div
    v-if="editing"
    class="flex min-h-[2.25rem] items-center gap-1 rounded-chip px-1 ring-1"
    :class="tone.chip"
  >
    <input
      ref="inputEl"
      v-model="draft"
      type="text"
      inputmode="decimal"
      class="w-14 rounded-md bg-transparent px-1.5 py-1.5 text-center font-mono text-sm font-medium leading-5 outline-none"
      :aria-label="`Edit grade ${formatted}`"
      @keydown="onKeydown"
      @keydown.enter.prevent="save"
      @keydown.esc.prevent="cancel"
      @paste="onPaste"
      @input="onInput"
      @blur="save"
    />
    <button
      type="button"
      class="focus-ring-card grid h-7 w-7 shrink-0 place-items-center rounded-md transition-colors duration-150 hover:bg-black/10 dark:hover:bg-white/10 motion-reduce:transition-none"
      aria-label="Save grade"
      title="Save grade"
      @mousedown.prevent
      @click="save"
    >
      <Check class="h-4 w-4" />
    </button>
  </div>

  <!-- Display -->
  <div
    v-else
    class="group/chip flex min-h-[2.25rem] items-center rounded-chip px-1 ring-1 transition-shadow duration-150 hover:shadow-sm motion-reduce:transition-none"
    :class="tone.chip"
  >
    <!--
      The value itself starts an edit, so the affordance works whether the user
      reaches for the number or the pencil. min-w keeps a "5" and a "4.75" on
      the same grid.
    -->
    <button
      type="button"
      class="focus-ring-card min-w-[3rem] cursor-text rounded-md px-1.5 py-1.5 text-center font-mono text-sm font-medium leading-5 tabular-nums transition-colors duration-150 hover:bg-black/5 dark:hover:bg-white/5 motion-reduce:transition-none"
      :aria-label="editLabel"
      :title="editLabel"
      @click="startEdit"
    >
      {{ formatted }}
    </button>

    <span class="mx-0.5 h-4 w-px shrink-0 bg-current opacity-20" aria-hidden="true" />

    <!--
      Both actions are always in the DOM at a fixed size, so revealing them
      cannot reflow the list. They sit at low opacity at rest rather than fully
      hidden: reserved-but-invisible space reads as a gap in the chip, and the
      hint is what makes editing discoverable in the first place. Pointer
      devices get the reveal on hover; touch devices, which have no hover, keep
      them at full strength.
    -->
    <span
      class="flex shrink-0 items-center gap-1 opacity-100 transition-opacity duration-150 hoverable:opacity-40 hoverable:group-hover/chip:opacity-100 hoverable:group-focus-within/chip:opacity-100 motion-reduce:transition-none"
    >
      <!--
        Distinct from the value's label: both open the same editor, but a
        screen reader announcing them identically gives no way to tell the two
        stops apart while tabbing.
      -->
      <button
        type="button"
        class="focus-ring-card grid h-7 w-7 place-items-center rounded-md transition-colors duration-150 hover:bg-black/10 dark:hover:bg-white/10 motion-reduce:transition-none"
        :aria-label="pencilLabel"
        :title="pencilLabel"
        @click="startEdit"
      >
        <Pencil class="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        class="focus-ring-card grid h-7 w-7 place-items-center rounded-md transition-colors duration-150 hover:bg-black/10 dark:hover:bg-white/10 motion-reduce:transition-none"
        :aria-label="deleteLabel"
        :title="deleteLabel"
        @click="$emit('delete')"
      >
        <Trash2 class="h-3.5 w-3.5" />
      </button>
    </span>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import { Check, Pencil, Trash2 } from 'lucide-vue-next'
import { getGradeTone } from '@/utils/gradeTone'
import { parseGrade } from '@/utils/validation'
import { useGradeField } from '@/composables/useGradeField'

const props = defineProps({
  value: { type: Number, required: true },
})
const emit = defineEmits(['delete', 'update', 'error'])

const editing = ref(false)
const draft = ref('')
const inputEl = ref(null)

const tone = computed(() => getGradeTone(props.value))

/* Trailing zeros are noise on a chip: 4.50 reads better as 4.5. */
const formatted = computed(() => String(props.value))

const editLabel = computed(() => `Grade ${formatted.value} — click to edit`)
const pencilLabel = computed(() => `Edit grade ${formatted.value}`)
const deleteLabel = computed(() => `Delete grade ${formatted.value}`)

const { onKeydown, onPaste, onInput } = useGradeField(draft)

async function startEdit() {
  draft.value = String(props.value)
  editing.value = true
  await nextTick()
  inputEl.value?.select()
}

function save() {
  if (!editing.value) return
  const result = parseGrade(draft.value)
  if (!result.ok) {
    emit('error', result.error)
    /* Revert rather than drop the grade. */
    editing.value = false
    return
  }
  if (result.value !== props.value) emit('update', result.value)
  editing.value = false
}

function cancel() {
  editing.value = false
}
</script>
