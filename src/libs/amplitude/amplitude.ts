import { Amplitude } from '@amplitude/react-native'

import { env } from 'libs/environment'

import { AmplitudeClient } from './types'

export const amplitude = (): AmplitudeClient => {
  const ampInstance = Amplitude.getInstance()
  if (env.AMPLITUDE_API_KEY) {
    ampInstance.init(env.AMPLITUDE_API_KEY)
    ampInstance.setServerZone('EU')
  }
  return {
    logEvent(eventType, eventProperties) {
      return ampInstance.logEvent(eventType, eventProperties).then(() => undefined)
    },
  }
}
