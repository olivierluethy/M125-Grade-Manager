<template>
  <motion.div
    :initial="{ opacity: 0, y: 8 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.2, ease: 'easeOut' }"
    class="flex flex-col items-center rounded-card border border-dashed border-paper-border px-6 py-16 text-center dark:border-night-border"
  >
    <span
      class="flex h-12 w-12 items-center justify-center rounded-full bg-paper-raised text-paper-muted dark:bg-night-raised dark:text-night-muted"
    >
      <BookOpen class="h-5 w-5" />
    </span>
    <h2 class="mt-4 text-lg font-semibold text-paper-text dark:text-night-text">
      No subjects yet
    </h2>
    <p class="mt-1 max-w-sm text-sm text-paper-muted dark:text-night-muted">
      Add your first subject to start tracking grades against the 4.0 pass line.
    </p>
    <button
      type="button"
      class="focus-ring mt-5 inline-flex items-center gap-1.5 rounded-control bg-brand px-4 py-2 text-sm font-medium text-white transition-[background-color,transform] duration-150 hover:bg-brand-soft active:scale-95 dark:bg-brand-fill motion-reduce:transition-none motion-reduce:active:scale-100"
      @click="$emit('add')"
    >
      <Plus class="h-4 w-4" />
      Add subject
    </button>
  </motion.div>
</template>

<script setup>
import { motion } from 'motion-v'
import { BookOpen, Plus } from 'lucide-vue-next'

defineEmits(['add'])
</script>
