import AsyncStorage from '@react-native-async-storage/async-storage'

import { BatchProfile } from '__mocks__/@batch.com/react-native-plugin'
import * as API from 'api/api'
import { analytics } from 'libs/analytics/provider'
import * as Keychain from 'libs/keychain/keychain'
import { eventMonitoring } from 'libs/monitoring/services'
import { QueryKeys } from 'libs/queryKeys'
import { googleLogout } from 'libs/react-native-google-sso/googleLogout'
import { queryClient } from 'libs/react-query/queryClient'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook } from 'tests/utils'

import { useLogoutRoutine } from './useLogoutRoutine'

jest.mock('libs/keychain/keychain')

const apiSignOutSpy = jest.spyOn(API.api, 'postNativeV1Signout')

jest.mock('libs/firebase/analytics/analytics')

const mockSetAttribute = jest.fn()
const mockSave = jest.fn()
const mockEditor = { setAttribute: mockSetAttribute, save: mockSave }

describe('useLogoutRoutine', () => {
  describe('Batch', () => {
    it('should remove batch identifier', async () => {
      const { result } = renderUseLogoutRoutine()
      await result.current()

      expect(BatchProfile.identify).toHaveBeenNthCalledWith(1, null)
    })

    it('should set app_version to null in BatchProfile editor', async () => {
      jest.spyOn(BatchProfile, 'editor').mockReturnValueOnce(mockEditor)

      const { result } = renderUseLogoutRoutine()
      await result.current()

      expect(BatchProfile.editor).toHaveBeenCalledTimes(1)
      expect(mockSetAttribute).toHaveBeenCalledWith('app_version', null)
    })

    it('should set last_booking_date to null in BatchProfile editor', async () => {
      jest.spyOn(BatchProfile, 'editor').mockReturnValueOnce(mockEditor)

      const { result } = renderUseLogoutRoutine()
      await result.current()

      expect(BatchProfile.editor).toHaveBeenCalledTimes(1)
      expect(mockSetAttribute).toHaveBeenCalledWith('last_booking_date', null)
    })

    it('should set credit_activation_date to null in BatchProfile editor', async () => {
      jest.spyOn(BatchProfile, 'editor').mockReturnValueOnce(mockEditor)

      const { result } = renderUseLogoutRoutine()
      await result.current()

      expect(BatchProfile.editor).toHaveBeenCalledTimes(1)
      expect(mockSetAttribute).toHaveBeenCalledWith('credit_activation_date', null)
    })

    it('should save BatchProfile', async () => {
      jest.spyOn(BatchProfile, 'editor').mockReturnValueOnce(mockEditor)

      const { result } = renderUseLogoutRoutine()
      await result.current()

      expect(mockSave).toHaveBeenCalledTimes(1)
    })
  })

  it('should log analytics', async () => {
    const { result } = renderUseLogoutRoutine()
    await result.current()

    expect(analytics.logLogout).toHaveBeenCalledTimes(1)
  })

  it('should remove access token from async storage', async () => {
    const { result } = renderUseLogoutRoutine()
    await result.current()

    expect(AsyncStorage.removeItem).toHaveBeenNthCalledWith(1, 'access_token')
  })

  it('should clear refresh token', async () => {
    const mockClearRefreshToken = jest.spyOn(Keychain, 'clearRefreshToken')
    const { result } = renderUseLogoutRoutine()
    await result.current()

    expect(mockClearRefreshToken).toHaveBeenCalledTimes(1)
  })

  it('should clear the currently set user in sentry', async () => {
    const { result } = renderUseLogoutRoutine()
    await result.current()

    expect(eventMonitoring.setUser).toHaveBeenCalledWith(null)
  })

  it('should remove private queries', async () => {
    // Set query options
    const privateQueryOptions = { meta: { private: true } }
    queryClient.setQueryDefaults([QueryKeys.ACCOUNT_SUSPENSION_DATE], privateQueryOptions)
    queryClient.setQueryDefaults([QueryKeys.ACCOUNT_SUSPENSION_STATUS], privateQueryOptions)
    queryClient.setQueryDefaults([QueryKeys.USER_PROFILE], privateQueryOptions)
    queryClient.setQueryDefaults([QueryKeys.CULTURAL_SURVEY_QUESTIONS], privateQueryOptions)
    queryClient.setQueryDefaults([QueryKeys.FAVORITES], privateQueryOptions)
    queryClient.setQueryDefaults([QueryKeys.HOME_BANNER, true], privateQueryOptions)
    queryClient.setQueryDefaults([QueryKeys.RECOMMENDATION_OFFER_IDS, {}], privateQueryOptions)
    queryClient.setQueryDefaults([QueryKeys.ACTIVITY_TYPES], privateQueryOptions)
    queryClient.setQueryDefaults(
      [QueryKeys.STEPPER_INFO, 'phoneNumberInProfileStepper'],
      privateQueryOptions
    )
    queryClient.setQueryDefaults([QueryKeys.REMINDERS], privateQueryOptions)
    queryClient.setQueryDefaults([QueryKeys.EMAIL_CHANGE_EXPIRATION_TIMESTAMP], privateQueryOptions)
    queryClient.setQueryDefaults([QueryKeys.AVAILABLE_REACTION], privateQueryOptions)
    queryClient.setQueryDefaults([QueryKeys.BOOKINGSV2], privateQueryOptions)

    // Set data
    queryClient.setQueryData([QueryKeys.ACCOUNT_SUSPENSION_DATE], 'toto')
    queryClient.setQueryData([QueryKeys.ACCOUNT_SUSPENSION_STATUS], 'toto')
    queryClient.setQueryData([QueryKeys.USER_PROFILE], 'toto')
    queryClient.setQueryData([QueryKeys.CULTURAL_SURVEY_QUESTIONS], 'toto')
    queryClient.setQueryData([QueryKeys.FAVORITES], 'toto')
    queryClient.setQueryData([QueryKeys.HOME_BANNER, true], 'toto')
    queryClient.setQueryData([QueryKeys.RECOMMENDATION_OFFER_IDS, {}], 'toto')
    queryClient.setQueryData([QueryKeys.ACTIVITY_TYPES], 'toto')
    queryClient.setQueryData([QueryKeys.STEPPER_INFO, 'phoneNumberInProfileStepper'], 'toto')
    queryClient.setQueryData([QueryKeys.REMINDERS], 'toto')
    queryClient.setQueryData([QueryKeys.EMAIL_CHANGE_EXPIRATION_TIMESTAMP], 'toto')
    queryClient.setQueryData([QueryKeys.AVAILABLE_REACTION], 'toto')
    queryClient.setQueryData([QueryKeys.BOOKINGSV2], 'toto')

    const { result } = renderUseLogoutRoutine()
    await result.current()

    const cache = queryClient.getQueriesData({ predicate: (query) => !!query.meta?.private })

    expect(cache).toStrictEqual([])
  })

  it('should logout from Google account', async () => {
    const { result } = renderUseLogoutRoutine()
    await result.current()

    expect(googleLogout).toHaveBeenCalledTimes(1)
  })

  it('should logout from backend', async () => {
    const { result } = renderUseLogoutRoutine()
    await result.current()

    expect(apiSignOutSpy).toHaveBeenCalledTimes(1)
  })
})

const renderUseLogoutRoutine = () => {
  return renderHook(useLogoutRoutine, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
