import * as Keychain from '__mocks__/react-native-keychain'
import { getRefreshToken, saveRefreshToken } from 'libs/keychain'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('saveRefreshToken()', () => {
  it('should call setGenericPassword from Keychain', async () => {
    expect.assertions(2)

    await saveRefreshToken('user@example.com', 'fake_access_token')

    expect(Keychain.setGenericPassword).toHaveBeenCalledTimes(1)
    expect(Keychain.setGenericPassword).toHaveBeenCalledWith(
      'user@example.com',
      'fake_access_token'
    )
  })

  it('should throws if access token is undefined', async () => {
    expect.assertions(2)

    await expect(saveRefreshToken('user@example.com', undefined)).rejects.toEqual(
      Error('Aucun refresh token à sauvegarder')
    )
    expect(Keychain.setGenericPassword).not.toHaveBeenCalled()
  })

  it('should throw when setGenericPassword throws', async () => {
    expect.assertions(1)
    Keychain.setGenericPassword.mockImplementationOnce(async () => {
      throw Error()
    })

    await expect(saveRefreshToken('user@example.com', 'fake_access_token')).rejects.toEqual(
      Error('Keychain non accessible')
    )
  })
})

describe('getRefreshToken()', () => {
  it('should call getGenericPassword from Keychain', async () => {
    expect.assertions(2)

    const refreshToken = await getRefreshToken()

    expect(Keychain.getGenericPassword).toHaveBeenCalledTimes(1)
    expect(refreshToken).toEqual('password')
  })

  it('should return false when no credentials are found', async () => {
    Keychain.getGenericPassword.mockImplementationOnce(async () => false)

    const refreshToken = await getRefreshToken()

    expect(Keychain.getGenericPassword).toHaveBeenCalledTimes(1)
    expect(refreshToken).toBeNull()
  })

  it('should throw when getGenericPassword throws', async () => {
    expect.assertions(1)
    Keychain.getGenericPassword.mockImplementationOnce(async () => {
      throw Error()
    })

    await expect(getRefreshToken()).rejects.toEqual(Error('Keychain non accessible'))
  })
})
