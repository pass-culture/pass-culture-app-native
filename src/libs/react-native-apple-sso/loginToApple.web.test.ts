import { api } from 'api/api'
import { env } from 'libs/environment/env'
import { loginToApple } from 'libs/react-native-apple-sso/loginToApple'

jest.mock('api/api')

const mockedApi = jest.mocked(api)
const mockState = 'mock-oauth-state'

describe('loginToApple (web)', () => {
  const onSuccess = jest.fn()
  const onError = jest.fn()
  let mockPopup: { closed: boolean; close: jest.Mock }

  beforeEach(() => {
    jest.clearAllMocks()
    mockedApi.getNativeV1OauthState.mockResolvedValue({ oauthStateToken: mockState })
    mockPopup = { closed: false, close: jest.fn() }
    ;(window.open as jest.Mock).mockReturnValue(mockPopup)
    Object.defineProperty(env, 'APPLE_SERVICE_ID', { value: 'test.service.id', writable: true })
  })

  it('should open a popup with the correct Apple auth URL', async () => {
    const loginPromise = loginToApple({ onSuccess, onError })

    // Wait for the async getNativeV1OauthState to resolve
    await Promise.resolve()
    await Promise.resolve()

    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('https://appleid.apple.com/auth/authorize'),
      'apple-sso',
      'width=500,height=600,left=200,top=100'
    )

    const openCall = (window.open as jest.Mock).mock.calls[0]?.[0] as string
    const url = new URL(openCall)

    expect(url.searchParams.get('client_id')).toBe('test.service.id')
    expect(url.searchParams.get('response_mode')).toBe('query')
    expect(url.searchParams.get('response_type')).toBe('code')
    expect(url.searchParams.get('state')).toBe(mockState)
    expect(url.searchParams.get('redirect_uri')).toContain('/oauth/apple/callback')

    // Simulate popup closing to resolve the promise
    mockPopup.closed = true
    // Use real interval tick
    await waitForIntervalTick()
    await loginPromise
  })

  it('should call onError when APPLE_SERVICE_ID is not configured', async () => {
    Object.defineProperty(env, 'APPLE_SERVICE_ID', { value: '', writable: true })

    await loginToApple({ onSuccess, onError })

    expect(onError).toHaveBeenCalledWith(new Error('APPLE_SERVICE_ID is not configured'))
    expect(window.open).not.toHaveBeenCalled()
  })

  it('should call onError when popup is blocked', async () => {
    ;(window.open as jest.Mock).mockReturnValueOnce(null)

    await loginToApple({ onSuccess, onError })

    expect(onError).toHaveBeenCalledWith(new Error('popup_blocked'))
  })

  it('should call onError when getNativeV1OauthState fails', async () => {
    const error = new Error('Network error')
    mockedApi.getNativeV1OauthState.mockRejectedValueOnce(error)

    await loginToApple({ onSuccess, onError })

    expect(onError).toHaveBeenCalledWith(error)
    expect(window.open).not.toHaveBeenCalled()
  })

  it('should call onSuccess when receiving a valid postMessage callback', async () => {
    const loginPromise = loginToApple({ onSuccess, onError })

    // Wait for the async setup to complete
    await Promise.resolve()
    await Promise.resolve()

    window.dispatchEvent(
      new MessageEvent('message', {
        origin: window.location.origin,
        data: { type: 'apple-sso-callback', code: 'apple-auth-code', state: mockState },
      })
    )

    await loginPromise

    expect(onSuccess).toHaveBeenCalledWith({ code: 'apple-auth-code', state: mockState })
    expect(onError).not.toHaveBeenCalled()
  })

  it('should call onError when receiving a postMessage with error', async () => {
    const loginPromise = loginToApple({ onSuccess, onError })

    await Promise.resolve()
    await Promise.resolve()

    window.dispatchEvent(
      new MessageEvent('message', {
        origin: window.location.origin,
        data: { type: 'apple-sso-callback', code: '', state: '', error: 'access_denied' },
      })
    )

    await loginPromise

    expect(onError).toHaveBeenCalledWith(new Error('apple_auth_error: access_denied'))
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('should call onError when receiving a postMessage with no code', async () => {
    const loginPromise = loginToApple({ onSuccess, onError })

    await Promise.resolve()
    await Promise.resolve()

    window.dispatchEvent(
      new MessageEvent('message', {
        origin: window.location.origin,
        data: { type: 'apple-sso-callback', code: '', state: '' },
      })
    )

    await loginPromise

    expect(onError).toHaveBeenCalledWith(new Error('no_code_in_callback'))
  })

  it('should ignore messages from different origins', async () => {
    const loginPromise = loginToApple({ onSuccess, onError })

    await Promise.resolve()
    await Promise.resolve()

    window.dispatchEvent(
      new MessageEvent('message', {
        origin: 'https://malicious-site.com',
        data: { type: 'apple-sso-callback', code: 'stolen-code', state: 'stolen-state' },
      })
    )

    // Should not have called success or error
    expect(onSuccess).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()

    // Close popup to resolve
    mockPopup.closed = true
    await waitForIntervalTick()
    await loginPromise
  })

  it('should resolve silently when popup is closed by user', async () => {
    const loginPromise = loginToApple({ onSuccess, onError })

    await Promise.resolve()
    await Promise.resolve()

    mockPopup.closed = true
    await waitForIntervalTick()

    await loginPromise

    expect(onSuccess).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  })
})

function waitForIntervalTick(): Promise<void> {
  // Wait long enough for setInterval(500ms) to fire
  return new Promise((resolve) => setTimeout(resolve, 600))
}
