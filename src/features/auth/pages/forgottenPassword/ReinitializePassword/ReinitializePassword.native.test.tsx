import { rest } from 'msw'
import React from 'react'

import { useRoute, replace } from '__mocks__/@react-navigation/native'
import { AccountState } from 'api/gen'
import * as LoginRoutine from 'features/auth/helpers/useLoginRoutine'
import { navigateToHome } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import * as datesLib from 'libs/dates'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { act, fireEvent, render, screen } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { ReinitializePassword } from './ReinitializePassword'

jest.mock('features/navigation/helpers')

const ROUTE_PARAMS = {
  email: 'john@.example.com',
  token: 'reerereskjlmkdlsf',
  expiration_timestamp: 45465546445,
}

const mockShowSuccessSnackBar = jest.fn()
const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowSuccessSnackBar(props)),
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
}))

useRoute.mockReturnValue({ params: ROUTE_PARAMS })
const loginRoutine = jest.fn()
const mockLoginRoutine = jest.spyOn(LoginRoutine, 'useLoginRoutine')
mockLoginRoutine.mockImplementation(() => loginRoutine)

describe('ReinitializePassword Page', () => {
  it('should match snapshot', async () => {
    renderReinitializePassword()
    await act(async () => {})

    expect(screen).toMatchSnapshot()
  })

  it('should enable the submit button when passwords are equals and filled and password is correct', async () => {
    renderReinitializePassword()

    const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
    const confirmationInput = screen.getByPlaceholderText('Confirmer le mot de passe')
    await act(async () => {
      fireEvent.changeText(passwordInput, 'user@AZERTY123')
    })
    await act(async () => {
      fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    })

    const connectButton = screen.getByText('Se connecter')

    expect(connectButton).toBeEnabled()
  })

  it('should display the matching error when the passwords dont match', async () => {
    renderReinitializePassword()
    const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
    const confirmationInput = screen.getByPlaceholderText('Confirmer le mot de passe')
    await act(async () => {
      fireEvent.changeText(passwordInput, '123456')
    })
    await act(async () => {
      fireEvent.changeText(confirmationInput, '123456--')
    })

    const notMatchingErrorText = screen.queryByText('Les mots de passe ne concordent pas')

    expect(notMatchingErrorText).toBeTruthy()
  })

  it('should connect the user when password is reset', async () => {
    server.use(
      rest.post(env.API_BASE_URL + '/native/v1/reset_password', async (_, res, ctx) =>
        res.once(
          ctx.status(200),
          ctx.json({ accessToken: 'accessToken', refreshToken: 'refreshToken' })
        )
      )
    )

    renderReinitializePassword()
    const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
    const confirmationInput = screen.getByPlaceholderText('Confirmer le mot de passe')

    await act(async () => {
      fireEvent.changeText(passwordInput, 'user@AZERTY123')
    })
    await act(async () => {
      fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    })
    await act(async () => {
      fireEvent.press(screen.getByText('Se connecter'))
    })

    expect(loginRoutine).toHaveBeenCalledWith(
      {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        accountState: AccountState.ACTIVE,
      },
      'fromReinitializePassword'
    )
  })

  it('should redirect to home page when password is reset', async () => {
    renderReinitializePassword()
    const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
    const confirmationInput = screen.getByPlaceholderText('Confirmer le mot de passe')
    await act(async () => {
      fireEvent.changeText(passwordInput, 'user@AZERTY123')
    })
    await act(async () => {
      fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    })
    await act(async () => {
      fireEvent.press(screen.getByText('Se connecter'))
    })

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })

  it('should log analytics WHEN password is reset', async () => {
    renderReinitializePassword()
    const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
    const confirmationInput = screen.getByPlaceholderText('Confirmer le mot de passe')
    await act(async () => {
      fireEvent.changeText(passwordInput, 'user@AZERTY123')
    })
    await act(async () => {
      fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    })
    await act(async () => {
      fireEvent.press(screen.getByText('Se connecter'))
    })

    expect(analytics.logHasChangedPassword).toBeCalledWith('resetPassword')
  })

  it('should show success snack bar WHEN password is reset', async () => {
    renderReinitializePassword()
    const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
    const confirmationInput = screen.getByPlaceholderText('Confirmer le mot de passe')
    await act(async () => {
      fireEvent.changeText(passwordInput, 'user@AZERTY123')
    })
    await act(async () => {
      fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    })
    await act(async () => {
      fireEvent.press(screen.getByText('Se connecter'))
    })

    expect(mockShowSuccessSnackBar).toBeCalledWith({
      message: 'Ton mot de passe est modifié\u00a0!',
      timeout: SNACK_BAR_TIME_OUT,
    })
  })

  it('should show error snack bar WHEN error', async () => {
    simulateResetPasswordError()
    renderReinitializePassword()
    const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
    const confirmationInput = screen.getByPlaceholderText('Confirmer le mot de passe')
    await act(async () => {
      fireEvent.changeText(passwordInput, 'user@AZERTY123')
    })
    await act(async () => {
      fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    })
    await act(async () => {
      fireEvent.press(screen.getByText('Se connecter'))
    })

    expect(mockShowErrorSnackBar).toBeCalledWith({
      message: 'Une erreur s’est produite pendant la modification de ton mot de passe.',
      timeout: SNACK_BAR_TIME_OUT,
    })
  })

  it('should redirect to ResetPasswordExpiredLink when expiration_timestamp is expired', async () => {
    // eslint-disable-next-line local-rules/independent-mocks
    jest.spyOn(datesLib, 'isTimestampExpired').mockImplementation(() => true)
    renderReinitializePassword()
    await act(async () => {})

    expect(replace).toHaveBeenNthCalledWith(1, 'ResetPasswordExpiredLink', {
      email: ROUTE_PARAMS.email,
    })
  })
})

function renderReinitializePassword() {
  return render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(<ReinitializePassword />)
  )
}

function simulateResetPasswordError() {
  server.use(
    rest.post(env.API_BASE_URL + '/native/v1/reset_password', async (_, res, ctx) =>
      res.once(ctx.status(400))
    )
  )
}
