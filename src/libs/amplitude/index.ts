import { AmplitudeClient } from 'libs/amplitude/types'

// AMPLITUDE IS DISABLED UNTIL WE HAVE A BETTER SOLUTION
export const amplitude: AmplitudeClient = {
  logEvent: () => {
    // No-op, Amplitude is disabled
  },
  enableCollection: () => {
    // No-op, Amplitude is disabled
  },
  disableCollection: () => {
    // No-op, Amplitude is disabled
  },
  setUserProperties: () => {
    // No-op, Amplitude is disabled
  },
  setUserId: () => {
    // No-op, Amplitude is disabled
  },
}
