import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ReactQueryAPI from 'react-query'

import { BatchUser } from '__mocks__/@batch.com/react-native-plugin'
import { analytics } from 'libs/analytics'
import * as Keychain from 'libs/keychain/keychain'
import { eventMonitoring } from 'libs/monitoring'
import { googleLogout } from 'libs/react-native-google-sso/googleLogout'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook } from 'tests/utils'

import { LoggedInQueryKeys, useLogoutRoutine } from './useLogoutRoutine'

jest.mock('libs/keychain/keychain')

const useQueryClientSpy = jest.spyOn(ReactQueryAPI, 'useQueryClient')

jest.mock('libs/firebase/analytics/analytics')

describe('useLogoutRoutine', () => {
  it('should remove batch identifier', async () => {
    await renderUseLogoutRoutine()

    expect(BatchUser.editor().setIdentifier).toHaveBeenNthCalledWith(1, null)
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
