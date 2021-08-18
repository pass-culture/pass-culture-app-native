import { NativeConfig } from '@bam.tech/react-native-config'

import { Environment } from './types'

export const parseBooleanVariables = (config: NativeConfig): Environment => {
  const configWithActualBooleans = { ...config } as unknown as Environment

  Object.keys(config).map((key) => {
    if (config[key] === 'true') {
      // @ts-expect-error Some values are boolean
      configWithActualBooleans[key] = true
    } else if (config[key] === 'false') {
      // @ts-expect-error Some values are boolean
      configWithActualBooleans[key] = false
    }
  })

  return configWithActualBooleans
}
