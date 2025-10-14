import { useCallback, useEffect, useRef } from 'react'
import { AppState, AppStateStatus, NativeEventSubscription } from 'react-native'

import { eventMonitoring } from 'libs/monitoring/services'

/**
 * Use it in a useEffect or useFocusEffect, The passed callback should be wrapped in React.useCallback to avoid running the effect too often.
 */
export const useTrackDuration = (callback: (durationInSeconds: number) => void) => {
  const timeInBackground = useRef(0)
  const startTimeBackground = useRef<Date | null>(null)
  const appStateChangeSubscription = useRef<NativeEventSubscription>(null)

  const onAppBecomeActive = () => {
    const endTimeBackground = new Date()
    if (startTimeBackground.current) {
      timeInBackground.current +=
        (endTimeBackground.getTime() - startTimeBackground.current.getTime()) / 1000
    }
  }
  const onAppBecomeInactive = () => {
    startTimeBackground.current = new Date()
  }

  /**
   * We cannot use useAppStateChange here, because we need to have more control over the "change" event subscription.
   * The default automated behavior on unmount is not enough.
   */
  useEffect(() => {
    appStateChangeSubscription.current = AppState.addEventListener(
      'change',
      (status: AppStateStatus) => {
        if (status === 'active') {
          onAppBecomeActive()
        } else if (status === 'background' || status === 'inactive') {
          onAppBecomeInactive()
        }
      }
    )
  }, [])

  const getMapSeenDuration = useCallback(() => {
    const startTime = new Date()
    return () => {
      const endTime = new Date()
      const totalDurationOnPage = (endTime.getTime() - startTime.getTime()) / 1000
      const durationWithoutBackgroundTime = totalDurationOnPage - timeInBackground.current
      if (durationWithoutBackgroundTime <= 0) {
        eventMonitoring.captureException(
          `Error with useTrackDuration hook, duration calculated <= 0`,
          {
            extra: {
              timeInBackground: timeInBackground.current,
              startTimeBackground: startTimeBackground.current,
              totalDurationOnPage,
            },
          }
        )
      }
      callback(Number(durationWithoutBackgroundTime.toFixed(3)))

      // Resetting the refs to initial values
      timeInBackground.current = 0
      startTimeBackground.current = null
      // Remove AppState change subscription
      appStateChangeSubscription.current?.remove()
    }
  }, [callback])

  return getMapSeenDuration
}
