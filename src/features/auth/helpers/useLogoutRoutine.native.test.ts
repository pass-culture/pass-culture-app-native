import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ReactQueryAPI from '@tanstack/react-query'

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
      const { result } = renderUseLogoutRoutine()
      await result.current()

      expect(BatchProfile.identify).toHaveBeenNthCalledWith(1, null)
    })

    it('should set app_version to null in BatchProfile editor', async () => {
      jest.spyOn(BatchProfile, 'editor').mockReturnValueOnce(mockEditor)

      const { result } = renderUseLogoutRoutine()
      await result.current()

      expect(BatchProfile.editor).toHaveBeenCalledTimes(1)
      expect(mockSetAttribute).toHaveBeenCalledWith('app_version', null)
    })

    it('should set last_booking_date to null in BatchProfile editor', async () => {
      jest.spyOn(BatchProfile, 'editor').mockReturnValueOnce(mockEditor)

      const { result } = renderUseLogoutRoutine()
      await result.current()

      expect(BatchProfile.editor).toHaveBeenCalledTimes(1)
      expect(mockSetAttribute).toHaveBeenCalledWith('last_booking_date', null)
    })

    it('should set credit_activation_date to null in BatchProfile editor', async () => {
      jest.spyOn(BatchProfile, 'editor').mockReturnValueOnce(mockEditor)

      const { result } = renderUseLogoutRoutine()
      await result.current()

      expect(BatchProfile.editor).toHaveBeenCalledTimes(1)
      expect(mockSetAttribute).toHaveBeenCalledWith('credit_activation_date', null)
    })

    it('should save BatchProfile', async () => {
      jest.spyOn(BatchProfile, 'editor').mockReturnValueOnce(mockEditor)

      const { result } = renderUseLogoutRoutine()
      await result.current()

      expect(mockSave).toHaveBeenCalledTimes(1)
    })
  })

  it('should log analytics', async () => {
    const { result } = renderUseLogoutRoutine()
    await result.current()

    expect(analytics.logLogout).toHaveBeenCalledTimes(1)
  })

  it('should remove access token from async storage', async () => {
    const { result } = renderUseLogoutRoutine()
    await result.current()

    expect(AsyncStorage.removeItem).toHaveBeenNthCalledWith(1, 'access_token')
  })

  it('should clear refresh token', async () => {
    const mockClearRefreshToken = jest.spyOn(Keychain, 'clearRefreshToken')
    const { result } = renderUseLogoutRoutine()
    await result.current()

    expect(mockClearRefreshToken).toHaveBeenCalledTimes(1)
  })

  it('should clear the currently set user in sentry', async () => {
    const { result } = renderUseLogoutRoutine()
    await result.current()

    expect(eventMonitoring.setUser).toHaveBeenCalledWith(null)
  })

  it.each(LoggedInQueryKeys)('should remove query: "%s"', async (query) => {
    const removeQueriesMock = jest.fn()
    // We only want to test that the routine cleans up the queries,
    // so we mock removeQueries and not the whole queryClient
    useQueryClientSpy.mockReturnValueOnce({
      removeQueries: removeQueriesMock,
    } as unknown as ReactQueryAPI.QueryClient)

    const { result } = renderUseLogoutRoutine()
    await result.current()

    expect(removeQueriesMock).toHaveBeenCalledWith([query])
  })

  it('should logout from Google account', async () => {
    const { result } = renderUseLogoutRoutine()
    await result.current()

    expect(googleLogout).toHaveBeenCalledTimes(1)
  })
})

const renderUseLogoutRoutine = () => {
  return renderHook(useLogoutRoutine, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
