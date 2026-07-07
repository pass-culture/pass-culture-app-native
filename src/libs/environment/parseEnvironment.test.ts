import { ValidationError } from 'yup'

import { eventMonitoring } from 'libs/monitoring/services'

import { parseEnvironment } from './parseEnvironment'

jest.mock('libs/monitoring/services')
const mockCaptureException = eventMonitoring.captureException as jest.Mock

const mockedConfig = {
  ENV: 'staging',
  API_BASE_URL: 'your-api.com',
  FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING: 'false',
  SENTRY_DSN: 'sentry-dsn',
  URL_PREFIX: 'passculture',
}

describe('parseEnvironment', () => {
  it('should coerce boolean env vars from strings', () => {
    const env = parseEnvironment(mockedConfig)

    expect(env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING).toBe(false)
  })

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
