import { onBeforeUnmount, ref, watch } from 'vue'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Tween a number toward a target when it changes.
 *
 * Snaps instantly when reduced motion is requested, and when moving to or from
 * a non-finite value (there is nothing meaningful to animate between "no
 * grades" and a number).
 *
 * @param {import('vue').Ref<number>|(() => number)} source
 * @param {number} duration ms
 */
export function useCountUp(source, duration = 220) {
  const read = typeof source === 'function' ? source : () => source.value
  const display = ref(read())
  let frame = null

  function stop() {
    if (frame !== null) cancelAnimationFrame(frame)
    frame = null
  }

  watch(read, (to, from) => {
    stop()

    if (!Number.isFinite(to) || !Number.isFinite(from) || prefersReducedMotion()) {
      display.value = to
      return
    }

    const start = performance.now()
    const delta = to - from

    const step = (now) => {
      const t = Math.min(1, (now - start) / duration)
      /* easeOutCubic — settles quickly, no overshoot on a numeric readout. */
      const eased = 1 - Math.pow(1 - t, 3)
      display.value = from + delta * eased
      frame = t < 1 ? requestAnimationFrame(step) : null
    }
    frame = requestAnimationFrame(step)
  })

  onBeforeUnmount(stop)

  return display
}
