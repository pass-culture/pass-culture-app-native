// eslint-disable-next-line no-restricted-imports
import { GoogleSignin } from '@react-native-google-signin/google-signin'

import { api } from 'api/api'
import { loginToGoogle } from 'libs/react-native-google-sso/loginToGoogle'

jest.mock('libs/react-native-google-sso/loginToGoogle', () => ({
  loginToGoogle: jest.requireActual('libs/react-native-google-sso/loginToGoogle').loginToGoogle,
}))

jest.mock('api/api')

const mockedGoogleSignin = jest.mocked(GoogleSignin)
const mockedApi = jest.mocked(api)

describe('loginToGoogle', () => {
  const onSuccess = jest.fn()
  const onError = jest.fn()
  const mockServerAuthCode = 'mock-server-auth-code'
  const mockState = 'mock-state'

  beforeEach(() => {
    jest.clearAllMocks()
    mockedApi.getNativeV1OauthState.mockResolvedValue({ oauthStateToken: mockState })
    mockedGoogleSignin.hasPlayServices.mockResolvedValue(true)
    mockedGoogleSignin.signIn.mockResolvedValue({
      serverAuthCode: mockServerAuthCode,
      idToken: null,
      user: {
        id: 'mock-id',
        name: 'Mock User',
        email: 'mock@email.com',
        photo: null,
        familyName: null,
        givenName: null,
      },
    })
  })

  it('should call onSuccess with code and state when sign in is successful', async () => {
    await loginToGoogle({ onSuccess, onError })

    expect(mockedGoogleSignin.hasPlayServices).toHaveBeenCalledWith({
      showPlayServicesUpdateDialog: true,
    })
    expect(mockedGoogleSignin.signIn).toHaveBeenCalledWith()
    expect(mockedApi.getNativeV1OauthState).toHaveBeenCalledWith()
    expect(onSuccess).toHaveBeenCalledWith({ code: mockServerAuthCode, state: mockState })
    expect(onError).not.toHaveBeenCalled()
  })

  it('should call onError when hasPlayServices fails', async () => {
    const error = new Error('Play services error')
    mockedGoogleSignin.hasPlayServices.mockRejectedValueOnce(error)

    await loginToGoogle({ onSuccess, onError })

    expect(onError).toHaveBeenCalledWith(error)
    expect(mockedGoogleSignin.signIn).not.toHaveBeenCalled()
  })

  it('should call onError when signIn fails', async () => {
    const error = new Error('Sign in error')
    mockedGoogleSignin.signIn.mockRejectedValueOnce(error)

    await loginToGoogle({ onSuccess, onError })

    expect(onError).toHaveBeenCalledWith(error)
  })
})
