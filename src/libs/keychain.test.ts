import * as Keychain from 'react-native-keychain'

import { env } from 'libs/environment'
import { getRefreshToken, storeRefreshToken } from 'libs/keychain'

enum mockAccessible {
  WHEN_UNLOCKED = 'AccessibleWhenUnlocked',
}

jest.mock('react-native-keychain', () => {
  return {
    setInternetCredentials: jest.fn(),
    getInternetCredentials: jest.fn((apiUrl) => {
      return {
        username: 'user@example.com',
        password: 'userToken',
        server: apiUrl,
      }
    }),
    ACCESSIBLE: mockAccessible,
  }
})

describe('Keychain', () => {
  describe('storeRefreshToken', () => {
    it('should call setInternetCredentials from Keychain', async () => {
      await storeRefreshToken('user@example.com', 'fake_access_token')

      expect(Keychain.setInternetCredentials).toHaveBeenCalled()
    })
  })

  describe('getRefreshToken', () => {
    it('should call getInternetCredentials from Keychain', async () => {
      const retreivedToken = await getRefreshToken()

      expect(Keychain.getInternetCredentials).toHaveBeenCalledWith(env.API_BASE_URL)
      expect(retreivedToken).toEqual('userToken')
    })
    it('should return false when no credentials are found', async () => {
      Keychain.getInternetCredentials.mockImplementation(() => {})

      const retreivedToken = await getRefreshToken()

      expect(Keychain.getInternetCredentials).toHaveBeenCalledWith(env.API_BASE_URL)
      expect(retreivedToken).toBeFalsy()
    })
  })
})
