import mockdate from 'mockdate'
import { rest } from 'msw'
import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { UserProfileResponse } from 'api/gen'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import * as datesLib from 'libs/dates'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { render, waitFor } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { loginRoutine } from '../../../__mocks__/AuthContext'
import * as Auth from '../../../AuthContext'
import { AfterSignupEmailValidationBuffer } from '../AfterSignupEmailValidationBuffer'

mockdate.set(new Date('2020-12-01T00:00:00Z'))

jest.mock('features/auth/settings')
jest.mock('features/auth/AuthContext')
const mockLoginRoutine = Auth.useLoginRoutine as jest.Mock

const mockShowInfoSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showInfoSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowInfoSnackBar(props)),
  }),
}))

// eslint-disable-next-line local-rules/no-react-query-provider-hoc
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
      renderPage()

      await waitFor(() => {
        expect(loginRoutine).toBeCalledTimes(1)
        expect(navigate).toBeCalledTimes(1)
        expect(navigate).toHaveBeenCalledWith('AccountCreated')
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
      renderPage()

      await waitFor(() => {
        expect(loginRoutine).toBeCalledTimes(1)
        expect(navigate).toBeCalledTimes(1)
        expect(navigate).toHaveBeenCalledWith('VerifyEligibility')
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
        expect(navigate).toHaveBeenCalledWith('AccountCreated')
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
        expect(navigate).toHaveBeenCalledWith('NotYetUnderageEligibility', {
          eligibilityStartDatetime: '2021-12-01T00:00:00Z',
        })
      })
    })

    it('should redirect to Home with a snackbar message on error', async () => {
      // TODO(PC-6360): ignore warning displayed by react-query's useMutation onError callback.
      // Note : it appears next to impossible to hide this warning by acting on the console object alone.
      // The only solution probably lies in mocking partially or completely react-query.
      // eslint-disable-next-line local-rules/independant-mocks
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
          message: "Ce lien de validation n'est plus valide",
        })
        expect(navigate).toBeCalledTimes(1)
        expect(navigate).toHaveBeenCalledWith(...homeNavConfig)
      })
    })
  })

  describe('when timestamp is expired', () => {
    it('should redirect to SignupConfirmationExpiredLink', async () => {
      // eslint-disable-next-line local-rules/independant-mocks
      jest.spyOn(datesLib, 'isTimestampExpired').mockReturnValue(true)
      renderPage()

      await waitFor(() => {
        expect(navigate).toBeCalledTimes(1)
        expect(navigate).toHaveBeenCalledWith('SignupConfirmationExpiredLink', {
          email: 'john@wick.com',
        })
      })
    })
  })
})
