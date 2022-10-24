import Amplitude from 'amplitude-js'

import { removeGeneratedStorageKey } from 'features/cookies/helpers/removeGeneratedStorageKey'
import { env } from 'libs/environment'

import { AmplitudeClient } from './types'

const ampInstance = Amplitude.getInstance()

const defaultConfig: Amplitude.Config = {
  serverZone: 'EU',
  serverZoneBasedApi: true,
  saveEvents: false,
  optOut: true,
  disableCookies: true,
  storage: 'none',
}

if (env.AMPLITUDE_API_KEY) {
  ampInstance.init(env.AMPLITUDE_API_KEY, undefined, defaultConfig)
}

export const amplitude: AmplitudeClient = {
  logEvent: (eventType, eventProperties) => {
    ampInstance.logEvent(eventType, eventProperties)
  },
  enableCollection: () => {
    if (env.AMPLITUDE_API_KEY) {
      ampInstance.init(env.AMPLITUDE_API_KEY, undefined, {
        ...defaultConfig,
        saveEvents: true,
        optOut: false,
        disableCookies: false,
        storage: 'cookies',
      })
    }
  },
  disableCollection: () => {
    if (env.AMPLITUDE_API_KEY) {
      ampInstance.init(env.AMPLITUDE_API_KEY, undefined, defaultConfig)
    }
    removeGeneratedStorageKey('amplitude_unsent')
  },
}
