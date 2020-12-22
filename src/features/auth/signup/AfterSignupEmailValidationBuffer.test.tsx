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

import * as Auth from '../AuthContext'

import { AfterSignupEmailValidationBuffer } from './AfterSignupEmailValidationBuffer'

const mockDisplayInfosSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    displayInfosSnackBar: jest.fn((props: SnackBarHelperSettings) =>
      mockDisplayInfosSnackBar(props)
    ),
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
    mockDisplayInfosSnackBar.mockClear()
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

      renderPage()
      const loginRoutine = jest.spyOn(Auth, 'loginRoutine')

      await waitFor(() => {
        expect(loginRoutine).toBeCalledTimes(1)
        expect(mockDisplayInfosSnackBar).toHaveBeenCalledTimes(1)
        expect(mockDisplayInfosSnackBar).toHaveBeenCalledWith({
          message: 'Ton compte est maintenant activé !',
        })
        expect(navigate).toBeCalledTimes(1)
        expect(navigate).toHaveBeenCalledWith('Home', { shouldDisplayLoginModal: false })
      })
      loginRoutine.mockRestore()
    })

    it('should open Id-Check app when the user is "éligible"', async () => {
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

      renderPage()
      const loginRoutine = jest.spyOn(Auth, 'loginRoutine')

      await waitFor(() => {
        expect(loginRoutine).toBeCalledTimes(1)
        expect(navigate).toBeCalledTimes(1)
        expect(navigate).toHaveBeenCalledWith('IdCheck', {
          email: 'john@wick.com',
          licenceToken: 'XxLicenceTokenxX',
        })
      })
      loginRoutine.mockRestore()
    })

    it('should redirect to Home with a snackbar message on error', async () => {
      jest.spyOn(datesLib, 'isTimestampExpired').mockReturnValue(false)
      server.use(
        rest.post(env.API_BASE_URL + '/native/v1/validate_email', (_req, res, ctx) =>
          res(ctx.status(400))
        )
      )

      renderPage()

      await waitFor(() => {
        expect(mockDisplayInfosSnackBar).toHaveBeenCalledTimes(1)
        expect(mockDisplayInfosSnackBar).toHaveBeenCalledWith({
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
