import { useRef, useEffect } from 'react'

import { useAppStateChange } from 'libs/appState'
import { analytics } from 'libs/firebase/analytics'

export const useTrackOfferSeenDuration = (offerId: number) => {
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
      const totalDurationOnPageInSeconds = (endTime.getTime() - startTime.getTime()) / 1000
      const durationWithoutBackgroundTimeInSec =
        totalDurationOnPageInSeconds - timeInBackground.current
      analytics.logOfferSeenDuration(offerId, +durationWithoutBackgroundTimeInSec.toFixed(3))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
