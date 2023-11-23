import mockdate from 'mockdate'
import { rest } from 'msw'
import React from 'react'
import DeviceInfo from 'react-native-device-info'

import { navigate, replace, useRoute } from '__mocks__/@react-navigation/native'
import { api } from 'api/api'
import { UserProfileResponse } from 'api/gen'
import * as Login from 'features/auth/helpers/useLoginRoutine'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { nonBeneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics'
import { CampaignEvents, campaignTracker } from 'libs/campaign'
import * as datesLib from 'libs/dates'
import { env } from 'libs/environment'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { act, render, waitFor } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { AfterSignupEmailValidationBuffer } from './AfterSignupEmailValidationBuffer'

mockdate.set(new Date('2020-12-01T00:00:00Z'))

jest.mock('features/auth/helpers/useLoginRoutine')
const loginRoutine = jest.fn()
const mockLoginRoutine = Login.useLoginRoutine as jest.Mock

const mockShowInfoSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showInfoSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowInfoSnackBar(props)),
  }),
}))

jest.spyOn(DeviceInfo, 'getModel').mockReturnValue('iPhone 13')
jest.spyOn(DeviceInfo, 'getSystemName').mockReturnValue('iOS')
const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)
const apiValidateEmailSpy = jest.spyOn(api, 'postNativeV1ValidateEmail')

const renderPage = () => render(reactQueryProviderHOC(<AfterSignupEmailValidationBuffer />))

