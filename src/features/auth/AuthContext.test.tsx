import AsyncStorage from '@react-native-async-storage/async-storage'
import { useQueryClient } from 'react-query'

import { BatchUser } from '__mocks__/libs/react-native-batch'
import { LoggedInQueryKeys, useLogoutRoutine } from 'features/auth/AuthContext'
import { analytics } from 'libs/firebase/analytics'
import * as Keychain from 'libs/keychain'
import { renderHook } from 'tests/utils'

jest.mock('react-query')

describe('AuthContext', () => {
  describe('useLogoutRoutine', () => {
    const mockClearRefreshToken = jest.spyOn(Keychain, 'clearRefreshToken')
    const queryClient = useQueryClient()

    it('should remove batch identifier', async () => {
      const { result } = renderHook(useLogoutRoutine)

      const logout = result.current
      await logout()

      expect(BatchUser.editor().setIdentifier).toHaveBeenCalledWith(null)
    })

    it('should log analytics', async () => {
      const { result } = renderHook(useLogoutRoutine)

      const logout = result.current
      await logout()

      expect(analytics.logLogout).toBeCalledTimes(1)
    })

    it('should remove access token from async storage', async () => {
      const { result } = renderHook(useLogoutRoutine)

      const logout = result.current
      await logout()

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('access_token')
    })

    it('should clear refresh token', async () => {
      const { result } = renderHook(useLogoutRoutine)

      const logout = result.current
      await logout()

      expect(mockClearRefreshToken).toHaveBeenCalled()
    })

    it.each(LoggedInQueryKeys)('should remove query: "%s"', async (query) => {
      const { result } = renderHook(useLogoutRoutine)

      const logout = result.current
      await logout()

      expect(queryClient.removeQueries).toHaveBeenCalledWith(query)
    })
  })
})
