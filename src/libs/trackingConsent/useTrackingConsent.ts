import { useEffect, useState } from 'react'
import {
  TrackingStatus,
  getTrackingStatus,
  requestTrackingPermission,
} from 'react-native-tracking-transparency'

import { eventMonitoring } from 'libs/monitoring'

export const useTrackingConsent = () => {
  const [trackingStatus, setTrackingStatus] = useState<TrackingStatus>('not-determined')

  useEffect(() => {
    // Using a setTimeout may fix the ATT popup not showing :
    // https://github.com/mrousavy/react-native-tracking-transparency/issues/15#issuecomment-925021181
    setTimeout(async () => {
      try {
        const status = await getTrackingStatus()
        // android and iOS < 14
        if (status === 'unavailable') {
          setTrackingStatus(status)
          return
        }
        // iOS >= 14
        if (status === 'not-determined') {
          const newStatus = await requestTrackingPermission()
          setTrackingStatus(newStatus)
        }
      } catch (error) {
        eventMonitoring.captureException(error)
      }
    }, 1000)
  }, [])

  return {
    consentTracking: trackingStatus === 'unavailable' || trackingStatus === 'authorized',
    consentAsked: trackingStatus !== 'not-determined',
  }
}
