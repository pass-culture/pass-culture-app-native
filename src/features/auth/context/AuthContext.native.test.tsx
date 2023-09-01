import mockdate from 'mockdate'
import { rest } from 'msw'
import React from 'react'

import * as jwt from '__mocks__/jwt-decode'
import { BatchUser } from '__mocks__/libs/react-native-batch'
import { UserProfileResponse } from 'api/gen'
import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
// eslint-disable-next-line no-restricted-imports
import { amplitude } from 'libs/amplitude'
import { env } from 'libs/environment'
import { saveRefreshToken, clearRefreshToken } from 'libs/keychain'
import { eventMonitoring } from 'libs/monitoring'
import { NetInfoWrapper } from 'libs/network/NetInfoWrapper'
import { useNetInfo } from 'libs/network/useNetInfo'
import { QueryKeys } from 'libs/queryKeys'
import { StorageKey, storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { act, renderHook } from 'tests/utils'

import { AuthWrapper, useAuthContext } from './AuthContext'

jest.unmock('libs/jwt')
jest.unmock('libs/keychain')
jest.unmock('libs/network/NetInfoWrapper')
const mockedUseNetInfo = useNetInfo as jest.Mock

const tokenRemainingLifetimeInMs = 10 * 60 * 1000
const decodedTokenWithRemainingLifetime = {
  exp: (CURRENT_DATE.getTime() + tokenRemainingLifetimeInMs) / 1000,
  iat: 1691670780,
  jti: '7f82c8b0-6222-42be-b913-cdf53958f17d',
  sub: 'bene_18@example.com',
  nbf: 1691670780,
  user_claims: { user_id: 1234 },
}
const decodeTokenSpy = jest.spyOn(jwt, 'default').mockReturnValue(decodedTokenWithRemainingLifetime)

jest.useFakeTimers({ legacyFakeTimers: true })

describe('AuthContext', () => {
  beforeEach(async () => {
    mockdate.set(CURRENT_DATE)
    await storage.clear('access_token')
    await clearRefreshToken()
    await storage.clear(QueryKeys.USER_PROFILE as unknown as StorageKey)
  })

  describe('useAuthContext', () => {
    it('should not return user when logged in but no internet connection', async () => {
      mockedUseNetInfo.mockReturnValueOnce({ isConnected: false, isInternetReachable: false })
      await saveRefreshToken('token')

      const result = renderUseAuthContext()

      await act(async () => {})

      expect(result.current.user).toBeUndefined()
    })

    it('should return the user when logged in with internet connection', async () => {
      await saveRefreshToken('token')

      const result = renderUseAuthContext()

      await act(async () => {})

      expect(result.current.user).toEqual(beneficiaryUser)
    })

    it('should return undefined user when logged out (no token)', async () => {
      const result = renderUseAuthContext()

      await act(async () => {})

      expect(result.current.user).toBeUndefined()
    })

    it('should return undefined when refresh token is expired', async () => {
      await saveRefreshToken('token')

      const expiredToken = {
        ...decodedTokenWithRemainingLifetime,
        exp: (CURRENT_DATE.getTime() - 1) / 1000,
      }
      decodeTokenSpy.mockReturnValueOnce(expiredToken) // first render
      decodeTokenSpy.mockReturnValueOnce(expiredToken) // second render because of useCookies
      decodeTokenSpy.mockReturnValueOnce(expiredToken) // third render because of useUserProfileInfo

      const result = renderUseAuthContext()

      await act(async () => {})

      expect(result.current.user).toBeUndefined()
    })

    it('should return refetchUser', async () => {
      const result = renderUseAuthContext()

      await act(async () => {})

      expect(result.current.refetchUser).toBeDefined()
    })

    it('should set user properties to Amplitude events when user is logged in', async () => {
      await saveRefreshToken('token')

      renderUseAuthContext()

      await act(async () => {})

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

    it('should not set user properties to Amplitude events when user is not logged in', async () => {
      server.use(
        rest.get<UserProfileResponse>(env.API_BASE_URL + '/native/v1/me', (_req, res, ctx) =>
          res(ctx.status(200), ctx.json(nonBeneficiaryUser))
        )
      )

      renderUseAuthContext()

      await act(async () => {})

      expect(amplitude.setUserProperties).not.toHaveBeenCalled()
    })

    it('should set user id when user is logged in', async () => {
      server.use(
        rest.get<UserProfileResponse>(env.API_BASE_URL + '/native/v1/me', (_req, res, ctx) =>
          res(ctx.status(200), ctx.json(nonBeneficiaryUser))
        )
      )
      await saveRefreshToken('token')

      renderUseAuthContext()

      await act(async () => {})

      expect(amplitude.setUserId).toHaveBeenCalledWith(nonBeneficiaryUser.id.toString())
    })

    it('should log out user when refresh token is no longer valid', async () => {
      await saveRefreshToken('token')
      const result = renderUseAuthContext()

      await act(async () => {}) // We need this first act to make sure all updates are finished before advancing timers
      await act(async () => {
        mockdate.set(CURRENT_DATE.getTime() + tokenRemainingLifetimeInMs)
        jest.advanceTimersByTime(tokenRemainingLifetimeInMs)
      })

      expect(result.current.isLoggedIn).toBe(false)
    })

    it('should log to Sentry when error occurs', async () => {
      storage.saveString('access_token', 'access_token')
      await saveRefreshToken('token')
      const error = new Error('Batch error')
      BatchUser.editor.mockImplementationOnce(() => {
        throw error
      })

      renderUseAuthContext()

      await act(async () => {})

      expect(eventMonitoring.captureException).toHaveBeenCalledWith(error)
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
