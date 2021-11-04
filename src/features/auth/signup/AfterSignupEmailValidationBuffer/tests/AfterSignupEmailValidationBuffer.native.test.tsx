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
    it('should redirect to AccountCreated when nextBeneficiaryValidationStep is null', async () => {
      mockLoginRoutine.mockImplementationOnce(() => loginRoutine)
      renderPage()

      await waitFor(() => {
        expect(loginRoutine).toBeCalledTimes(1)
        expect(navigate).toBeCalledTimes(1)
        expect(navigate).toHaveBeenCalledWith('AccountCreated')
      })
      loginRoutine.mockRestore()
    })

    it('should redirect to Verify Eligibility when nextBeneficiaryValidationStep is phone-validation or id-check', async () => {
      server.use(
        rest.get<UserProfileResponse>(env.API_BASE_URL + '/native/v1/me', (req, res, ctx) =>
          res.once(
            ctx.status(200),
            ctx.json({
              email: 'email@domain.ext',
              firstName: 'Jean',
              isBeneficiary: true,
              nextBeneficiaryValidationStep: 'phone-validation',
            })
          )
        )
      )
      mockLoginRoutine.mockImplementationOnce(() => loginRoutine)
      renderPage()

      await waitFor(() => {
        expect(loginRoutine).toBeCalledTimes(1)
        expect(navigate).toBeCalledTimes(1)
        expect(navigate).toHaveBeenCalledWith('VerifyEligibility', {
          nextBeneficiaryValidationStep: 'phone-validation',
        })
      })
      loginRoutine.mockRestore()
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
