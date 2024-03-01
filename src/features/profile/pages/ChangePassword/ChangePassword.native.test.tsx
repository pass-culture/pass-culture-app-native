import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, fireEvent, act, screen, waitFor } from 'tests/utils'
import { showSuccessSnackBar } from 'ui/components/snackBar/__mocks__/SnackBarContext'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

import { ChangePassword } from './ChangePassword'

const mockedUseSnackBarContext = useSnackBarContext as jest.Mock

const baseAuthContext = {
  isLoggedIn: true,
  setIsLoggedIn: jest.fn(),
  user: beneficiaryUser,
  refetchUser: jest.fn(),
  isUserLoading: false,
}
jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>
mockUseAuthContext.mockReturnValue(baseAuthContext)

const mockshowSuccessSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: jest.fn(() => ({
    showSuccessSnackBar: mockshowSuccessSnackBar,
  })),
}))

function renderChangePassword() {
  render(reactQueryProviderHOC(<ChangePassword />))
}

describe('ChangePassword', () => {
  it('should enable the submit button when passwords are equals and filled and current password is correct', async () => {
    renderChangePassword()

    const currentPasswordInput = screen.getByPlaceholderText('Ton mot de passe actuel')
    const passwordInput = screen.getByPlaceholderText('Ton nouveau mot de passe')
    const confirmationInput = screen.getByPlaceholderText('Confirmer le mot de passe')

    fireEvent.changeText(currentPasswordInput, 'user@Dfdf56Moi')
    await act(async () => {
      fireEvent.changeText(passwordInput, 'user@AZERTY123')
    })
    await act(async () => {
      fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    })

    const continueButton = screen.getByTestId('Enregistrer les modifications')

    expect(continueButton).toBeEnabled()
  })

  it('should redirect to Home if user has no password', async () => {
    mockUseAuthContext.mockReturnValueOnce({
      ...baseAuthContext,
      user: {
        ...beneficiaryUser,
        hasPassword: false,
      },
    })
    render(reactQueryProviderHOC(<ChangePassword />))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('TabNavigator', { screen: 'Home' })
    })
  })

  it('should display the matching error when the passwords dont match', async () => {
    renderChangePassword()

    const passwordInput = screen.getByPlaceholderText('Ton nouveau mot de passe')
    const confirmationInput = screen.getByPlaceholderText('Confirmer le mot de passe')

    await act(async () => {
      fireEvent.changeText(passwordInput, '123456')
    })

    await act(async () => {
      fireEvent.changeText(confirmationInput, '123456--')
    })

    expect(screen.queryByText('Les mots de passe ne concordent pas')).toBeOnTheScreen()
  })

  it('should display success snackbar and navigate to Profile when the password is updated', async () => {
    mockServer.postApiV1('/change_password', {
      responseOptions: { data: {} },
      requestOptions: { persist: true },
    })
    mockedUseSnackBarContext.mockImplementationOnce(() => ({
      showSuccessSnackBar,
    }))
    renderChangePassword()

    const currentPasswordInput = screen.getByPlaceholderText('Ton mot de passe actuel')
    const passwordInput = screen.getByPlaceholderText('Ton nouveau mot de passe')
    const confirmationInput = screen.getByPlaceholderText('Confirmer le mot de passe')

    fireEvent.changeText(currentPasswordInput, 'user@Dfdf56Moi')
    await act(async () => {
      fireEvent.changeText(passwordInput, 'user@AZERTY123')
    })
    await act(async () => {
      fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    })

    await act(async () => {
      fireEvent.press(screen.getByTestId('Enregistrer les modifications'))
    })

    expect(mockshowSuccessSnackBar).toHaveBeenCalledWith({
      message: 'Ton mot de passe est modifié',
      timeout: SNACK_BAR_TIME_OUT,
    })
    expect(navigate).toHaveBeenCalledWith('TabNavigator', { screen: 'Profile' })
    expect(analytics.logHasChangedPassword).toHaveBeenCalledWith({
      from: 'personaldata',
      reason: 'changePassword',
    })
  })

  it('display error when the password failed to updated', async () => {
    mockServer.postApiV1('/change_password', {
      responseOptions: { statusCode: 400, data: {} },
      requestOptions: { persist: true },
    })
    renderChangePassword()

    const currentPasswordInput = screen.getByPlaceholderText('Ton mot de passe actuel')
    const passwordInput = screen.getByPlaceholderText('Ton nouveau mot de passe')
    const confirmationInput = screen.getByPlaceholderText('Confirmer le mot de passe')

    fireEvent.changeText(currentPasswordInput, 'user@Dfdf56Moi')
    await act(async () => {
      fireEvent.changeText(passwordInput, 'user@AZERTY123')
    })
    await act(async () => {
      fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    })

    const continueButton = screen.getByTestId('Enregistrer les modifications')
    await act(async () => {
      fireEvent.press(continueButton)
    })

    expect(screen.getByText('Mot de passe incorrect')).toBeOnTheScreen()
  })
})
