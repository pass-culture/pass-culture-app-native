import { rest } from 'msw'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { ChangePasswordRequest } from 'api/gen'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { EmptyResponse } from 'libs/fetch'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { render, fireEvent, act } from 'tests/utils'
import { showSuccessSnackBar } from 'ui/components/snackBar/__mocks__/SnackBarContext'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

import { ChangePassword } from './ChangePassword'

const mockedUseSnackBarContext = useSnackBarContext as jest.Mock

const mockshowSuccessSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: jest.fn(() => ({
    showSuccessSnackBar: mockshowSuccessSnackBar,
  })),
}))

function renderChangePassword() {
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  const wrapper = render(reactQueryProviderHOC(<ChangePassword />))
  return wrapper
}

describe('ChangePassword', () => {
  it('should enable the submit button when passwords are equals and filled and current password is correct', async () => {
    const { getByPlaceholderText, getByTestId } = renderChangePassword()

    const currentPasswordInput = getByPlaceholderText('Ton mot de passe actuel')
    const passwordInput = getByPlaceholderText('Ton nouveau mot de passe')
    const confirmationInput = getByPlaceholderText('Confirmer le mot de passe')

    fireEvent.changeText(currentPasswordInput, 'user@Dfdf56Moi')
    await act(async () => {
      fireEvent.changeText(passwordInput, 'user@AZERTY123')
    })
    await act(async () => {
      fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    })

    const continueButton = getByTestId('Enregistrer les modifications')
    expect(continueButton).toBeEnabled()
  })

  it('should display the matching error when the passwords dont match', async () => {
    const { getByPlaceholderText, queryByText } = renderChangePassword()

    const passwordInput = getByPlaceholderText('Ton nouveau mot de passe')
    const confirmationInput = getByPlaceholderText('Confirmer le mot de passe')

    await act(async () => {
      fireEvent.changeText(passwordInput, '123456')
    })

    await act(async () => {
      fireEvent.changeText(confirmationInput, '123456--')
    })

    expect(queryByText('Les mots de passe ne concordent pas')).toBeTruthy()
  })

  it('should display success snackbar and navigate to Profile when the password is updated', async () => {
    server.use(
      rest.post<ChangePasswordRequest, EmptyResponse>(
        env.API_BASE_URL + '/native/v1/change_password',
        (_req, res, ctx) => res.once(ctx.status(200), ctx.json({}))
      )
    )
    mockedUseSnackBarContext.mockImplementationOnce(() => ({
      showSuccessSnackBar,
    }))
    const { getByPlaceholderText, getByTestId } = renderChangePassword()

    const currentPasswordInput = getByPlaceholderText('Ton mot de passe actuel')
    const passwordInput = getByPlaceholderText('Ton nouveau mot de passe')
    const confirmationInput = getByPlaceholderText('Confirmer le mot de passe')

    fireEvent.changeText(currentPasswordInput, 'user@Dfdf56Moi')
    await act(async () => {
      fireEvent.changeText(passwordInput, 'user@AZERTY123')
    })
    await act(async () => {
      fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    })

    await act(async () => {
      fireEvent.press(getByTestId('Enregistrer les modifications'))
    })
    expect(mockshowSuccessSnackBar).toHaveBeenCalledWith({
      message: 'Ton mot de passe est modifié',
      timeout: SNACK_BAR_TIME_OUT,
    })
    expect(navigate).toHaveBeenCalledWith('TabNavigator', { screen: 'Profile' })
    expect(analytics.logHasChangedPassword).toHaveBeenCalledWith('changePassword')
  })

  it('display error when the password failed to updated', async () => {
    server.use(
      rest.post<ChangePasswordRequest, EmptyResponse>(
        env.API_BASE_URL + '/native/v1/change_password',
        (_req, res, ctx) => res.once(ctx.status(400), ctx.json({}))
      )
    )
    const { getByPlaceholderText, getByTestId, getByText } = renderChangePassword()

    const currentPasswordInput = getByPlaceholderText('Ton mot de passe actuel')
    const passwordInput = getByPlaceholderText('Ton nouveau mot de passe')
    const confirmationInput = getByPlaceholderText('Confirmer le mot de passe')

    fireEvent.changeText(currentPasswordInput, 'user@Dfdf56Moi')
    await act(async () => {
      fireEvent.changeText(passwordInput, 'user@AZERTY123')
    })
    await act(async () => {
      fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    })

    const continueButton = getByTestId('Enregistrer les modifications')
    await act(async () => {
      fireEvent.press(continueButton)
    })
    expect(getByText('Mot de passe incorrect')).toBeTruthy()
  })
})
