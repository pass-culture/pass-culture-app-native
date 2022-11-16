import React from 'react'

import { AuthWrapper, useAuthContext } from 'features/auth/AuthContext'
import * as jwt from 'libs/jwt'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

const mockGetAccessTokenStatus = jest.spyOn(jwt, 'getAccessTokenStatus')

describe('AuthContext', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    storage.clear('access_token')
  })
  describe('useAuthContext', () => {
    it('should return the user when logged in', async () => {
      mockGetAccessTokenStatus.mockReturnValueOnce('valid')
      const result = renderUseAuthContext()

      await waitFor(() => {
        expect(result.current.user).toEqual({
          email: 'email@domain.ext',
          firstName: 'Jean',
          isBeneficiary: true,
        })
      })
    })

    // FIXME(aliraiki)
    // to many rerenders, probably linked to this hook => useConnectServicesRequiringUserId
    it.skip('should return undefined user when logged out', async () => {
      mockGetAccessTokenStatus.mockReturnValueOnce('expired')

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
