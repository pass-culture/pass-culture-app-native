import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ReactQueryAPI from 'react-query'

import { BatchProfile } from '__mocks__/@batch.com/react-native-plugin'
import { analytics } from 'libs/analytics/provider'
import * as Keychain from 'libs/keychain/keychain'
import { eventMonitoring } from 'libs/monitoring/services'
import { googleLogout } from 'libs/react-native-google-sso/googleLogout'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook } from 'tests/utils'

import { LoggedInQueryKeys, useLogoutRoutine } from './useLogoutRoutine'

jest.mock('libs/keychain/keychain')

const useQueryClientSpy = jest.spyOn(ReactQueryAPI, 'useQueryClient')

jest.mock('libs/firebase/analytics/analytics')

const mockSetAttribute = jest.fn()
const mockSave = jest.fn()
const mockEditor = { setAttribute: mockSetAttribute, save: mockSave }

describe('useLogoutRoutine', () => {
  describe('Batch', () => {
    it('should remove batch identifier', async () => {
      await renderUseLogoutRoutine()

      expect(BatchProfile.identify).toHaveBeenNthCalledWith(1, null)
    })

    it('should set app_version to null in BatchProfile editor', async () => {
      jest.spyOn(BatchProfile, 'editor').mockReturnValueOnce(mockEditor)

      await renderUseLogoutRoutine()

      expect(BatchProfile.editor).toHaveBeenCalledTimes(1)
      expect(mockSetAttribute).toHaveBeenCalledWith('app_version', null)
    })

    it('should set last_booking_date to null in BatchProfile editor', async () => {
      jest.spyOn(BatchProfile, 'editor').mockReturnValueOnce(mockEditor)

      await renderUseLogoutRoutine()

      expect(BatchProfile.editor).toHaveBeenCalledTimes(1)
      expect(mockSetAttribute).toHaveBeenCalledWith('last_booking_date', null)
    })

    it('should set credit_activation_date to null in BatchProfile editor', async () => {
      jest.spyOn(BatchProfile, 'editor').mockReturnValueOnce(mockEditor)

      await renderUseLogoutRoutine()

      expect(BatchProfile.editor).toHaveBeenCalledTimes(1)
      expect(mockSetAttribute).toHaveBeenCalledWith('credit_activation_date', null)
    })

    it('should save BatchProfile', async () => {
      jest.spyOn(BatchProfile, 'editor').mockReturnValueOnce(mockEditor)

      await renderUseLogoutRoutine()

      expect(mockSave).toHaveBeenCalledTimes(1)
    })
  })

  it('should log analytics', async () => {
    await renderUseLogoutRoutine()

    expect(analytics.logLogout).toHaveBeenCalledTimes(1)
  })

  it('should remove access token from async storage', async () => {
    await renderUseLogoutRoutine()

    expect(AsyncStorage.removeItem).toHaveBeenNthCalledWith(1, 'access_token')
  })

  it('should clear refresh token', async () => {
    const mockClearRefreshToken = jest.spyOn(Keychain, 'clearRefreshToken')
    await renderUseLogoutRoutine()

    expect(mockClearRefreshToken).toHaveBeenCalledTimes(1)
  })

  it('should clear the currently set user in sentry', async () => {
    await renderUseLogoutRoutine()

    expect(eventMonitoring.setUser).toHaveBeenCalledWith(null)
  })

  it.each(LoggedInQueryKeys)('should remove query: "%s"', async (query) => {
    const removeQueriesMock = jest.fn()
    // We only want to test that the routine cleans up the queries,
    // so we mock removeQueries and not the whole queryClient
    useQueryClientSpy.mockReturnValueOnce({
      removeQueries: removeQueriesMock,
    } as unknown as ReactQueryAPI.QueryClient)

    await renderUseLogoutRoutine()

    expect(removeQueriesMock).toHaveBeenCalledWith([query])
  })

  it('should logout from Google account', async () => {
    await renderUseLogoutRoutine()

    expect(googleLogout).toHaveBeenCalledTimes(1)
  })
})

const renderUseLogoutRoutine = async () => {
  const { result } = renderHook(useLogoutRoutine, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
  const logout = result.current
  await logout()
}
