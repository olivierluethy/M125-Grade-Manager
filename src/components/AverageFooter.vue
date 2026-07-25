<template>
  <div class="border-t border-paper-border pt-3 dark:border-night-border">
    <!-- Empty state: never show NaN or a meaningless 0.00 -->
    <template v-if="!hasAverage">
      <div class="flex items-baseline justify-between">
        <span class="text-sm text-paper-muted dark:text-night-muted">No grades yet</span>
        <span class="font-mono text-[10px] uppercase tracking-wider text-paper-muted dark:text-night-muted">
          Ø
        </span>
      </div>
      <div class="mt-2">
        <PassRail :value="NaN" />
      </div>
    </template>

    <template v-else>
      <div class="flex items-baseline justify-between gap-2">
        <div class="flex items-baseline gap-2">
          <span
            class="font-mono text-3xl font-semibold leading-none tabular-nums transition-colors duration-200 motion-reduce:transition-none"
            :class="tone.text"
          >
            {{ displayed.toFixed(2) }}
          </span>
          <span
            class="flex items-center gap-1 text-xs font-medium"
            :class="tone.text"
          >
            <component :is="tone.icon" class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {{ tone.label }}
          </span>
        </div>
        <!--
          Wraps naturally rather than using a <br>, which would run the words
          together for screen readers ("based on2 grades").
        -->
        <span
          class="max-w-[5.5rem] shrink-0 text-right text-[11px] leading-tight text-paper-muted dark:text-night-muted"
        >
          based on {{ count }} {{ count === 1 ? 'grade' : 'grades' }}
        </span>
      </div>
      <div class="mt-2.5">
        <PassRail :value="average" />
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, toRef } from 'vue'
import PassRail from './PassRail.vue'
import { getGradeTone } from '@/utils/gradeTone'
import { useCountUp } from '@/composables/useCountUp'

const props = defineProps({
  average: { type: Number, default: NaN },
  count: { type: Number, default: 0 },
})

const hasAverage = computed(() => Number.isFinite(props.average))
const tone = computed(() => getGradeTone(props.average))

/* Tween the readout so a changed average is noticeable without being loud. */
const displayed = useCountUp(toRef(props, 'average'))
</script>
