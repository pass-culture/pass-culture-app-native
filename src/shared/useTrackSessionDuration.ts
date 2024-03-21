import { useRef, useEffect } from 'react'

import { useAppStateChange } from 'libs/appState'

export const useTrackSessionDuration = (callback: (durationInSeconds: number) => void) => {
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

  useEffect(() => {
    const startTime = new Date()
    return () => {
      const endTime = new Date()
      const totalDurationOnPage = (endTime.getTime() - startTime.getTime()) / 1000
      const durationWithoutBackgroundTime = totalDurationOnPage - timeInBackground.current
      callback(Number(durationWithoutBackgroundTime.toFixed(3)))
    }
  }, [callback])
}
