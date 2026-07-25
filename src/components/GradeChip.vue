<template>
  <!-- Editing -->
  <div
    v-if="editing"
    class="flex items-center gap-1 rounded-chip px-1 py-0.5 ring-1"
    :class="tone.chip"
  >
    <input
      ref="inputEl"
      v-model="draft"
      type="text"
      inputmode="decimal"
      class="w-12 bg-transparent px-1 py-0.5 text-center font-mono text-sm font-medium outline-none"
      :aria-label="`Edit grade ${value}`"
      @keydown="onKeydown"
      @keydown.enter.prevent="save"
      @keydown.esc.prevent="cancel"
      @paste="onPaste"
      @input="onInput"
      @blur="save"
    />
    <button
      type="button"
      class="focus-ring-card rounded p-0.5 hover:opacity-70"
      aria-label="Save grade"
      @mousedown.prevent
      @click="save"
    >
      <Check class="h-3.5 w-3.5" />
    </button>
  </div>

  <!-- Display -->
  <div
    v-else
    class="group/chip relative flex items-center rounded-chip ring-1 transition-shadow"
    :class="tone.chip"
  >
    <button
      type="button"
      class="focus-ring-card rounded-chip py-1 pl-2.5 pr-1 font-mono text-sm font-medium tabular-nums"
      :aria-label="`Grade ${formatted}, ${tone.label}. Click to edit.`"
      @click="startEdit"
    >
      {{ formatted }}
    </button>
    <!--
      Visible by default so it is usable on touch, where there is no hover.
      Only pointer devices get the reveal-on-hover treatment.
    -->
    <button
      type="button"
      class="focus-ring-card mr-1 rounded p-0.5 opacity-60 transition-opacity duration-150 hover:opacity-100 focus-visible:opacity-100 hoverable:opacity-0 hoverable:group-hover/chip:opacity-60 motion-reduce:transition-none"
      :aria-label="`Delete grade ${formatted}`"
      @click="$emit('delete')"
    >
      <X class="h-3.5 w-3.5" />
    </button>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import { Check, X } from 'lucide-vue-next'
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
    /* Keep the original value rather than dropping the grade. */
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
