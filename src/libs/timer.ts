import { useEffect, useRef, useState } from 'react'

import { currentTimestamp } from 'libs/dates'

export const TIMER_NOT_INITIALIZED = -1

export function useTimer(
  startTime: number | undefined | null,
  shouldStop: (elapsed: number) => boolean,
  onSecondTick?: (elapsed: number) => void
) {
  const [elapsedTime, setElapsedTime] = useState(TIMER_NOT_INITIALIZED)
  const timerIdRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // set the timer only if the starttime is known
    if (typeof startTime !== 'number' || startTime <= 0) {
      return () => void 0
    }

    // launch timer
    timerIdRef.current = global.setInterval(() => {
      const newElapsedTime = currentTimestamp() - (startTime ?? 0)

      // stop timer conditionally
      if (shouldStop(newElapsedTime)) {
        return exports.clearLocalInterval(timerIdRef.current)
      }

      if (onSecondTick) {
        onSecondTick(newElapsedTime)
      } else {
        setElapsedTime(newElapsedTime)
      }
    }, 1000)

    return () => {
      exports.clearLocalInterval(timerIdRef.current)
    }
  }, [startTime])

  return elapsedTime
}

export function clearLocalInterval(timerId: NodeJS.Timeout | null) {
  timerId && clearInterval(timerId)
}
