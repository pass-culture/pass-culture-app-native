import { parseBooleanVariables } from '../parseBooleanVariables'

describe('parseBooleanVariables', () => {
  const mockedConfig = {
    ENV: 'test',
    APP_PUBLIC_URL: 'http://localhost:8080',
    APP_PROXY_URL: 'https://app-proxy.testing.passculture.team',
    API_BASE_URL: 'https://api.testing.passculture.team',
    API_BASE_PATH_NATIVE_V1: 'native/v1',
    DEEPLINK_PROTOCOL: 'passculture://',
    TEST_TRUE: 'true',
    TEST_FALSE: 'false',
  }
  const convertedConfig = parseBooleanVariables(mockedConfig)

  it('should be test ENV', () => {
    expect(convertedConfig.ENV).toBe('test')
  })

  it('should have APP_PUBLIC_URL defined', () => {
    expect(convertedConfig.APP_PUBLIC_URL).toBeTruthy()
  })

  it('should have APP_PROXY_URL defined', () => {
    expect(convertedConfig.APP_PROXY_URL).toBeTruthy()
  })

  it('should have API_BASE_URL defined', () => {
    expect(convertedConfig.API_BASE_URL).toBeTruthy()
  })

  it('should have API_BASE_PATH_NATIVE_V1 defined', () => {
    expect(convertedConfig.API_BASE_PATH_NATIVE_V1).toEqual('native/v1')
  })

  it('should have DEEPLINK_PROTOCOL defined', () => {
    expect(convertedConfig.DEEPLINK_PROTOCOL).toEqual('passculture://')
  })

  it('should parse booleans', () => {
    // @ts-ignore: FIXME: use real boolean when we will have some in the Environment configuration
    const { TEST_TRUE, TEST_FALSE } = convertedConfig
    expect(TEST_TRUE).toEqual(true)
    expect(TEST_FALSE).toEqual(false)
  })
})
