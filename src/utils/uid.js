/*
 * Unique ids for wiring inputs to their labels and error messages.
 * Vue's own useId() is 3.5+, and this project runs Vue 3.2.
 */
let counter = 0

export function nextUid() {
  counter += 1
  return `u${counter}`
}
