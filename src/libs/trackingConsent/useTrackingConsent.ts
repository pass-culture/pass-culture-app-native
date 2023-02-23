import { useEffect, useState } from 'react'
import {
  TrackingStatus,
  getTrackingStatus,
  requestTrackingPermission,
} from 'react-native-tracking-transparency'

import { logOpenApp } from 'libs/campaign/logOpenApp'

export const requestIDFATrackingConsent = async (callback?: (status: TrackingStatus) => void) =>
  getTrackingStatus().then((status) => {
    if (status === 'unavailable') {
      // android and iOS < 14
      callback && callback(status)
    } else if (status === 'not-determined') {
      // iOS >= 14
      requestTrackingPermission().then(async (status) => {
        callback && callback(status)
        logOpenApp(status)
      })
    }
  })

export const useTrackingConsent = () => {
  const [trackingStatus, setTrackingStatus] = useState<TrackingStatus>('not-determined')

  useEffect(() => {
    requestIDFATrackingConsent(setTrackingStatus)
  }, [])

  return {
    consentTracking: trackingStatus === 'unavailable' || trackingStatus === 'authorized',
    consentAsked: trackingStatus !== 'not-determined',
  }
}
