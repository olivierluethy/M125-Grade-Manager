<template>
  <div class="relative">
    <button
      ref="triggerEl"
      type="button"
      class="focus-ring-card rounded-md p-1.5 text-paper-muted transition-colors duration-150 hover:bg-tone-fail-bg hover:text-tone-fail-fg dark:text-night-muted dark:hover:bg-tone-fail-dbg dark:hover:text-tone-fail-dfg motion-reduce:transition-none"
      :aria-label="triggerLabel"
      :aria-expanded="open"
      @click="toggle"
    >
      <slot name="trigger" />
    </button>

    <AnimatePresence>
      <motion.div
        v-if="open"
        :initial="{ opacity: 0, scale: 0.95, y: -4 }"
        :animate="{ opacity: 1, scale: 1, y: 0 }"
        :exit="{ opacity: 0, scale: 0.95, y: -4 }"
        :transition="{ duration: 0.15, ease: 'easeOut' }"
        class="absolute right-0 top-full z-20 mt-1 w-52 origin-top-right rounded-control border border-paper-border bg-paper-card p-3 shadow-card dark:border-night-border dark:bg-night-card dark:shadow-card-dark"
        role="dialog"
        :aria-label="title"
        @keydown.esc.stop="close"
      >
        <p class="text-sm font-medium text-paper-text dark:text-night-text">
          {{ title }}
        </p>
        <p class="mt-1 text-xs text-paper-muted dark:text-night-muted">
          {{ body }}
        </p>
        <div class="mt-3 flex justify-end gap-2">
          <button
            type="button"
            class="focus-ring-card rounded-md px-2.5 py-1 text-xs font-medium text-paper-muted transition-colors duration-150 hover:bg-paper-raised dark:text-night-muted dark:hover:bg-night-raised motion-reduce:transition-none"
            @click="close"
          >
            Keep
          </button>
          <button
            ref="confirmEl"
            type="button"
            class="focus-ring-card rounded-md bg-tone-fail-fg px-2.5 py-1 text-xs font-medium text-white transition-colors duration-150 hover:opacity-90 dark:bg-tone-fail-dfg dark:text-night-base motion-reduce:transition-none"
            @click="confirm"
          >
            {{ confirmLabel }}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { AnimatePresence, motion } from 'motion-v'

defineProps({
  title: { type: String, required: true },
  body: { type: String, default: '' },
  confirmLabel: { type: String, default: 'Delete' },
  triggerLabel: { type: String, required: true },
})
const emit = defineEmits(['confirm'])

const open = ref(false)
const triggerEl = ref(null)
const confirmEl = ref(null)

function close() {
  open.value = false
}

function toggle() {
  open.value = !open.value
}

function confirm() {
  open.value = false
  emit('confirm')
}

/* Move focus into the popover so it is operable by keyboard. */
watch(open, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    confirmEl.value?.focus()
  } else {
    triggerEl.value?.focus()
  }
})

function onDocumentPointerDown(event) {
  if (!open.value) return
  if (!triggerEl.value?.parentElement?.contains(event.target)) close()
}

function onDocumentKeydown(event) {
  if (event.key === 'Escape') close()
}

document.addEventListener('pointerdown', onDocumentPointerDown)
document.addEventListener('keydown', onDocumentKeydown)

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown)
  document.removeEventListener('keydown', onDocumentKeydown)
})
</script>
