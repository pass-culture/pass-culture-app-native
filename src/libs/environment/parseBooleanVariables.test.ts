import { parseBooleanVariables } from './parseBooleanVariables'

describe('parseBooleanVariables', () => {
  const mockedConfig = {
    ENV: 'staging',
    API_BASE_URL: 'your-api.com',
    WEBSOCKET_ENDPOINT: 'websocket-endpoint',
    SHOULD_DISPLAY_CHEAT_MENU: 'false',
    FEATURE_FLAG_CODE_PUSH: 'true',
    SENTRY_DSN: 'sentry-dsn',
    URL_PREFIX: 'passculture',
  }
  const convertedConfig = parseBooleanVariables(mockedConfig)

  it('should generate falsy values for feature flags used with false', () => {
    expect(convertedConfig.SHOULD_DISPLAY_CHEAT_MENU).toBeFalsy()
  })
  it('should generate truthy values for feature flags used with true', () => {
    expect(convertedConfig.FEATURE_FLAG_CODE_PUSH).toBeTruthy()
  })
  it('should not touch strings other than "true" and "false"', () => {
    expect(convertedConfig.API_BASE_URL).toEqual('your-api.com')
    expect(convertedConfig.WEBSOCKET_ENDPOINT).toEqual('websocket-endpoint')
    expect(convertedConfig.SENTRY_DSN).toEqual('sentry-dsn')
    expect(convertedConfig.URL_PREFIX).toEqual('passculture')
  })
})
