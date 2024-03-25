import { useCallback, useRef } from 'react'

import { useAppStateChange } from 'libs/appState'

/**
 * Use it in a useEffect or useFocusEffect, The passed callback should be wrapped in React.useCallback to avoid running the effect too often.
 */
export const useTrackDuration = (callback: (durationInSeconds: number) => void) => {
  const timeInBackground = useRef(0)
  const startTimeBackground = useRef<Date | null>(null)
  const onAppBecomeActive = () => {
    const endTimeBackground = new Date()
    if (startTimeBackground.current)
      timeInBackground.current +=
        (endTimeBackground.getTime() - startTimeBackground.current.getTime()) / 1000
  }
  const onAppBecomeInactive = () => {
    startTimeBackground.current = new Date()
  }

  useAppStateChange(onAppBecomeActive, onAppBecomeInactive)

  const getMappSeenDuration = useCallback(() => {
    const startTime = new Date()
    return () => {
      const endTime = new Date()
      const totalDurationOnPage = (endTime.getTime() - startTime.getTime()) / 1000
      const durationWithoutBackgroundTime = totalDurationOnPage - timeInBackground.current
      callback(Number(durationWithoutBackgroundTime.toFixed(3)))
    }
  }, [callback])
  return getMappSeenDuration
}
