import AsyncStorage from '@react-native-async-storage/async-storage'
import { useQueryClient } from 'react-query'

import { BatchUser } from '__mocks__/libs/react-native-batch'
import { LoggedInQueryKeys, useLogoutRoutine } from 'features/auth/AuthContext'
import { COOKIES_BY_CATEGORY, ALL_OPTIONAL_COOKIES } from 'features/cookies/CookiesPolicy'
import { CookiesConsent } from 'features/cookies/types'
import { analytics } from 'libs/firebase/analytics'
import * as Keychain from 'libs/keychain'
import { storage } from 'libs/storage'
import { renderHook } from 'tests/utils'

jest.mock('features/profile/api')

const mockSearchDispatch = jest.fn()
const mockIdentityCheckDispatch = jest.fn()

jest.mock('api/api')
jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQueryClient: jest.fn().mockReturnValue({ removeQueries: jest.fn() }),
  useQuery: jest.fn(),
}))
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({ dispatch: mockIdentityCheckDispatch })),
}))
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: jest.fn(() => ({ dispatch: mockSearchDispatch })),
}))

const COOKIES_CONSENT_KEY = 'cookies'
const cookiesChoice: CookiesConsent = {
  buildVersion: 1001005,
  deviceId: 'uuid',
  choiceDatetime: new Date(2022, 9, 29).toISOString(),
  consent: {
    mandatory: COOKIES_BY_CATEGORY.essential,
    accepted: ALL_OPTIONAL_COOKIES,
    refused: [],
  },
}

describe('AuthContext', () => {
  beforeEach(async () => {
    await storage.saveObject(COOKIES_CONSENT_KEY, cookiesChoice)
  })

  describe('useLogoutRoutine', () => {
    it('should remove batch identifier', async () => {
      await renderUseLogoutRoutine()

      expect(BatchUser.editor().setIdentifier).toHaveBeenNthCalledWith(1, null)
    })

    it('should log analytics', async () => {
      await renderUseLogoutRoutine()

      expect(analytics.logLogout).toBeCalledTimes(1)
    })

    it('should remove access token from async storage', async () => {
      await renderUseLogoutRoutine()

      expect(AsyncStorage.removeItem).toHaveBeenNthCalledWith(1, 'access_token')
    })

    it('should clear refresh token', async () => {
      const mockClearRefreshToken = jest.spyOn(Keychain, 'clearRefreshToken')
      await renderUseLogoutRoutine()

      expect(mockClearRefreshToken).toBeCalledTimes(1)
    })

    it.each(LoggedInQueryKeys)('should remove query: "%s"', async (query) => {
      const queryClient = useQueryClient()
      await renderUseLogoutRoutine()

      expect(queryClient.removeQueries).toHaveBeenCalledWith(query)
    })
  })
})

const renderUseLogoutRoutine = async () => {
  const { result } = renderHook(useLogoutRoutine)
  const logout = result.current
  await logout()
}
