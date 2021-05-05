import { useEffect, useState } from 'react'
import {
  TrackingStatus,
  getTrackingStatus,
  requestTrackingPermission,
} from 'react-native-tracking-transparency'

export const useTrackingConsent = () => {
  const [trackingStatus, setTrackingStatus] = useState<TrackingStatus>('not-determined')

  useEffect(() => {
    getTrackingStatus().then((status) => {
      // android and iOS < 14
      if (status === 'unavailable') {
        setTrackingStatus(status)
      }

      // iOS >= 14
      if (status === 'not-determined') {
        requestTrackingPermission().then(setTrackingStatus)
      }
    })
  }, [])

  return trackingStatus === 'unavailable' || trackingStatus === 'authorized'
}
