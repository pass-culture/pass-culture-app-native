import { debounce, DebounceSettings } from 'lodash'
import { useEffect, useMemo, useRef } from 'react'

type WithParamCallback<T, U> = (props: T) => U
type NoParamCallback<U> = () => U
type Callback<T, U> = WithParamCallback<T, U> | NoParamCallback<U>
const hasNoParams = <T, U>(func?: Callback<T, U>): func is NoParamCallback<U> => func?.length === 0

export function useDebounce<U>(
  callback: NoParamCallback<U>,
  delay: number,
  options?: DebounceSettings
): NoParamCallback<U>
export function useDebounce<T, U>(
  callback: WithParamCallback<T, U>,
  delay: number,
  options?: DebounceSettings
): WithParamCallback<T, U>
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
  callback: Callback<T, U>,
  delay: number,
  options?: DebounceSettings
): Callback<T, U | undefined> {
  const ref = useRef<Callback<T, U>>(callback)

  useEffect(() => {
    ref.current = callback
  }, [callback])

  const debouncedCallback = useMemo(() => {
    const func = (props: T) => (hasNoParams(ref.current) ? ref.current() : ref.current?.(props))

    return debounce(func, delay, options)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return debouncedCallback
}