describe('<AfterSignupEmailValidationBuffer />', () => {
  beforeAll(() => {
    useRoute.mockImplementation(() => ({
      params: {
        token: 'reerereskjlmkdlsf',
        expirationTimestamp: 45465546445,
        email: 'john@wick.com',
      },
    }))
  })

  afterEach(() => {
    navigate.mockRestore()
  })

  describe('when timestamp is NOT expired', () => {
    it('should redirect to AccountCreated when isEligibleForBeneficiaryUpgrade is false', async () => {
      server.use(
        rest.get<UserProfileResponse>(env.API_BASE_URL + '/native/v1/me', (_req, res, ctx) =>
          res.once(
            ctx.status(200),
            ctx.json({
              email: 'email@domain.ext',
              firstName: 'Jean',
              eligibility: 'age-18',
              isEligibleForBeneficiaryUpgrade: false,
            })
          )
        )
      )
      mockLoginRoutine.mockImplementationOnce(() => loginRoutine)
      mockLoginRoutine.mockImplementationOnce(() => loginRoutine) // second render because of useDeviceInfo

      renderPage()

      await waitFor(() => {
        expect(loginRoutine).toHaveBeenCalledTimes(1)
        expect(replace).toHaveBeenCalledTimes(1)
        expect(replace).toHaveBeenCalledWith('AccountCreated')
      })
      loginRoutine.mockRestore()
    })

    it('should redirect to Verify Eligibility when isEligibleForBeneficiaryUpgrade and user is 18 yo', async () => {
      server.use(
        rest.get<UserProfileResponse>(env.API_BASE_URL + '/native/v1/me', (_req, res, ctx) =>
          res.once(
            ctx.status(200),
            ctx.json({
              email: 'email@domain.ext',
              firstName: 'Jean',
              eligibility: 'age-18',
              isEligibleForBeneficiaryUpgrade: true,
            })
          )
        )
      )
      mockLoginRoutine.mockImplementationOnce(() => loginRoutine)
      mockLoginRoutine.mockImplementationOnce(() => loginRoutine) // second render because of useDeviceInfo

      renderPage()

      await waitFor(() => {
        expect(loginRoutine).toHaveBeenCalledTimes(1)
        expect(replace).toHaveBeenCalledTimes(1)
        expect(replace).toHaveBeenCalledWith('VerifyEligibility')
      })
      loginRoutine.mockRestore()
    })

    it('should redirect to AccountCreated when not isEligibleForBeneficiaryUpgrade and user is not future eligible', async () => {
      server.use(
        rest.get<UserProfileResponse>(env.API_BASE_URL + '/native/v1/me', (_req, res, ctx) =>
          res.once(
            ctx.status(200),
            ctx.json({
              email: 'email@domain.ext',
              firstName: 'Jean',
              isEligibleForBeneficiaryUpgrade: false,
              eligibilityStartDatetime: '2019-12-01T00:00:00Z',
            })
          )
        )
      )
      renderPage()

      await waitFor(() => {
        expect(replace).toHaveBeenCalledWith('AccountCreated')
      })
    })

    it('should log event on email validation success', async () => {
      renderPage()

      await waitFor(async () => {
        expect(campaignTracker.logEvent).toHaveBeenNthCalledWith(
          1,
          CampaignEvents.COMPLETE_REGISTRATION,
          {
            af_firebase_pseudo_id: await firebaseAnalytics.getAppInstanceId(),
            af_user_id: nonBeneficiaryUser.id,
          }
        )
      })
    })

    it('should log analytics on email validation success', async () => {
      renderPage()

      await waitFor(async () => {
        expect(analytics.logEmailValidated).toHaveBeenCalledTimes(1)
      })
    })

    it('should redirect to NotYetUnderageEligibility when not isEligibleForBeneficiaryUpgrade and user is future eligible', async () => {
      server.use(
        rest.get<UserProfileResponse>(env.API_BASE_URL + '/native/v1/me', (_req, res, ctx) =>
          res.once(
            ctx.status(200),
            ctx.json({
              email: 'email@domain.ext',
              firstName: 'Jean',
              isEligibleForBeneficiaryUpgrade: false,
              eligibilityStartDatetime: '2021-12-01T00:00:00Z',
            })
          )
        )
      )
      renderPage()

      await waitFor(() => {
        expect(replace).toHaveBeenCalledWith('NotYetUnderageEligibility', {
          eligibilityStartDatetime: '2021-12-01T00:00:00Z',
        })
      })
    })

    it('should redirect to Home with a snackbar message on error', async () => {
      // eslint-disable-next-line local-rules/independent-mocks
      jest.spyOn(datesLib, 'isTimestampExpired').mockReturnValue(false)
      server.use(
        rest.post(env.API_BASE_URL + '/native/v1/validate_email', (_req, res, ctx) =>
          res(ctx.status(400), ctx.json({}))
        )
      )

      renderPage()

      await waitFor(() => {
        expect(mockShowInfoSnackBar).toHaveBeenCalledTimes(1)
        expect(mockShowInfoSnackBar).toHaveBeenCalledWith({
          message: 'Ce lien de validation n’est plus valide',
          timeout: SNACK_BAR_TIME_OUT,
        })
        expect(replace).toHaveBeenCalledTimes(1)
        expect(replace).toHaveBeenCalledWith(...homeNavConfig)
      })
    })
  })

  describe('when timestamp is expired', () => {
    it('should redirect to SignupConfirmationExpiredLink', async () => {
      jest.spyOn(datesLib, 'isTimestampExpired').mockReturnValueOnce(true)
      renderPage()

      await waitFor(() => {
        expect(replace).toHaveBeenCalledTimes(1)
        expect(replace).toHaveBeenCalledWith('SignupConfirmationExpiredLink', {
          email: 'john@wick.com',
        })
      })
    })
  })

  describe('Email validation API call', () => {
    it('should validate email without device info when feature flag is disabled', async () => {
      renderPage()

      await act(() => {})

      expect(apiValidateEmailSpy).toHaveBeenCalledTimes(1)
      expect(apiValidateEmailSpy).toHaveBeenCalledWith({
        deviceInfo: undefined,
        emailValidationToken: 'reerereskjlmkdlsf',
      })
    })

    it('should validate email with device info when feature flag is active', async () => {
      useFeatureFlagSpy.mockReturnValueOnce(true) // first render
      useFeatureFlagSpy.mockReturnValueOnce(true) // second render because of useDeviceInfo
      useFeatureFlagSpy.mockReturnValueOnce(true) // third render because of useMutation
      useFeatureFlagSpy.mockReturnValueOnce(true) // fourth render because of useMutation

      renderPage()

      await act(() => {})

      expect(apiValidateEmailSpy).toHaveBeenCalledTimes(1)
      expect(apiValidateEmailSpy).toHaveBeenCalledWith({
        deviceInfo: {
          deviceId: 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
          os: 'iOS',
          source: 'iPhone 13',
        },
        emailValidationToken: 'reerereskjlmkdlsf',
      })
    })
  })
})
