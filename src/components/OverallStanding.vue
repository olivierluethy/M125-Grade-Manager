<template>
  <!--
    The thesis of the page: not "here is a number", but "here is where you sit
    relative to the 4.0 pass line".
  -->
  <div
    class="rounded-card border border-paper-border bg-paper-card p-4 shadow-card dark:border-night-border dark:bg-night-card dark:shadow-card-dark sm:p-5"
  >
    <div class="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
      <div>
        <p
          class="flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-paper-muted dark:text-night-muted"
        >
          <BarChart3 class="h-3 w-3 shrink-0" aria-hidden="true" />
          Overall standing
        </p>
        <div class="mt-1 flex items-baseline gap-3">
          <span
            v-if="hasAverage"
            class="font-mono text-5xl font-semibold leading-none tabular-nums transition-colors duration-200 motion-reduce:transition-none"
            :class="tone.text"
          >
            {{ displayed.toFixed(2) }}
          </span>
          <span
            v-else
            class="font-mono text-5xl font-semibold leading-none text-paper-border dark:text-night-border"
          >
            —
          </span>

          <span
            v-if="hasAverage"
            class="flex items-center gap-1.5 text-sm font-medium"
            :class="tone.text"
          >
            <component :is="tone.icon" class="h-4 w-4 shrink-0" aria-hidden="true" />
            {{ tone.label }}
          </span>
        </div>
      </div>

      <p class="text-xs text-paper-muted dark:text-night-muted">
        <template v-if="hasAverage">
          {{ gradeCount }} {{ gradeCount === 1 ? 'grade' : 'grades' }} across
          {{ subjectCount }} {{ subjectCount === 1 ? 'subject' : 'subjects' }}
          <span class="mt-0.5 block">
            Rounded to the nearest half: <span class="font-mono">{{ rounded }}</span>
          </span>
        </template>
        <template v-else> Add a grade to see where you stand. </template>
      </p>
    </div>

    <div class="mt-4">
      <PassRail :value="average" scale tall />
    </div>
  </div>
</template>

<script setup>
import { computed, toRef } from 'vue'
import { BarChart3 } from 'lucide-vue-next'
import PassRail from './PassRail.vue'
import { getGradeTone } from '@/utils/gradeTone'
import { useCountUp } from '@/composables/useCountUp'
import { roundHalf } from '@/composables/useGrades'

const props = defineProps({
  average: { type: Number, default: NaN },
  gradeCount: { type: Number, default: 0 },
  subjectCount: { type: Number, default: 0 },
})

const hasAverage = computed(() => Number.isFinite(props.average))
const tone = computed(() => getGradeTone(props.average))
const displayed = useCountUp(toRef(props, 'average'))

/* Same half-point rounding the original app displayed. */
const rounded = computed(() =>
  hasAverage.value ? roundHalf(props.average).toFixed(2) : '—'
)
</script>
