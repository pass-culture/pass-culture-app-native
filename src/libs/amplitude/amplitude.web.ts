import Amplitude from 'amplitude-js'

import { env } from 'libs/environment'
import { storage } from 'libs/storage'

import { AmplitudeClient } from './types'

export const amplitude = (): AmplitudeClient => {
  const ampInstance = Amplitude.getInstance()
  if (env.AMPLITUDE_API_KEY) {
    ampInstance.init(env.AMPLITUDE_API_KEY, undefined, {
      serverZone: 'EU',
      serverZoneBasedApi: true,
      saveEvents: !ampInstance.options.optOut,
    })
  }
  return {
    logEvent(eventType, eventProperties) {
      ampInstance.logEvent(eventType, eventProperties)
    },
    enableCollection() {
      ampInstance.setOptOut(false)
    },
    disableCollection() {
      ampInstance.setOptOut(true)
      storage.getAllKeys().then((keys) => {
        keys?.forEach((key) => key.startsWith('amplitude_unsent') && storage.clear(key))
      })
    },
  }
}
