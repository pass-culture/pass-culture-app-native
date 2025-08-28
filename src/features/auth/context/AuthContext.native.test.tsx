import mockdate from 'mockdate'
import React from 'react'

import { BatchProfile } from '__mocks__/@batch.com/react-native-plugin'
import * as jwt from '__mocks__/jwt-decode'
import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import * as NavigationRef from 'features/navigation/navigationRef'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
// eslint-disable-next-line no-restricted-imports
import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { decodedTokenWithRemainingLifetime, tokenRemainingLifetimeInMs } from 'libs/jwt/fixtures'
import { clearRefreshToken, getRefreshToken, saveRefreshToken } from 'libs/keychain/keychain'
import { eventMonitoring } from 'libs/monitoring/services'
import { NetInfoWrapper } from 'libs/network/NetInfoWrapper'
import { useNetInfo } from 'libs/network/useNetInfo'
import * as PackageJson from 'libs/packageJson'
import { QueryKeys } from 'libs/queryKeys'
import { StorageKey, storage } from 'libs/storage'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

import { useAuthContext } from './AuthContext'
import { AuthWrapper } from './AuthWrapper'

const mockedUseNetInfo = useNetInfo as jest.Mock

jest.spyOn(PackageJson, 'getAppVersion').mockReturnValue('1.10.5')
const navigateFromRefSpy = jest.spyOn(NavigationRef, 'navigateFromRef')

const MAX_AVERAGE_SESSION_DURATION_IN_MS = 60 * 60 * 1000
const tokenExpirationDate = (CURRENT_DATE.getTime() + tokenRemainingLifetimeInMs) / 1000
const decodeTokenSpy = jest.spyOn(jwt, 'default')

jest.useFakeTimers()

jest.mock('libs/firebase/analytics/analytics')

jest
  .spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')
  .mockReturnValue(remoteConfigResponseFixture)

describe('AuthContext', () => {
  beforeEach(async () => {
    mockdate.set(CURRENT_DATE)
    await storage.clear('access_token')
    await clearRefreshToken()
    await storage.clear(QueryKeys.USER_PROFILE as unknown as StorageKey)
    decodeTokenSpy.mockReturnValue({
      ...decodedTokenWithRemainingLifetime,
      exp: tokenExpirationDate,
    })
  })

  describe('useAuthContext', () => {
    beforeEach(() => {
      mockServer.getApi<UserProfileResponseWithoutSurvey>('/v1/me', nonBeneficiaryUser)
    })

    it('should not return user when logged in but no internet connection', async () => {
      mockedUseNetInfo.mockReturnValueOnce({ isConnected: false, isInternetReachable: false })
      await saveRefreshToken('token')

      const result = renderUseAuthContext()

      await act(async () => {})

      expect(result.current.user).toBeUndefined()
    })

    it('should return the user when logged in with internet connection', async () => {
      await storage.saveString('access_token', 'access_token')
      await saveRefreshToken('token')

      mockServer.getApi<UserProfileResponseWithoutSurvey>('/v1/me', beneficiaryUser)

      const result = renderUseAuthContext()

      await waitFor(() => expect(result.current.user).toEqual(beneficiaryUser))
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

    it('should log out user when refresh token is no longer valid', async () => {
      await storage.saveString('access_token', 'access_token')
      await saveRefreshToken('token')

      const result = renderUseAuthContext()

      await act(async () => {}) // We need this first act to make sure all updates are finished before advancing timers
      await act(async () => {
        mockdate.set(CURRENT_DATE.getTime() + tokenRemainingLifetimeInMs)
        jest.advanceTimersByTime(tokenRemainingLifetimeInMs)
      })

      await waitFor(() => expect(result.current.isLoggedIn).toBe(false))
    })

    it('should log out user when refresh token remaining lifetime is longer than max average session duration', async () => {
      decodedTokenWithRemainingLifetime.exp =
        (CURRENT_DATE.getTime() + MAX_AVERAGE_SESSION_DURATION_IN_MS) / 1000
      await storage.saveString('access_token', 'access_token')
      await saveRefreshToken('token')

      const result = renderUseAuthContext()

      await act(async () => {}) // We need this first act to make sure all updates are finished before advancing timers
      await act(async () => {
        mockdate.set(CURRENT_DATE.getTime() + MAX_AVERAGE_SESSION_DURATION_IN_MS)
        jest.advanceTimersByTime(MAX_AVERAGE_SESSION_DURATION_IN_MS)
      })

      expect(result.current.isLoggedIn).toBe(false)
    })

    it('should not navigate to login with the force display message when user has no refresh token', async () => {
      await storage.saveString('access_token', 'access_token')

      renderUseAuthContext()

      await act(async () => {})

      expect(navigateFromRefSpy).not.toHaveBeenCalled()
    })

    it('should navigate to login with the force display message when the refresh token is expired', async () => {
      await storage.saveString('access_token', 'access_token')
      await saveRefreshToken('token')

      const expiredToken = {
        ...decodedTokenWithRemainingLifetime,
        exp: (CURRENT_DATE.getTime() - 1) / 1000,
      }
      decodeTokenSpy.mockReturnValueOnce(expiredToken) // first render
      decodeTokenSpy.mockReturnValueOnce(expiredToken) // second render because of useCookies
      decodeTokenSpy.mockReturnValueOnce(expiredToken) // third render because of useUserProfileInfo

      renderUseAuthContext()

      await act(async () => {}) // We need this first act to make sure all updates are finished before advancing timers
      await act(async () => {
        jest.advanceTimersByTime(tokenRemainingLifetimeInMs)
      })

      expect(navigateFromRefSpy).toHaveBeenCalledWith('Login', {
        displayForcedLoginHelpMessage: true,
      })
    })

    it('should navigate to login with the force display message when the refresh token expires during user session', async () => {
      await storage.saveString('access_token', 'access_token')
      await saveRefreshToken('token')

      renderUseAuthContext()

      await act(async () => {}) // We need this first act to make sure all updates are finished before advancing timers
      await act(async () => {
        mockdate.set(CURRENT_DATE.getTime() + tokenRemainingLifetimeInMs)
        jest.advanceTimersByTime(tokenRemainingLifetimeInMs)
      })

      await waitFor(() =>
        expect(navigateFromRefSpy).toHaveBeenCalledWith('Login', {
          displayForcedLoginHelpMessage: true,
        })
      )
    })

    it('should clear refresh token when it expires', async () => {
      await storage.saveString('access_token', 'access_token')
      await saveRefreshToken('token')

      const expiredToken = {
        ...decodedTokenWithRemainingLifetime,
        exp: (CURRENT_DATE.getTime() - 1) / 1000,
      }
      decodeTokenSpy.mockReturnValueOnce(expiredToken) // first render
      decodeTokenSpy.mockReturnValueOnce(expiredToken) // second render because of useCookies
      decodeTokenSpy.mockReturnValueOnce(expiredToken) // third render because of useUserProfileInfo

      renderUseAuthContext()

      await act(async () => {}) // We need this first act to make sure all updates are finished before advancing timers
      await act(async () => {
        jest.advanceTimersByTime(1000)
      })

      expect(await getRefreshToken()).toBe('')
    })

    it('should log to Sentry when error occurs', async () => {
      storage.saveString('access_token', 'access_token')
      await saveRefreshToken('token')
      const error = new Error('Batch error')
      BatchProfile.identify.mockImplementationOnce(() => {
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
      reactQueryProviderHOC(
        <NetInfoWrapper>
          <AuthWrapper>{children}</AuthWrapper>
        </NetInfoWrapper>
      ),
  })

  return result
}
