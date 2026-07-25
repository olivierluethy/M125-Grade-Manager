<template>
  <button
    type="button"
    class="focus-ring relative flex h-9 w-9 items-center justify-center rounded-full border border-paper-border bg-paper-card text-paper-muted transition-colors duration-150 hover:text-brand-bright dark:border-night-border dark:bg-night-card dark:text-night-muted motion-reduce:transition-none"
    :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    :aria-pressed="isDark"
    @click="toggle"
  >
    <AnimatePresence mode="wait">
      <motion.span
        :key="isDark ? 'moon' : 'sun'"
        :initial="{ opacity: 0, rotate: -60, scale: 0.7 }"
        :animate="{ opacity: 1, rotate: 0, scale: 1 }"
        :exit="{ opacity: 0, rotate: 60, scale: 0.7 }"
        :transition="{ duration: 0.18, ease: 'easeOut' }"
        class="flex items-center justify-center"
      >
        <Moon v-if="isDark" class="h-4 w-4" />
        <Sun v-else class="h-4 w-4" />
      </motion.span>
    </AnimatePresence>
  </button>
</template>

<script setup>
import { AnimatePresence, motion } from 'motion-v'
import { Moon, Sun } from 'lucide-vue-next'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggle } = useTheme()
</script>
