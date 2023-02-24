import mockdate from 'mockdate'
import { rest } from 'msw'
import React from 'react'

import { UserProfileResponse } from 'api/gen'
import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { amplitude } from 'libs/amplitude'
import { env } from 'libs/environment'
import { NetInfoWrapper } from 'libs/network/NetInfoWrapper'
import { useNetInfo } from 'libs/network/useNetInfo'
import { QueryKeys } from 'libs/queryKeys'
import { storage, StorageKey } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { renderHook, waitFor } from 'tests/utils'

import { AuthWrapper, useAuthContext } from './AuthContext'

mockdate.set(CURRENT_DATE)

jest.unmock('libs/jwt')
jest.unmock('libs/network/NetInfoWrapper')
const mockedUseNetInfo = useNetInfo as jest.Mock

const mockUserProfileInfo = (user = beneficiaryUser) => {
  server.use(
    rest.get<UserProfileResponse>(env.API_BASE_URL + '/native/v1/me', (_req, res, ctx) =>
      res(ctx.status(200), ctx.json(user))
    )
  )
}

describe('AuthContext', () => {
  beforeEach(async () => {
    await storage.clear('access_token')
    await storage.clear(QueryKeys.USER_PROFILE as unknown as StorageKey)

    mockUserProfileInfo()
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

    it('should set user properties to Amplitude events when user is beneficiary', async () => {
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
    }),
      it('should set user properties to Amplitude events when user is not beneficiary', async () => {
        storage.saveString('access_token', 'token')
        mockUserProfileInfo(nonBeneficiaryUser)

        renderUseAuthContext()

        await waitFor(() => {
          expect(amplitude.setUserProperties).toHaveBeenCalledWith({
            appVersion: '1.10.5',
            id: 1234,
            isBeneficiary: false,
            needsToFillCulturalSurvey: true,
            status: 'non_eligible',
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
