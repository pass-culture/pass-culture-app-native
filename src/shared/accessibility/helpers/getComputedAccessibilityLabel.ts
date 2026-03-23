/**
 * Builds an accessibility label by joining multiple string parts.
 * Automatically ignores empty, null, or undefined values.
 *
 * Example:
 *  computedAccessibilityLabel("Title", "Subtitle", "Credit")
 *  => "Title - Subtitle - Credit"
 */
export function getComputedAccessibilityLabel(...parts: (string | undefined | null)[]): string {
  return parts.filter((part) => part?.trim()).join(' - ')
}
