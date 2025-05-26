import mockdate from 'mockdate'
import React from 'react'
import DeviceInfo from 'react-native-device-info'

import { navigate, replace, useRoute } from '__mocks__/@react-navigation/native'
import { api } from 'api/api'
import { UserProfileResponse, ValidateEmailResponse } from 'api/gen'
import * as LoginAndRedirectAPI from 'features/auth/pages/signup/helpers/useLoginAndRedirect'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { nonBeneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import * as datesLib from 'libs/dates'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, waitFor } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { AfterSignupEmailValidationBuffer } from './AfterSignupEmailValidationBuffer'

mockdate.set(new Date('2020-12-01T00:00:00Z'))

jest.mock('libs/react-native-device-info/getDeviceId')
const loginAndRedirectMock = jest.fn()
jest.spyOn(LoginAndRedirectAPI, 'useLoginAndRedirect').mockReturnValue(loginAndRedirectMock)

const mockShowInfoSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showInfoSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowInfoSnackBar(props)),
  }),
}))

jest.spyOn(DeviceInfo, 'getModel').mockReturnValue('iPhone 13')
jest.spyOn(DeviceInfo, 'getSystemName').mockReturnValue('iOS')
const apiValidateEmailSpy = jest.spyOn(api, 'postNativeV1ValidateEmail')
jest.useFakeTimers()

const renderPage = () => render(reactQueryProviderHOC(<AfterSignupEmailValidationBuffer />))

jest.mock('libs/firebase/analytics/analytics')

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
    beforeEach(() => {
      mockServer.postApi<ValidateEmailResponse>('/v1/validate_email', {
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      })
    })

    it('should login and redirect use on email validation success', async () => {
      mockServer.getApi<UserProfileResponse>('/v1/me', nonBeneficiaryUser)

      renderPage()

      await act(async () => {})

      expect(loginAndRedirectMock).toHaveBeenCalledWith({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      })
    })

    it('should log analytics on email validation success', async () => {
      mockServer.getApi<UserProfileResponse>('/v1/me', nonBeneficiaryUser)
      renderPage()

      await act(async () => {})

      expect(analytics.logEmailValidated).toHaveBeenCalledTimes(1)
    })

    it('should redirect to Home with a snackbar message on error', async () => {
      // eslint-disable-next-line local-rules/independent-mocks
      jest.spyOn(datesLib, 'isTimestampExpired').mockReturnValue(false)
      mockServer.postApi('/v1/validate_email', {
        responseOptions: { statusCode: 400, data: {} },
      })

      renderPage()

      await waitFor(
        () => {
          expect(mockShowInfoSnackBar).toHaveBeenCalledTimes(1)
          expect(mockShowInfoSnackBar).toHaveBeenCalledWith({
            message: 'Ce lien de validation n’est plus valide',
            timeout: SNACK_BAR_TIME_OUT,
          })
          expect(replace).toHaveBeenCalledTimes(1)
          expect(replace).toHaveBeenCalledWith(...homeNavConfig)
        },
        { timeout: 10_000 }
      )
    })
  })

  describe('when timestamp is expired', () => {
    beforeEach(() => {
      mockServer.getApi<UserProfileResponse>('/v1/me', {
        ...nonBeneficiaryUser,
        email: 'email@domain.ext',
        firstName: 'Jean',
        isEligibleForBeneficiaryUpgrade: false,
        eligibilityStartDatetime: '2019-12-01T00:00:00Z',
      })
      mockServer.postApi('/v1/validate_email', {})
    })

    it('should redirect to SignupConfirmationExpiredLink', async () => {
      jest.spyOn(datesLib, 'isTimestampExpired').mockReturnValueOnce(true)
      renderPage()

      await waitFor(
        () => {
          expect(replace).toHaveBeenCalledTimes(1)
          expect(replace).toHaveBeenCalledWith('SignupConfirmationExpiredLink', {
            email: 'john@wick.com',
          })
        },
        { timeout: 10_000 }
      )
    })
  })

  describe('Email validation API call', () => {
    beforeEach(() => {
      mockServer.getApi<UserProfileResponse>('/v1/me', {
        ...nonBeneficiaryUser,
        email: 'email@domain.ext',
        firstName: 'Jean',
        isEligibleForBeneficiaryUpgrade: false,
        eligibilityStartDatetime: '2019-12-01T00:00:00Z',
      })
      mockServer.postApi('/v1/validate_email', {})
    })

    it('should validate email with device info', async () => {
      renderPage()

      await act(() => {})

      expect(apiValidateEmailSpy).toHaveBeenCalledTimes(1)
      expect(apiValidateEmailSpy).toHaveBeenCalledWith({
        deviceInfo: {
          deviceId: 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
          os: 'iOS',
          source: 'iPhone 13',
          resolution: '750x1334',
          screenZoomLevel: 2,
        },
        emailValidationToken: 'reerereskjlmkdlsf',
      })
    })
  })
})
