/**
 * This is a test helper that is used in Storybook and tests.
 * @param count Items count to generate
 */
export function generateItems(count = 20) {
  return new Array(count).fill(null).map((_, index) => ({
    name: `Item ${index}`,
  }))
}
