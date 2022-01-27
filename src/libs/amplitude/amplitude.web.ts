import Amplitude from 'amplitude-js'

import { env } from 'libs/environment'

import { AmplitudeClient } from './types'

export const amplitude = (): AmplitudeClient => {
  const ampInstance = Amplitude.getInstance()
  if (env.AMPLITUDE_API_KEY) {
    ampInstance.init(env.AMPLITUDE_API_KEY, undefined, {
      serverZone: 'EU',
      serverZoneBasedApi: true,
    })
  }
  return {
    logEvent(eventType, eventProperties) {
      return new Promise((resolve) =>
        ampInstance.logEvent(eventType, eventProperties, () => resolve())
      )
    },
  }
}
