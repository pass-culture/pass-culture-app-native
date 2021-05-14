import { useEffect, useRef, useState } from 'react'

import { currentTimestamp } from 'libs/dates'

export function useTimer(
  startTime: number | undefined | null,
  shouldStop: (elapsed: number) => boolean,
  onSecondPass?: (elapsed: number) => void
) {
  const [elapsedTime, setElapsedTime] = useState(0)
  const timerIdRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // set the timer only if the starttime is known
    if (typeof startTime !== 'number' || startTime <= 0) {
      return () => void 0
    }

    // launch timer
    timerIdRef.current = setInterval(() => {
      const newElapsedTime = currentTimestamp() - (startTime ?? 0)

      // stop timer conditionally
      if (shouldStop(newElapsedTime)) {
        return exports.clearLocalInterval(timerIdRef.current)
      }

      setElapsedTime(newElapsedTime)
      onSecondPass?.(newElapsedTime)
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
