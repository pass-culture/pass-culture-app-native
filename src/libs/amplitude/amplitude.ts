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
    const identifyProperties = new amplitudeRN.Identify()

    Object.keys(properties).forEach((key) => {
      identifyProperties.set(key, properties[key])
    })

    amplitudeRN.identify(identifyProperties)
  },
}
