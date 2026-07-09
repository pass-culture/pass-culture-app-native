import { NativeConfig } from 'react-native-config'
import { ValidationError } from 'yup'

import { Environment, EnvironmentSchema } from 'libs/environment/schema'
import { eventMonitoring } from 'libs/monitoring/services'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'

const isValidationError = (error: unknown): error is ValidationError =>
  error instanceof ValidationError

export const parseEnvironment = (config: NativeConfig): Environment => {
  const castedConfig = EnvironmentSchema.cast(config, {
    stripUnknown: false,
  })

  try {
    EnvironmentSchema.validateSync(castedConfig, { strict: true })
  } catch (error) {
    const errorMessage = getErrorMessage(error)
    const validationErrorMessage = isValidationError(error)
      ? `Error parsing .env file: ${error.errors.join(', ')}`
      : `Error parsing .env file: ${errorMessage}`
    console.error(validationErrorMessage)
    eventMonitoring.captureException(validationErrorMessage, { extra: { error } })
  }

  return castedConfig as Environment
}
