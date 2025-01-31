import Amplitude from 'amplitude-js'

import { removeGeneratedStorageKey } from 'features/cookies/helpers/removeGeneratedStorageKey'
import { env } from 'libs/environment/env'

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

ampInstance.init(env.AMPLITUDE_API_PUBLIC_KEY, undefined, defaultConfig)

export const amplitude: AmplitudeClient = {
  logEvent: (eventType, eventProperties) => {
    ampInstance.logEvent(eventType, eventProperties)
  },
  enableCollection: () => {
    ampInstance.init(env.AMPLITUDE_API_PUBLIC_KEY, undefined, {
      ...defaultConfig,
      saveEvents: true,
      optOut: false,
      disableCookies: false,
      storage: 'cookies',
    })
  },
  disableCollection: () => {
    ampInstance.init(env.AMPLITUDE_API_PUBLIC_KEY, undefined, defaultConfig)
    removeGeneratedStorageKey('amplitude_unsent')
  },
  setUserProperties: (properties) => {
    ampInstance.setUserProperties(properties)
  },
  setUserId: (id) => {
    ampInstance.setUserId(id)
  },
}
