import { config } from 'dotenv'

import {
  ENV_OVERRIDE_CONFIG,
  ENV_OVERRIDE_FIREBASE_CONFIG,
} from 'libs/environment/envOverride/envOverrideConfig'
import {
  ENV_OVERRIDE_FIREBASE_CONFIG_KEYS,
  ENV_SWITCHABLE_CONFIG_KEYS,
  SWITCHABLE_ENVIRONMENTS,
} from 'libs/environment/envOverride/types'

const loadEnvFile = (environment: string) => {
  const { parsed, error } = config({ path: `.env.${environment}`, processEnv: {} })
  if (error) throw error
  if (!parsed) throw new Error(`No variables found in .env.${environment}`)
  return parsed
}

describe('envOverrideConfig', () => {
  // If these tests fail, run: yarn generate:envOverrideConfig
  it.each(SWITCHABLE_ENVIRONMENTS)('generated config should match .env.%s', (environment) => {
    const parsed = loadEnvFile(environment)

    const expectedConfig = Object.fromEntries(
      ENV_SWITCHABLE_CONFIG_KEYS.map((key) => [key, parsed[key]])
    )

    expect(ENV_OVERRIDE_CONFIG[environment]).toEqual(expectedConfig)
  })

  it.each(SWITCHABLE_ENVIRONMENTS)(
    'generated firebase config should match .env.%s',
    (environment) => {
      const parsed = loadEnvFile(environment)

      const expectedConfig = Object.fromEntries(
        ENV_OVERRIDE_FIREBASE_CONFIG_KEYS.map((key) => [key, parsed[key]])
      )

      expect(ENV_OVERRIDE_FIREBASE_CONFIG[environment]).toEqual(expectedConfig)
    }
  )
})
