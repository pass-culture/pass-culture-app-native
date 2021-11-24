import { NativeConfig } from '@bam.tech/react-native-config'

import { Environment } from './types'

export const parseBooleanVariables = (config: NativeConfig): Environment => {
  const configWithActualBooleans = { ...config } as Record<keyof Environment, string | boolean>

  Object.keys(config).forEach((key) => {
    if (config[key] === 'true') {
      configWithActualBooleans[key as keyof Environment] = true
    } else if (config[key] === 'false') {
      configWithActualBooleans[key as keyof Environment] = false
    }
  })

  return configWithActualBooleans as Environment
}
