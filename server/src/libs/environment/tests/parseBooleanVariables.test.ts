import { parseBooleanVariables } from '../parseBooleanVariables'

describe('parseBooleanVariables', () => {
  const mockedConfig = {
    __DEV__: 'true',
    ENV: 'test',
    APP_PUBLIC_URL: 'http://localhost:8080',
    APP_PROXY_URL: 'https://app-proxy.testing.passculture.team',
    API_BASE_URL: 'https://api.testing.passculture.team',
    API_BASE_PATH_NATIVE_V1: 'native/v1',
    DEEPLINK_PROTOCOL: 'passculture://',
    PROXY_CACHE_CONTROL: 'public,max-age=3600',
    REGION: 'europe-west1',
  }
  const convertedConfig = parseBooleanVariables(mockedConfig)

  it('should have __DEV__ boolean type and true', () => {
    expect(convertedConfig.__DEV__).toBe(true)
  })

  it('should have __DEV__ boolean type and false', () => {
    const { __DEV__ } = parseBooleanVariables({
      ...mockedConfig,
      __DEV__: 'false',
    })
    expect(__DEV__).toBe(false)
  })

  it('should have APP_PUBLIC_URL defined', () => {
    expect(convertedConfig.APP_PUBLIC_URL).toBeDefined()
  })
})
