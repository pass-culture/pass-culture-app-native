import mockdate from 'mockdate'
import React from 'react'

import { CURRENT_DATE } from 'features/auth/pages/signup/SetBirthday/utils/fixtures'
import { beneficiaryUser } from 'fixtures/user'
import { amplitude } from 'libs/amplitude'
import { NetInfoWrapper } from 'libs/network/NetInfoWrapper'
import { useNetInfo } from 'libs/network/useNetInfo'
import { QueryKeys } from 'libs/queryKeys'
import { storage, StorageKey } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

import { AuthWrapper, useAuthContext } from './AuthContext'

mockdate.set(CURRENT_DATE)

jest.unmock('libs/jwt')
jest.unmock('libs/network/NetInfoWrapper')
const mockedUseNetInfo = useNetInfo as jest.Mock

describe('AuthContext', () => {
  beforeEach(async () => {
    await storage.clear('access_token')
    await storage.clear(QueryKeys.USER_PROFILE as unknown as StorageKey)
  })

  describe('useAuthContext', () => {
    it('should not return user when logged in but no internet connection', async () => {
      mockedUseNetInfo.mockReturnValueOnce({ isConnected: false, isInternetReachable: false })
      storage.saveString('access_token', 'token')
      const result = renderUseAuthContext()

      await waitFor(() => {
        expect(result.current.user).toBeUndefined()
      })
    })

    it('should return the user when logged in with internet connection', async () => {
      storage.saveString('access_token', 'token')
      const result = renderUseAuthContext()

      await waitFor(() => {
        expect(result.current.user).toEqual(beneficiaryUser)
      })
    })

    it('should return undefined user when logged out', async () => {
      const result = renderUseAuthContext()

      await waitFor(() => {
        expect(result.current.user).toEqual(undefined)
      })
    })

    it('should return refetchUser', async () => {
      const result = renderUseAuthContext()

      await waitFor(() => {
        expect(result.current.refetchUser).toBeDefined()
      })
    })

    it('should set user properties to Amplitude events', async () => {
      storage.saveString('access_token', 'token')
      renderUseAuthContext()

      await waitFor(() => {
        expect(amplitude.setUserProperties).toHaveBeenCalledWith({
          age: 18,
          appVersion: '1.10.5',
          depositType: 'GRANT_18',
          eligibility: 'age-18',
          eligibilityEndDatetime: '2023-11-19T11:00:00Z',
          id: 1234,
          isBeneficiary: true,
          needsToFillCulturalSurvey: true,
          status: 'beneficiary',
        })
      })
    })
  })
})

const renderUseAuthContext = () => {
  const { result } = renderHook(useAuthContext, {
    wrapper: ({ children }) =>
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      reactQueryProviderHOC(
        <NetInfoWrapper>
          <AuthWrapper>{children}</AuthWrapper>
        </NetInfoWrapper>
      ),
  })

  return result
}
