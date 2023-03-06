import debounce from 'lodash/debounce'
import { useEffect, useMemo, useRef } from 'react'

/**
 * This hook is used to debounce, using `lodash.debounce` more safely.
 * You can use it in a React component, even setting some state (which can be usually tricky).
 *
 * Inspired from https://www.developerway.com/posts/debouncing-in-react
 *
 * @example
 * const debouncedFunc = useDebounce(func, 500)
 * debouncedFunc() // debouncedFunc will be called once in 500ms
 */
export function useDebounce<T, U>(callback: (props: T) => U, delay: number) {
  const ref = useRef<(props: T) => U>()

  useEffect(() => {
    ref.current = callback
  }, [callback])

  const debouncedCallback = useMemo(() => {
    const func = (props: T) => ref.current?.(props)

    return debounce(func, delay)
  }, [delay])

  return debouncedCallback
}
