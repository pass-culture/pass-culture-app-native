import React from 'react'

import { AuthWrapper, useAuthContext } from 'features/auth/AuthContext'
import { QueryKeys } from 'libs/queryKeys'
import { storage, StorageKey } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.unmock('libs/jwt')

describe('AuthContext', () => {
  beforeEach(async () => {
    await storage.clear('access_token')
    await storage.clear(QueryKeys.USER_PROFILE as unknown as StorageKey)
  })

  describe('useAuthContext', () => {
    it('should return the user when logged in', async () => {
      storage.saveString('access_token', 'token')
      const result = renderUseAuthContext()

      await waitFor(() => {
        expect(result.current.user).toEqual({
          email: 'email@domain.ext',
          firstName: 'Jean',
          isBeneficiary: true,
        })
      })
    })

    it('should return undefined user when logged out', async () => {
      const result = renderUseAuthContext()

      await waitFor(() => {
        expect(result.current.user).toEqual(undefined)
      })
    })
  })
})

const renderUseAuthContext = () => {
  const { result } = renderHook(useAuthContext, {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(<AuthWrapper>{children}</AuthWrapper>),
  })

  return result
}
