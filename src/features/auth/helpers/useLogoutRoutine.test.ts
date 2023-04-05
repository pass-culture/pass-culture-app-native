import AsyncStorage from '@react-native-async-storage/async-storage'
import { useQueryClient } from 'react-query'

import { BatchUser } from '__mocks__/libs/react-native-batch'
import { analytics } from 'libs/firebase/analytics'
import * as Keychain from 'libs/keychain'
import { renderHook } from 'tests/utils'

import { LoggedInQueryKeys, useLogoutRoutine } from './useLogoutRoutine'

jest.mock('api/api')
jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQueryClient: jest.fn().mockReturnValue({ removeQueries: jest.fn() }),
  usePersistQuery: jest.fn(),
}))

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

    expect(queryClient.removeQueries).toHaveBeenCalledWith([query])
  })
})

const renderUseLogoutRoutine = async () => {
  const { result } = renderHook(useLogoutRoutine)
  const logout = result.current
  await logout()
}
