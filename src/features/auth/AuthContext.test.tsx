import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'
import { useQueryClient } from 'react-query'
import waitForExpect from 'wait-for-expect'

import { BatchUser } from '__mocks__/libs/react-native-batch'
import { LoggedInQueryKeys, useLogoutRoutine } from 'features/auth/AuthContext'
import { analytics } from 'libs/firebase/analytics'
import * as Keychain from 'libs/keychain'
import { act, flushAllPromises, render } from 'tests/utils'

jest.mock('react-query')

const TestLogoutComponent = () => {
  const logout = useLogoutRoutine()
  logout()
  return null
}

describe('AuthContext', () => {
  describe('useLogoutRoutine', () => {
    const mockClearRefreshToken = jest.spyOn(Keychain, 'clearRefreshToken')
    const queryClient = useQueryClient()

    it('should remove batch identifier', async () => {
      render(<TestLogoutComponent />)

      await act(flushAllPromises)

      await waitForExpect(() => {
        expect(BatchUser.editor().setIdentifier).toHaveBeenCalledWith(null)
      })
    })

    it('should log analytics', async () => {
      render(<TestLogoutComponent />)

      await act(flushAllPromises)

      await waitForExpect(() => {
        expect(analytics.logLogout).toBeCalledTimes(1)
      })
    })

    it('should remove access token from async storage', async () => {
      render(<TestLogoutComponent />)

      await act(flushAllPromises)

      await waitForExpect(() => {
        expect(AsyncStorage.removeItem).toHaveBeenCalledWith('access_token')
      })
    })

    it('should clear refresh token', async () => {
      render(<TestLogoutComponent />)

      await act(flushAllPromises)

      await waitForExpect(() => {
        expect(mockClearRefreshToken).toHaveBeenCalled()
      })
    })

    it.each(LoggedInQueryKeys)('should remove query: "%s"', async (query) => {
      render(<TestLogoutComponent />)

      await act(flushAllPromises)

      await waitForExpect(() => {
        expect(queryClient.removeQueries).toHaveBeenCalledWith(query)
      })
    })
  })
})
