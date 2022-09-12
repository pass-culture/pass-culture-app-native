import AsyncStorage from '@react-native-async-storage/async-storage'
import { useQueryClient } from 'react-query'

import { FAKE_USER_ID } from '__mocks__/jwt-decode'
import { BatchUser } from '__mocks__/libs/react-native-batch'
import { api } from 'api/api'
import { AccountState } from 'api/gen'
import { LoggedInQueryKeys, useLoginRoutine, useLogoutRoutine } from 'features/auth/AuthContext'
import { analytics } from 'libs/firebase/analytics'
import * as Keychain from 'libs/keychain'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, superFlushWithAct } from 'tests/utils'

const mockSearchDispatch = jest.fn()
const mockStagedSearchDispatch = jest.fn()
const mockIdentityCheckDispatch = jest.fn()

jest.mock('api/api')
jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQueryClient: jest.fn().mockReturnValue({ removeQueries: jest.fn() }),
  useQuery: jest.fn(),
}))
jest.mock('features/identityCheck/context/IdentityCheckContextProvider', () => ({
  useIdentityCheckContext: jest.fn(() => ({ dispatch: mockIdentityCheckDispatch })),
}))
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: jest.fn(() => ({ dispatch: mockSearchDispatch })),
  useStagedSearch: jest.fn(() => ({ dispatch: mockStagedSearchDispatch })),
}))

const accessToken = 'access_token'
const method = 'fromLogin'

describe('AuthContext', () => {
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

  describe('useLoginRoutine', () => {
    it('should saveRefreshToken', async () => {
      const mockSaveRefreshToken = jest.spyOn(Keychain, 'saveRefreshToken')
      await renderUseLoginRoutine()

      expect(mockSaveRefreshToken).toBeCalledTimes(1)
    })

    it('should log login analytics', async () => {
      await renderUseLoginRoutine()

      expect(analytics.logLogin).toHaveBeenNthCalledWith(1, { method })
    })

    it('should log cookies consent choice', async () => {
      await renderUseLoginRoutine()

      const cookiesConsentStorage = await storage.readObject('cookies_consent')
      expect(api.postnativev1cookiesConsent).toHaveBeenCalledWith(cookiesConsentStorage)
    })

    it('should save access token to storage', async () => {
      await renderUseLoginRoutine()

      const accessTokenStorage = await storage.readString('access_token')
      expect(accessTokenStorage).toEqual(accessToken)
    })

    describe('connectServicesRequiringUserId', () => {
      it('should set batch identifier', async () => {
        await renderUseLoginRoutine()

        expect(BatchUser.editor().setIdentifier).toHaveBeenNthCalledWith(1, FAKE_USER_ID.toString())
      })

      it('should log set user id analytics', async () => {
        await renderUseLoginRoutine()

        expect(analytics.setUserId).toHaveBeenCalledWith(FAKE_USER_ID)
      })

      it('should set user id in cookies consent storage', async () => {
        await renderUseLoginRoutine()

        const cookiesConsentStorage = await storage.readObject('cookies_consent')
        expect(cookiesConsentStorage).toEqual({ userId: FAKE_USER_ID })
      })
    })

    describe('resetContexts', () => {
      it('should reset search context', async () => {
        await renderUseLoginRoutine()

        expect(mockSearchDispatch).toHaveBeenNthCalledWith(1, { type: 'INIT' })
      })

      it('should reset search context', async () => {
        await renderUseLoginRoutine()

        expect(mockStagedSearchDispatch).toHaveBeenNthCalledWith(1, { type: 'INIT' })
      })

      it('should reset identity check context', async () => {
        await renderUseLoginRoutine()

        expect(mockIdentityCheckDispatch).toHaveBeenNthCalledWith(1, { type: 'INIT' })
      })
    })
  })
})

const renderUseLogoutRoutine = async () => {
  const { result } = renderHook(useLogoutRoutine)
  const logout = result.current
  await logout()
}

const renderUseLoginRoutine = async () => {
  const { result } = renderHook(useLoginRoutine, {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
  const login = result.current
  await act(async () => {
    await login(
      {
        accessToken,
        accountState: AccountState.ACTIVE,
        refreshToken: 'refresh_token',
      },
      method
    )
  })
  await superFlushWithAct()
}
