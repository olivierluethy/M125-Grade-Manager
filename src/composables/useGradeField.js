import { isAllowedGradeKey, sanitizeGradeText } from '@/utils/validation'

/**
 * Keyboard/paste handlers that make a text input accept numbers only.
 *
 * Letters are blocked at the keystroke rather than flagged afterwards, and
 * pasted text is sanitised before it lands. Shared by the add-grade field and
 * inline chip editing so the two cannot drift apart.
 *
 * @param {import('vue').Ref<string>} model the ref holding the field's text
 */
export function useGradeField(model) {
  function onKeydown(event) {
    /* Never interfere with shortcuts, or the browser's own editing keys. */
    if (event.ctrlKey || event.metaKey || event.altKey) return
    if (!isAllowedGradeKey(event.key, model.value)) {
      event.preventDefault()
    }
  }

  function onPaste(event) {
    event.preventDefault()
    const pasted = (event.clipboardData || window.clipboardData).getData('text')
    model.value = sanitizeGradeText(model.value + pasted)
  }

  /*
   * Backstop for input that arrives without a keypress — IME composition,
   * mobile autocomplete, drag-and-drop.
   */
  function onInput(event) {
    const clean = sanitizeGradeText(event.target.value)
    if (clean !== event.target.value) {
      event.target.value = clean
    }
    model.value = clean
  }

  return { onKeydown, onPaste, onInput }
}
