// eslint-disable-next-line no-restricted-imports
import appleAuth, {
  AppleRequestResponseFullName,
} from '@invertase/react-native-apple-authentication'

import { api } from 'api/api'
import { loginToApple } from 'libs/react-native-apple-sso/loginToApple'

jest.mock('libs/react-native-apple-sso/loginToApple', () => ({
  loginToApple: jest.requireActual('libs/react-native-apple-sso/loginToApple').loginToApple,
}))

jest.mock('api/api')

const mockedAppleAuth = jest.mocked(appleAuth)
const mockedApi = jest.mocked(api)

describe('loginToApple', () => {
  const onSuccess = jest.fn()
  const onError = jest.fn()
  const mockAuthCode = 'mock-apple-auth-code'
  const mockState = 'mock-state'

  beforeEach(() => {
    jest.clearAllMocks()
    mockedApi.getNativeV1OauthState.mockResolvedValue({ oauthStateToken: mockState })
    mockedAppleAuth.performRequest.mockResolvedValue({
      authorizationCode: mockAuthCode,
      identityToken: 'mockIdentityToken',
      email: 'mock@email.com',
      fullName: { givenName: 'Mock', familyName: 'User' } as AppleRequestResponseFullName,
      user: 'mockUserId',
      nonce: 'mockNonce',
      state: null,
      realUserStatus: 1,
      authorizedScopes: [],
    })
  })

  it('should call onSuccess with code and state when sign in is successful', async () => {
    await loginToApple({ onSuccess, onError })

    expect(mockedApi.getNativeV1OauthState).toHaveBeenCalledWith()
    expect(mockedAppleAuth.performRequest).toHaveBeenCalledWith({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    })
    expect(onSuccess).toHaveBeenCalledWith({ code: mockAuthCode, state: mockState })
    expect(onError).not.toHaveBeenCalled()
  })

  it('should call onError when performRequest returns no authorization code', async () => {
    mockedAppleAuth.performRequest.mockResolvedValueOnce({
      authorizationCode: null as unknown as string,
      identityToken: 'mockIdentityToken',
      email: null,
      fullName: null,
      user: 'mockUserId',
      nonce: 'mockNonce',
      state: null,
      realUserStatus: 1,
      authorizedScopes: [],
    })

    await loginToApple({ onSuccess, onError })

    expect(onError).toHaveBeenCalledWith(new Error('Apple Sign-In returned no authorization code'))
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('should call onError when getNativeV1OauthState fails', async () => {
    const error = new Error('OAuth state error')
    mockedApi.getNativeV1OauthState.mockRejectedValueOnce(error)

    await loginToApple({ onSuccess, onError })

    expect(onError).toHaveBeenCalledWith(error)
    expect(mockedAppleAuth.performRequest).not.toHaveBeenCalled()
  })

  it('should call onError when performRequest fails', async () => {
    const error = new Error('Apple auth error')
    mockedAppleAuth.performRequest.mockRejectedValueOnce(error)

    await loginToApple({ onSuccess, onError })

    expect(onError).toHaveBeenCalledWith(error)
  })

  it('should not call onError when sign in is cancelled by the user', async () => {
    mockedAppleAuth.performRequest.mockRejectedValueOnce({
      code: appleAuth.Error.CANCELED,
      message: 'Sign in cancelled',
    })

    await loginToApple({ onSuccess, onError })

    expect(onError).not.toHaveBeenCalled()
    expect(onSuccess).not.toHaveBeenCalled()
  })
})
