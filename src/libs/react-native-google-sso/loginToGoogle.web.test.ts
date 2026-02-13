import { api } from 'api/api'
import { loginToGoogle } from 'libs/react-native-google-sso/loginToGoogle.web'

jest.mock('api/api')
jest.mock('libs/environment/env', () => ({
  env: {
    GOOGLE_CLIENT_ID: 'mock-google-client-id',
  },
}))

const mockedApi = jest.mocked(api)

describe('loginToGoogle', () => {
  const onSuccess = jest.fn()
  const onError = jest.fn()
  const mockState = 'mock-state'
  const requestCodeMock = jest.fn()
  const initCodeClientMock = jest.fn()

  beforeAll(() => {
    Object.assign(global, {
      google: {
        accounts: {
          oauth2: {
            initCodeClient: initCodeClientMock,
          },
        },
      },
    })
  })

  beforeEach(() => {
    jest.clearAllMocks()
    initCodeClientMock.mockReturnValue({ requestCode: requestCodeMock })
    mockedApi.getNativeV1OauthState.mockResolvedValue({ oauthStateToken: mockState })
  })

  it('should initialize code client and request code on success', async () => {
    await loginToGoogle({ onSuccess, onError })

    expect(mockedApi.getNativeV1OauthState).toHaveBeenCalledWith()
    expect(initCodeClientMock).toHaveBeenCalledWith({
      client_id: 'mock-google-client-id',
      scope: 'openid profile email',
      callback: onSuccess,
      error_callback: onError,
      state: mockState,
    })
    expect(requestCodeMock).toHaveBeenCalledWith()
  })

  it('should call onError if getNativeV1OauthState fails', async () => {
    const error = new Error('API Error')
    mockedApi.getNativeV1OauthState.mockRejectedValueOnce(error)

    await loginToGoogle({ onSuccess, onError })

    expect(onError).toHaveBeenCalledWith(error)
  })
})
