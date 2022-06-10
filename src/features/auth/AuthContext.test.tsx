import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { BatchUser } from '__mocks__/libs/react-native-batch'
import { useLogoutRoutine } from 'features/auth/AuthContext'
import { analytics } from 'libs/analytics'
import * as Keychain from 'libs/keychain'
import { act, flushAllPromises, render } from 'tests/utils'
import { QueryKeys } from 'libs/queryKeys'
import { useQueryClient } from 'react-query'

jest.mock('react-query')

const TestLogoutComponent = () => {
  useLogoutRoutine()
  return null
}

describe('AuthContext', () => {
  describe('useLogoutRoutine', () => {
    const mockClearRefreshToken = jest.spyOn(Keychain, 'clearRefreshToken')
    const queryClient = useQueryClient()

    it('should ...', async () => {
      render(<TestLogoutComponent />)

      await act(flushAllPromises)

      await waitForExpect(() => {
        expect(BatchUser.editor().setIdentifier).toHaveBeenCalledWith(null)
        expect(analytics.logLogout).toBeCalledTimes(1)
        expect(AsyncStorage.removeItem).toHaveBeenCalledWith('access_token')
        expect(mockClearRefreshToken).toHaveBeenCalled()
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith(QueryKeys.USER_PROFILE)
      })
    })
  })
})
