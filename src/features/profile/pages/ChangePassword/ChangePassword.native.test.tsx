import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, userEvent, waitFor } from 'tests/utils'
import { showSuccessSnackBar } from 'ui/components/snackBar/__mocks__/SnackBarContext'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

import { ChangePassword } from './ChangePassword'

jest.mock('features/auth/context/AuthContext')
mockAuthContextWithUser(beneficiaryUser, { persist: true })

const mockedUseSnackBarContext = useSnackBarContext as jest.Mock

const mockShowSuccessSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: jest.fn(() => ({
    showSuccessSnackBar: mockShowSuccessSnackBar,
  })),
}))

jest.mock('libs/jwt/jwt')

function renderChangePassword() {
  render(reactQueryProviderHOC(<ChangePassword />))
}

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()

jest.useFakeTimers()

describe('ChangePassword', () => {
  it('should render correctly', async () => {
    renderChangePassword()

    await screen.findByText('Mot de passe')

    expect(screen).toMatchSnapshot()
  })

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
    mockAuthContextWithUser({
      ...beneficiaryUser,
      hasPassword: false,
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

    expect(screen.getByText('Les mots de passe ne concordent pas')).toBeOnTheScreen()
  })

  it('should display success snackbar and navigate to Profile when the password is updated', async () => {
    mockServer.postApi('/v1/change_password', {
      responseOptions: { data: {} },
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

    await user.press(screen.getByTestId('Enregistrer les modifications'))

    expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
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
    mockServer.postApi('/v1/change_password', {
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
    await user.press(continueButton)

    await waitFor(() => {
      expect(screen.getByText('Mot de passe incorrect')).toBeOnTheScreen()
    })
  })
})
