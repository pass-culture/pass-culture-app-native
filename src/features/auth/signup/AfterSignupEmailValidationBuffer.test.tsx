import { render, waitFor } from '@testing-library/react-native'
import { rest } from 'msw'
import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { ValidateEmailRequest, ValidateEmailResponse } from 'api/gen'
import * as datesLib from 'libs/dates'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { loginRoutine } from '../__mocks__/AuthContext'
import * as Auth from '../AuthContext'

import { AfterSignupEmailValidationBuffer } from './AfterSignupEmailValidationBuffer'

jest.mock('features/auth/AuthContext')
const mockLoginRoutine = Auth.useLoginRoutine as jest.Mock

const mockShowInfoSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showInfoSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowInfoSnackBar(props)),
  }),
}))

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
    mockShowInfoSnackBar.mockClear()
  })

  describe('when timestamp is NOT expired', () => {
    it('should redirect to Home when the user is not "éligible"', async () => {
      jest.spyOn(datesLib, 'isTimestampExpired').mockReturnValue(false)
      const response: ValidateEmailResponse = {
        accessToken: 'access_token',
        idCheckToken: (null as unknown) as undefined, // actual value returned is `null`, conflicting with the typing
        refreshToken: 'refresh_token',
      }
      server.use(
        // NOT eligible user call
        rest.post<ValidateEmailRequest, ValidateEmailResponse>(
          env.API_BASE_URL + '/native/v1/validate_email',
          (_req, res, ctx) => res.once(ctx.status(200), ctx.json(response))
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

    it('should redirect to Verify Eligibility when the user is "éligible"', async () => {
      jest.spyOn(datesLib, 'isTimestampExpired').mockReturnValue(false)
      const response: ValidateEmailResponse = {
        accessToken: 'access_token',
        idCheckToken: 'XxLicenceTokenxX',
        refreshToken: 'refresh_token',
      }
      // eligible user call
      server.use(
        rest.post<ValidateEmailRequest, ValidateEmailResponse>(
          env.API_BASE_URL + '/native/v1/validate_email',
          (_req, res, ctx) => res.once(ctx.status(200), ctx.json(response))
        )
      )

      mockLoginRoutine.mockImplementationOnce(() => loginRoutine)
      renderPage()

      await waitFor(() => {
        expect(loginRoutine).toBeCalledTimes(1)
        expect(navigate).toBeCalledTimes(1)
        expect(navigate).toHaveBeenCalledWith('VerifyEligibility', {
          email: 'john@wick.com',
          licenceToken: 'XxLicenceTokenxX',
        })
      })
      loginRoutine.mockRestore()
    })

    it('should redirect to Home with a snackbar message on error', async () => {
      // TODO(PC-6360): ignore warning displayed by react-query's useMutation onError callback.
      // Note : it appears next to impossible to hide this warnibg by acting on the console object alone.
      // The only solution probably lies in mocking partially or completely react-query.
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
        expect(navigate).toHaveBeenCalledWith('Home', { shouldDisplayLoginModal: false })
      })
    })
  })

  describe('when timestamp is expired', () => {
    it('should redirect to SignupConfirmationExpiredLink', async () => {
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
