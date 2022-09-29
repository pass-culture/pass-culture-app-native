import { Amplitude } from '@amplitude/react-native'

import { env } from 'libs/environment'

import { AmplitudeClient } from './types'

const ampInstance = Amplitude.getInstance()

if (env.AMPLITUDE_API_KEY) {
  ampInstance.init(env.AMPLITUDE_API_KEY)
  ampInstance.setServerZone('EU')
  ampInstance.setOptOut(true)
}

export const amplitude: AmplitudeClient = {
  logEvent: (eventType, eventProperties) => {
    ampInstance.logEvent(eventType, eventProperties)
  },
  enableCollection: () => {
    ampInstance.setOptOut(false)
  },
  disableCollection: () => {
    ampInstance.setOptOut(true)
  },
}
