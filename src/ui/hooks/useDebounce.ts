import { debounce, DebounceSettings } from 'lodash'
import { useEffect, useMemo, useRef } from 'react'

/**
 * This hook is used to debounce, using `lodash.debounce` more safely.
 * You can use it in a React component, even setting some state (which can be usually tricky).
 *
 * @param callback - The function to debounce
 * @param delay - The number of milliseconds to delay.
 * @param options - Same options as `lodash.debounce`. See https://lodash.com/docs#debounce for more details.
 *
 * @example
 * ```js
 * const debouncedFunc = useDebounce(func, 500)
 * debouncedFunc() // debouncedFunc will be called once in 500ms
 * ```
 *
 * Inspired from https://www.developerway.com/posts/debouncing-in-react
 */
export function useDebounce<T, U>(
  callback: (props: T) => U,
  delay: number,
  options?: DebounceSettings
) {
  const ref = useRef<(props: T) => U>()

  useEffect(() => {
    ref.current = callback
  }, [callback])

  const debouncedCallback = useMemo(() => {
    const func = (props: T) => ref.current?.(props)

    return debounce(func, delay, options)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return debouncedCallback
}
