import React from 'react'

import { replace, useRoute } from '__mocks__/@react-navigation/native'
import { ChangeEmailSetPassword } from 'features/profile/pages/ChangeEmailSetPassword/ChangeEmailSetPassword'
import { EmptyResponse } from 'libs/fetch'
import { eventMonitoring } from 'libs/monitoring/services'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, userEvent } from 'tests/utils'
import * as SnackBarContextModule from 'ui/components/snackBar/SnackBarContext'

const mockShowSuccessSnackBar = jest.fn()
const mockShowErrorSnackBar = jest.fn()
jest.spyOn(SnackBarContextModule, 'useSnackBarContext').mockReturnValue({
  showSuccessSnackBar: mockShowSuccessSnackBar,
  showErrorSnackBar: mockShowErrorSnackBar,
  showInfoSnackBar: jest.fn(),
  hideSnackBar: jest.fn(),
})

useRoute.mockReturnValue({
  params: { token: 'reset_password_token', emailSelectionToken: 'email_selection_token' },
})

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()

jest.useFakeTimers()

describe('<ChangeEmailSetPassword />', () => {
  it('should match snapshot', async () => {
    render(reactQueryProviderHOC(<ChangeEmailSetPassword />))

    await screen.findByLabelText('Créer mon mot de passe')

    expect(screen).toMatchSnapshot()
  })

  it('should enable the submit button when inputs are valid', async () => {
    render(reactQueryProviderHOC(<ChangeEmailSetPassword />))

    const passwordInput = screen.getByTestId('Mot de passe')
    const confirmationInput = screen.getByTestId('Confirmer le mot de passe')

    fireEvent.changeText(passwordInput, 'user@AZERTY123')
    fireEvent.changeText(confirmationInput, 'user@AZERTY123')

    expect(await screen.findByLabelText('Créer mon mot de passe')).toBeEnabled()
  })

  it('should disable the submit button when password is not strong enough', async () => {
    render(reactQueryProviderHOC(<ChangeEmailSetPassword />))

    const passwordInput = screen.getByTestId('Mot de passe')
    const confirmationInput = screen.getByTestId('Confirmer le mot de passe')

    fireEvent.changeText(passwordInput, 'user@AZERTY')
    fireEvent.changeText(confirmationInput, 'user@AZERTY')

    expect(await screen.findByLabelText('Créer mon mot de passe')).toBeDisabled()
  })

  it("should disable the submit button when the passwords don't match", async () => {
    render(reactQueryProviderHOC(<ChangeEmailSetPassword />))

    const passwordInput = screen.getByTestId('Mot de passe')
    const confirmationInput = screen.getByTestId('Confirmer le mot de passe')

    fireEvent.changeText(passwordInput, 'user@AZERTY123')
    fireEvent.changeText(confirmationInput, 'user@AZERTY321')

    expect(await screen.findByLabelText('Créer mon mot de passe')).toBeDisabled()
  })

  it("should display error when the passwords don't match", async () => {
    render(reactQueryProviderHOC(<ChangeEmailSetPassword />))

    const passwordInput = screen.getByTestId('Mot de passe')
    const confirmationInput = screen.getByTestId('Confirmer le mot de passe')

    fireEvent.changeText(passwordInput, 'user@AZERTY123')
    fireEvent.changeText(confirmationInput, 'user@AZERTY321')

    expect(await screen.findByText('Les mots de passe ne concordent pas')).toBeOnTheScreen()
  })

  it('should navigate to email selection step on password creation success', async () => {
    mockServer.postApi<EmptyResponse>('/v2/profile/email_update/new_password', {
      responseOptions: {
        statusCode: 204,
      },
    })
    render(reactQueryProviderHOC(<ChangeEmailSetPassword />))

    const passwordInput = screen.getByTestId('Mot de passe')
    const confirmationInput = screen.getByTestId('Confirmer le mot de passe')
    await act(async () => {
      fireEvent.changeText(passwordInput, 'user@AZERTY123')
      fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    })

    await user.press(screen.getByLabelText('Créer mon mot de passe'))

    expect(replace).toHaveBeenCalledWith('ProfileStackNavigator', {
      params: {
        token: 'email_selection_token',
      },
      screen: 'NewEmailSelection',
    })
  })

  it('should show success snackbar on password creation success', async () => {
    mockServer.postApi<EmptyResponse>('/v2/profile/email_update/new_password', {
      responseOptions: {
        statusCode: 204,
        data: {},
      },
    })
    render(reactQueryProviderHOC(<ChangeEmailSetPassword />))

    const passwordInput = screen.getByTestId('Mot de passe')
    const confirmationInput = screen.getByTestId('Confirmer le mot de passe')

    await act(async () => {
      fireEvent.changeText(passwordInput, 'user@AZERTY123')
      fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    })

    await user.press(screen.getByLabelText('Créer mon mot de passe'))

    expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
      message: 'Ton mot de passe a bien été créé.',
      timeout: SnackBarContextModule.SNACK_BAR_TIME_OUT,
    })
  })

  it('should log to sentry if the token is undefined', async () => {
    const routeWithUndefinedToken = {
      params: { token: undefined, emailSelectionToken: undefined },
    }
    useRoute.mockReturnValueOnce(routeWithUndefinedToken)
    useRoute.mockReturnValueOnce(routeWithUndefinedToken) // There is probably a second render

    mockServer.postApi<EmptyResponse>('/v2/profile/email_update/new_password', {
      responseOptions: {
        statusCode: 204,
        data: {},
      },
    })
    render(reactQueryProviderHOC(<ChangeEmailSetPassword />))

    const passwordInput = screen.getByTestId('Mot de passe')
    const confirmationInput = screen.getByTestId('Confirmer le mot de passe')

    await act(async () => {
      fireEvent.changeText(passwordInput, 'user@AZERTY123')
      fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    })

    await user.press(screen.getByLabelText('Créer mon mot de passe'))

    expect(mockShowSuccessSnackBar).not.toHaveBeenCalledWith({
      message: 'Ton mot de passe a bien été créé.',
      timeout: SnackBarContextModule.SNACK_BAR_TIME_OUT,
    })
    expect(eventMonitoring.captureException).toHaveBeenCalledWith(
      new Error('Expected a string, but received undefined')
    )
  })

  it('should show error snackbar on password creation failure', async () => {
    mockServer.postApi<EmptyResponse>('/v2/profile/email_update/new_password', {
      responseOptions: {
        statusCode: 400,
      },
    })
    render(reactQueryProviderHOC(<ChangeEmailSetPassword />))

    const passwordInput = screen.getByTestId('Mot de passe')
    const confirmationInput = screen.getByTestId('Confirmer le mot de passe')

    await act(async () => {
      fireEvent.changeText(passwordInput, 'user@AZERTY123')
      fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    })

    await user.press(screen.getByLabelText('Créer mon mot de passe'))

    expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
      message: 'Une erreur s’est produite lors de la création du mot de passe. Réessaie plus tard.',
      timeout: SnackBarContextModule.SNACK_BAR_TIME_OUT,
    })
  })
})
