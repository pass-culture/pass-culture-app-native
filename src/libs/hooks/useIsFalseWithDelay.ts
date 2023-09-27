import { useState, useEffect } from 'react'

/**
 * This hook is useful for skeleton animations.
 * When we start fetching, we want to show the skeleton straight away.
 * If the network request is fast (less than 300ms), we don't want the
 * skeleton to disappear right away, so we artificially delay the request.
 *
 * @param condition boolean
 * @param delay number
 * @returns boolean
 */
export const useIsFalseWithDelay = (condition: boolean, delay: number): boolean => {
  const [delayedCondition, setDelayedCondition] = useState(condition)

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    if (condition) {
      setDelayedCondition(true)
    } else {
      timer = globalThis.setTimeout(() => {
        setDelayedCondition(false)
      }, delay)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condition])

  return delayedCondition
}
