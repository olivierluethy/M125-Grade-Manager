import { computed, ref } from 'vue'

const STORAGE_KEY = 'gm-theme'

/*
 * The initial class is applied by the inline script in public/index.html so
 * there is no flash of the wrong theme. This composable reads that result back
 * rather than recomputing it, so the two can never disagree.
 */
function currentTheme() {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

const theme = ref(currentTheme())

function apply(next) {
  theme.value = next
  const root = document.documentElement
  root.classList.toggle('dark', next === 'dark')
  root.style.colorScheme = next
  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch (e) {
    /* Preference is not persisted, but the theme still applies. */
  }
}

export function useTheme() {
  const isDark = computed(() => theme.value === 'dark')

  function toggle() {
    apply(theme.value === 'dark' ? 'light' : 'dark')
  }

  return { theme, isDark, toggle }
}
