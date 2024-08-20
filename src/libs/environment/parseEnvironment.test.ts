import { ValidationError } from 'yup'

import { eventMonitoring } from 'libs/monitoring'

import { parseBooleanVariables, parseEnvironment } from './parseEnvironment'

jest.mock('libs/monitoring')
const mockCaptureException = eventMonitoring.captureException as jest.Mock

const mockedConfig = {
  ENV: 'staging',
  API_BASE_URL: 'your-api.com',
  FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING: 'false',
  SENTRY_DSN: 'sentry-dsn',
  URL_PREFIX: 'passculture',
}

describe('parseBooleanVariables', () => {
  const convertedConfig = parseBooleanVariables(mockedConfig)

  it('should generate falsy values for feature flags used with false', () => {
    expect(convertedConfig.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING).toBeFalsy()
  })

  it('should generate truthy values for feature flags used with true', () => {
    const convertedConfig = parseBooleanVariables({
      ...mockedConfig,
      FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING: 'true',
    })

    expect(convertedConfig.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING).toBeTruthy()
  })

  it('should not touch strings other than "true" and "false"', () => {
    expect(convertedConfig.API_BASE_URL).toEqual('your-api.com')
    expect(convertedConfig.SENTRY_DSN).toEqual('sentry-dsn')
    expect(convertedConfig.URL_PREFIX).toEqual('passculture')
  })
})

describe('parseEnvironment', () => {
  it('should log error when having a validation error', () => {
    const mockConsoleError = jest.fn()
    jest.spyOn(global.console, 'error').mockImplementationOnce(mockConsoleError)

    parseEnvironment(mockedConfig)

    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error parsing .env file: WEBAPP_V2_DOMAIN is a required field'
    )
  })

  it('should log to Sentry when having a validation error', () => {
    jest.spyOn(global.console, 'error').mockImplementationOnce(() => null)

    parseEnvironment(mockedConfig)

    expect(mockCaptureException).toHaveBeenCalledWith(
      'Error parsing .env file: WEBAPP_V2_DOMAIN is a required field',
      { extra: { error: new ValidationError('WEBAPP_V2_DOMAIN is a required field') } }
    )
  })
})
