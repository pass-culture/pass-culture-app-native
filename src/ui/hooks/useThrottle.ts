import { throttle, ThrottleSettings } from 'lodash'
import { useEffect, useMemo, useRef } from 'react'

/**
 * This hook is used to throttle, using `lodash.throttle` more safely.
 * You can use it in a React component, even setting some state (which can be usually tricky).
 *
 * @param callback - The function to throttle
 * @param delay - The number of milliseconds to throttle invocations to.
 * @param [options] - Same options as `lodash.throttle`. See https://lodash.com/docs#throttle for more details.
 *
 * @example
 * ```js
 * const throttledFunc = useThrottle(func, 500)
 * throttledFunc() // throttledFunc will be called once in 500ms
 * ```
 *
 * Inspired from https://www.developerway.com/posts/debouncing-in-react
 */
export function useThrottle<T, U>(
  callback: (props: T) => U,
  delay: number,
  options?: ThrottleSettings
) {
  const ref = useRef<(props: T) => U>()

  useEffect(() => {
    ref.current = callback
  }, [callback])

  const throttledCallback = useMemo(() => {
    const func = (props: T) => ref.current?.(props)

    return throttle(func, delay, options)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return throttledCallback
}
