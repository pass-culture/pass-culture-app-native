import * as amplitudeRN from '@amplitude/analytics-react-native'

import { env } from 'libs/environment'

import { AmplitudeClient } from './types'

if (env.AMPLITUDE_API_KEY) {
  amplitudeRN.init(env.AMPLITUDE_API_KEY, undefined, {
    serverZone: amplitudeRN.Types.ServerZone.EU,
    optOut: true,
  })
}

export const amplitude: AmplitudeClient = {
  logEvent: (eventType, eventProperties) => {
    amplitudeRN.track(eventType, eventProperties)
  },
  enableCollection: () => {
    amplitudeRN.setOptOut(false)
  },
  disableCollection: () => {
    amplitudeRN.setOptOut(true)
  },
  setUserProperties: (properties) => {
    // Amplitude only allow us to set properties one after the other
    // https://github.com/amplitude/Amplitude-TypeScript/tree/main/packages/analytics-react-native#user-properties
    const identifyProperties = new amplitudeRN.Identify()

    Object.keys(properties).forEach((key) => {
      const value = properties[key]
      if (value === null) return

      identifyProperties.set(key, value)
    })

    amplitudeRN.identify(identifyProperties)
  },
}
