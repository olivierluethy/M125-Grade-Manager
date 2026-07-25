<template>
  <!--
    The 1-6 grade scale with the 4.0 pass line etched at 60%.
    Position carries the pass/fail information, so tone is never conveyed by
    colour alone.
  -->
  <div class="w-full">
    <div
      class="relative w-full rounded-full bg-paper-raised dark:bg-night-raised"
      :class="tall ? 'h-2' : 'h-1.5'"
      role="img"
      :aria-label="ariaLabel"
    >
      <!-- The pass line at 4.0 -->
      <div
        class="absolute inset-y-[-3px] w-px bg-paper-muted/70 dark:bg-night-muted/70"
        style="left: 60%"
      />

      <!-- Filled portion up to the current value -->
      <div
        v-if="hasValue"
        class="absolute inset-y-0 left-0 rounded-full transition-[width] duration-200 ease-out motion-reduce:transition-none"
        :class="tone.rail"
        :style="{ width: `${position * 100}%` }"
      />

      <!-- Marker -->
      <div
        v-if="hasValue"
        class="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-paper-card transition-[left] duration-200 ease-out dark:ring-night-card motion-reduce:transition-none"
        :class="tone.dot"
        :style="{ left: `${position * 100}%` }"
      />
    </div>

    <!-- Labels sit under the marks they name; "4 pass" tracks the 60% tick. -->
    <div
      v-if="scale"
      class="relative mt-1 h-4 font-mono text-[10px] text-paper-muted dark:text-night-muted"
    >
      <span class="absolute left-0">1</span>
      <span class="absolute -translate-x-1/2 whitespace-nowrap" style="left: 60%">
        4 pass
      </span>
      <span class="absolute right-0">6</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getGradeTone, railPosition } from '@/utils/gradeTone'

const props = defineProps({
  value: { type: Number, default: NaN },
  scale: { type: Boolean, default: false },
  tall: { type: Boolean, default: false },
})

const hasValue = computed(() => Number.isFinite(props.value))
const tone = computed(() => getGradeTone(props.value))
const position = computed(() => railPosition(props.value))

const ariaLabel = computed(() =>
  hasValue.value
    ? `${props.value.toFixed(2)} on the 1 to 6 scale. ${tone.value.label}. Pass mark is 4.0.`
    : 'No grades yet'
)
</script>
