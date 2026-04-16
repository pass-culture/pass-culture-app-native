import { api } from 'api/api'
import { env } from 'libs/environment/env'
import * as appleSSOContextModule from 'libs/react-native-apple-sso/appleSSOContext'
import { loginToApple } from 'libs/react-native-apple-sso/loginToApple'

jest.mock('api/api')
jest.mock('libs/react-native-apple-sso/appleSSOContext', () => ({
  loadAppleSSOContext: jest.fn(),
  saveAppleSSOContext: jest.fn(),
}))

const mockedApi = jest.mocked(api)
const mockLoadAppleSSOContext = jest.mocked(appleSSOContextModule.loadAppleSSOContext)
const mockSaveAppleSSOContext = jest.mocked(appleSSOContextModule.saveAppleSSOContext)
const mockState = 'mock-oauth-state'

describe('loginToApple (web)', () => {
  const onSuccess = jest.fn()
  const onError = jest.fn()
  const originalLocation = window.location

  beforeEach(() => {
    jest.clearAllMocks()
    mockedApi.getNativeV1OauthState.mockResolvedValue({ oauthStateToken: mockState })
    mockLoadAppleSSOContext.mockReturnValue({ type: 'login', oauthStateToken: '' })
    Object.defineProperty(env, 'APPLE_SERVICE_ID', { value: 'test.service.id', writable: true })
    delete (window as Partial<Window>).location
    window.location = { ...originalLocation, origin: 'https://example.com', href: '' }
  })

  afterEach(() => {
    window.location = originalLocation
  })

  it('should redirect to Apple auth URL with correct params', async () => {
    await loginToApple({ onSuccess, onError })

    const url = new URL(window.location.href)

    expect(url.origin).toBe('https://appleid.apple.com')
    expect(url.pathname).toBe('/auth/authorize')
    expect(url.searchParams.get('client_id')).toBe('test.service.id')
    expect(url.searchParams.get('response_mode')).toBe('query')
    expect(url.searchParams.get('response_type')).toBe('code')
    expect(url.searchParams.get('state')).toBe(mockState)
    expect(url.searchParams.get('redirect_uri')).toBe('https://example.com/oauth/apple/callback')
  })

  it('should save the oauthStateToken in the SSO context before redirecting', async () => {
    mockLoadAppleSSOContext.mockReturnValueOnce({ type: 'signup', oauthStateToken: '' })

    await loginToApple({ onSuccess, onError })

    expect(mockSaveAppleSSOContext).toHaveBeenCalledWith({
      type: 'signup',
      oauthStateToken: mockState,
    })
  })

  it('should call onError when APPLE_SERVICE_ID is not configured', async () => {
    Object.defineProperty(env, 'APPLE_SERVICE_ID', { value: '', writable: true })

    await loginToApple({ onSuccess, onError })

    expect(onError).toHaveBeenCalledWith(new Error('apple_service_id_not_configured'))
  })

  it('should call onError when getNativeV1OauthState fails', async () => {
    const error = new Error('Network error')
    mockedApi.getNativeV1OauthState.mockRejectedValueOnce(error)

    await loginToApple({ onSuccess, onError })

    expect(onError).toHaveBeenCalledWith(error)
  })
})
