import { useEffect, useState } from 'react'

/**
 * This hook is used to debounce a value, instead of `lodash.debounce` that is used to debounce a method.
 *
 * @example
 * const [searchInput, setSearchInput] = useState("")
 * const debouncedSearchInput = useDebounce(searchInput, 500)
 * // `debouncedSearchInput` will change once in 500ms
 */
export function useDebounce<T>(value: T, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler)
      }
    },
    [value, delay] // Only re-call effect if value or delay changes
  )

  return debouncedValue
}
