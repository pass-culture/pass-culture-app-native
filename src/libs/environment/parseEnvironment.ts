import { NativeConfig } from 'react-native-config'
import { ValidationError } from 'yup'

import { Environment, EnvironmentSchema } from 'libs/environment/schema'
import { eventMonitoring } from 'libs/monitoring/services'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'

const isValidationError = (error: unknown): error is ValidationError =>
  error instanceof ValidationError

export const parseBooleanVariables = (config: NativeConfig) => {
  const configWithActualBooleans: Record<string, string | boolean> = {}

  Object.keys(config).forEach((key) => {
    const value = config[key]
    if (value === 'true') {
      configWithActualBooleans[key] = true
    } else if (value === 'false') {
      configWithActualBooleans[key] = false
    } else if (value !== undefined) {
      configWithActualBooleans[key] = value
    }
  })

  return configWithActualBooleans
}

export const parseEnvironment = (config: NativeConfig): Environment => {
  const configWithActualBooleans = parseBooleanVariables(config)

  try {
    EnvironmentSchema.validateSync(configWithActualBooleans, { strict: true })
  } catch (error) {
    const errorMessage = getErrorMessage(error)
    const validationErrorMessage = isValidationError(error)
      ? `Error parsing .env file: ${error.errors.join(', ')}`
      : `Error parsing .env file: ${errorMessage}`
    console.error(validationErrorMessage)
    eventMonitoring.captureException(validationErrorMessage, { extra: { error } })
  }

  return configWithActualBooleans as Environment
}
