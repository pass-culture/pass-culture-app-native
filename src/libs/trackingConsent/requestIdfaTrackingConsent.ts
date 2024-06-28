import {
  TrackingStatus,
  getTrackingStatus,
  requestTrackingPermission,
} from 'react-native-tracking-transparency'

import { logOpenApp } from 'libs/campaign/logOpenApp'

export const requestIDFATrackingConsent = async (callback?: (status: TrackingStatus) => void) =>
  getTrackingStatus().then((status) => {
    if (status === 'not-determined') {
      // iOS >= 14
      requestTrackingPermission().then(async (status) => {
        callback?.(status)
        logOpenApp(status)
      })
    } else {
      callback?.(status)
    }
  })
