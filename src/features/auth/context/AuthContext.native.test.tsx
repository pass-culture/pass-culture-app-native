import mockdate from 'mockdate'
import { rest } from 'msw'
import React from 'react'

import { UserProfileResponse } from 'api/gen'
import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
// eslint-disable-next-line no-restricted-imports
import { amplitude } from 'libs/amplitude'
import { env } from 'libs/environment'
import * as jwt from 'libs/jwt'
import { NetInfoWrapper } from 'libs/network/NetInfoWrapper'
import { useNetInfo } from 'libs/network/useNetInfo'
import { QueryKeys } from 'libs/queryKeys'
import { StorageKey, storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { act, renderHook } from 'tests/utils'

import { AuthWrapper, useAuthContext } from './AuthContext'

mockdate.set(CURRENT_DATE)

jest.unmock('libs/network/NetInfoWrapper')
const mockedUseNetInfo = useNetInfo as jest.Mock
const getTokenStatusSpy = jest.spyOn(jwt, 'getTokenStatus').mockReturnValue('valid')

describe('AuthContext', () => {
  beforeEach(async () => {
    await storage.clear('PASSCULTURE_REFRESH_TOKEN')
    await storage.clear(QueryKeys.USER_PROFILE as unknown as StorageKey)
  })

  describe('useAuthContext', () => {
    it('should not return user when logged in but no internet connection', async () => {
      mockedUseNetInfo.mockReturnValueOnce({ isConnected: false, isInternetReachable: false })
      storage.saveString('PASSCULTURE_REFRESH_TOKEN', 'token')

      const result = renderUseAuthContext()

      await act(async () => {})

      expect(result.current.user).toBeUndefined()
    })

    it('should return the user when logged in with internet connection', async () => {
      storage.saveString('PASSCULTURE_REFRESH_TOKEN', 'token')

      const result = renderUseAuthContext()

      await act(async () => {})

      expect(result.current.user).toEqual(beneficiaryUser)
    })

    it('should return undefined user when logged out (no token)', async () => {
      getTokenStatusSpy.mockReturnValueOnce('unknown') // first render
      getTokenStatusSpy.mockReturnValueOnce('unknown') // second render because of cookies state
      getTokenStatusSpy.mockReturnValueOnce('unknown') // third render because of loading state

      const result = renderUseAuthContext()

      await act(async () => {})

      expect(result.current.user).toBeUndefined()
    })

    it('should return undefined when refresh token is expired', async () => {
      getTokenStatusSpy.mockReturnValueOnce('expired') // first render
      getTokenStatusSpy.mockReturnValueOnce('expired') // second render because of cookies state
      getTokenStatusSpy.mockReturnValueOnce('expired') // third render because of loading state
      storage.saveString('PASSCULTURE_REFRESH_TOKEN', 'token')

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
      storage.saveString('PASSCULTURE_REFRESH_TOKEN', 'token')

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
      getTokenStatusSpy.mockReturnValueOnce('unknown') // first render
      getTokenStatusSpy.mockReturnValueOnce('unknown') // second render because of cookies state
      getTokenStatusSpy.mockReturnValueOnce('unknown') // third render because of loading state

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
      storage.saveString('PASSCULTURE_REFRESH_TOKEN', 'token')

      renderUseAuthContext()

      await act(async () => {})

      expect(amplitude.setUserId).toHaveBeenCalledWith(nonBeneficiaryUser.id.toString())
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
