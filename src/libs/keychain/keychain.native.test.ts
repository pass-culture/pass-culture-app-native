import * as Keychain from '__mocks__/react-native-keychain'
import { env } from 'libs/environment/fixtures'

import { getRefreshToken, saveRefreshToken } from './keychain'

describe('keychain', () => {
  describe('saveRefreshToken()', () => {
    it('should call setGenericPassword from Keychain', async () => {
      expect.assertions(2)

      await saveRefreshToken('fake_access_token')

      expect(Keychain.setGenericPassword).toHaveBeenCalledTimes(1)
      expect(Keychain.setGenericPassword).toHaveBeenCalledWith(
        'PASSCULTURE_REFRESH_TOKEN',
        'fake_access_token',
        { service: env.IOS_APP_ID }
      )
    })

    it('should throws if access token is undefined', async () => {
      expect.assertions(2)

      await expect(saveRefreshToken(undefined)).rejects.toEqual(
        Error('[Keychain]: No refresh token to save')
      )
      expect(Keychain.setGenericPassword).not.toHaveBeenCalled()
    })

    it('should throw when setGenericPassword throws', async () => {
      expect.assertions(1)

      Keychain.setGenericPassword.mockImplementationOnce(async () => {
        throw Error()
      })

      await expect(saveRefreshToken('fake_access_token')).rejects.toEqual(
        Error('[Keychain]: saving error: ')
      )
    })
  })

  describe('getRefreshToken()', () => {
    it('should call getGenericPassword from Keychain', async () => {
      expect.assertions(2)

      await saveRefreshToken('fake_access_token')
      const refreshToken = await getRefreshToken()

      expect(Keychain.getGenericPassword).toHaveBeenCalledTimes(1)
      expect(refreshToken).toEqual('fake_access_token')
    })

    it('should return false when no credentials are found', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Keychain.getGenericPassword.mockImplementationOnce(async () => false as any)

      const refreshToken = await getRefreshToken()

      expect(Keychain.getGenericPassword).toHaveBeenCalledTimes(1)
      expect(refreshToken).toBeNull()
    })

    it('should throw when getGenericPassword throws', async () => {
      expect.assertions(1)

      Keychain.getGenericPassword.mockImplementationOnce(async () => {
        throw Error()
      })

      await expect(getRefreshToken()).rejects.toEqual(Error('[Keychain]: access error: '))
    })
  })
})
