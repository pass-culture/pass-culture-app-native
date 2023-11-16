/**
 * This is a test helper that is used in Storybook and tests.
 * @param count Items count to generate
 */
export function generateItems(count: number) {
  return new Array(count).fill(null).map((_, index) => ({
    name: `Item ${index}`,
  }))
}

/**
 * Will be used if user navigates on keyboard to get current focused element.
 * Since `VariableSizeList` recreates all of its components we need a way to re-focus
 * the currently selected element.
 */
export function getFocusedItemIndex() {
  const focusedElement = document.activeElement as HTMLAnchorElement | undefined

  if (!focusedElement) return null

  const wrapperListElement = focusedElement.closest('[data-itemindex]')
  const focusedItemIndex = wrapperListElement?.getAttribute('data-itemindex')

  return Number(focusedItemIndex)
}
