import { render, waitFor } from '@testing-library/react-native'
import { rest } from 'msw'
import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { ValidateEmailRequest, ValidateEmailResponse } from 'api/gen'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import * as Auth from '../AuthContext'

import { SignupEmailValidation } from './SignupEmailValidation'

const mockDisplayInfosSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    displayInfosSnackBar: jest.fn((props: SnackBarHelperSettings) =>
      mockDisplayInfosSnackBar(props)
    ),
  }),
}))

const renderPage = () => render(reactQueryProviderHOC(<SignupEmailValidation />))

describe('SignupEmailValidation', () => {
  beforeAll(() => {
    useRoute.mockImplementation(() => ({
      params: {
        token: 'reerereskjlmkdlsf',
        expiration_timestamp: 45465546445,
      },
    }))
  })
  afterEach(() => navigate.mockRestore())

  it('should redirect to Home when the user is not "éligible"', async () => {
    server.use(
      // not eligible user call
      rest.post<ValidateEmailRequest, ValidateEmailResponse>(
        env.API_BASE_URL + '/native/v1/validate_email',
        (req, res, ctx) =>
          res.once(
            ctx.status(200),
            // @ts-ignore due to conflict between idCheckToken defined as string|undefined but expected null
            ctx.json({
              accessToken: 'access_token',
              idCheckToken: null,
              refreshToken: 'refresh_token',
            })
          )
      )
    )

    renderPage()
    const loginRoutine = jest.spyOn(Auth, 'loginRoutine')

    await waitFor(() => {
      expect(loginRoutine).toBeCalledTimes(1)
    })
    loginRoutine.mockRestore()
  })
  // TODO: uncomment this section https://passculture.atlassian.net/browse/PC-5139
  // it('should redirect to Home with a snackbar message on error', async () => {
  //   server.use(
  //     rest.post(env.API_BASE_URL + '/native/v1/validate_email', (req, res, ctx) =>
  //       res(ctx.status(400))
  //     )
  //   )

  //   renderPage()

  //   await waitForExpect(() => {
  //     expect(mockDisplayInfosSnackBar).toHaveBeenNthCalledWith(1, {
  //       message: "Ce lien de validation n'est plus valide",
  //     })
  //     expect(navigate).toBeCalledTimes(1)
  //   })
  // })
})
