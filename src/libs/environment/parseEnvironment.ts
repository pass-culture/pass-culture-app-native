import { NativeConfig } from '@bam.tech/react-native-config'
import { ValidationError } from 'yup'

import { Environment, EnvironmentSchema } from 'libs/environment/schema'
import { eventMonitoring } from 'libs/monitoring'

const isValidationError = (error: unknown): error is ValidationError =>
  error instanceof ValidationError

export const parseBooleanVariables = (config: NativeConfig) => {
  const configWithActualBooleans = { ...config } as Record<keyof Environment, string | boolean>

  Object.keys(config).forEach((key) => {
    if (config[key] === 'true') {
      configWithActualBooleans[key as keyof Environment] = true
    } else if (config[key] === 'false') {
      configWithActualBooleans[key as keyof Environment] = false
    }
  })

  return configWithActualBooleans
}

export const parseEnvironment = (config: NativeConfig): Environment => {
  const configWithActualBooleans = parseBooleanVariables(config)

  try {
    EnvironmentSchema.validateSync(configWithActualBooleans, { strict: true, abortEarly: false })
  } catch (error) {
    const errorMessage = isValidationError(error)
      ? `Error parsing .env file: ${error.errors.join(', ')}`
      : `Error parsing .env file: ${error}`
    console.error(errorMessage)
    eventMonitoring.captureException(errorMessage)
  }

  return configWithActualBooleans as Environment
}
