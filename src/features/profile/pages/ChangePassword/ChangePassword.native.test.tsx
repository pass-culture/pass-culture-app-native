import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, userEvent, waitFor } from 'tests/utils'

import { ChangePassword } from './ChangePassword'

jest.mock('features/auth/context/AuthContext')
mockAuthContextWithUser(beneficiaryUser, { persist: true })

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

    const currentPasswordInput = screen.getByTestId('Mot de passe actuel')
    const passwordInput = screen.getByTestId('Nouveau mot de passe')
    const confirmationInput = screen.getByTestId('Confirmer le mot de passe')

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

    const passwordInput = screen.getByTestId('Nouveau mot de passe')
    const confirmationInput = screen.getByTestId('Confirmer le mot de passe')

    await act(async () => {
      fireEvent.changeText(passwordInput, '123456')
    })

    await act(async () => {
      fireEvent.changeText(confirmationInput, '123456--')
    })

    expect(
      screen.getByText('Les mots de passe ne concordent pas', { hidden: true })
    ).toBeOnTheScreen()
  })

  it('should display success snackbar and navigate to Profile when the password is updated', async () => {
    mockServer.postApi('/v1/change_password', {
      responseOptions: { data: {} },
    })

    renderChangePassword()

    const currentPasswordInput = screen.getByTestId('Mot de passe actuel')
    const passwordInput = screen.getByTestId('Nouveau mot de passe')
    const confirmationInput = screen.getByTestId('Confirmer le mot de passe')

    fireEvent.changeText(currentPasswordInput, 'user@Dfdf56Moi')
    await act(async () => {
      fireEvent.changeText(passwordInput, 'user@AZERTY123')
    })
    await act(async () => {
      fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    })

    await user.press(screen.getByTestId('Enregistrer les modifications'))

    expect(screen.getByTestId('snackbar-success')).toBeOnTheScreen()
    expect(screen.getByText('Ton mot de passe est modifié')).toBeOnTheScreen()
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

    const currentPasswordInput = screen.getByTestId('Mot de passe actuel')
    const passwordInput = screen.getByTestId('Nouveau mot de passe')
    const confirmationInput = screen.getByTestId('Confirmer le mot de passe')

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
      expect(screen.getByText('Mot de passe incorrect', { hidden: true })).toBeOnTheScreen()
    })
  })
})
