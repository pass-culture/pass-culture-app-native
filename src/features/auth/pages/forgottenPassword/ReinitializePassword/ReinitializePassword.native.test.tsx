import React from 'react'
import DeviceInfo from 'react-native-device-info'

import { replace, useRoute } from '__mocks__/@react-navigation/native'
import { api } from 'api/api'
import { AccountState } from 'api/gen'
import * as LoginRoutine from 'features/auth/helpers/useLoginRoutine'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { Referrals } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import * as datesLib from 'libs/dates'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, userEvent, waitFor } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { ReinitializePassword } from './ReinitializePassword'

jest.mock('libs/react-native-device-info/getDeviceId')
const ROUTE_PARAMS: {
  email: string
  token: string
  expiration_timestamp: number
  from?: Referrals
} = {
  email: 'john@.example.com',
  token: 'reerereskjlmkdlsf',
  expiration_timestamp: 45465546445,
  from: undefined,
}

jest.mock('features/navigation/helpers/navigateToHome')

const mockShowSuccessSnackBar = jest.fn()
const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowSuccessSnackBar(props)),
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
}))

const loginRoutine = jest.fn()
const mockLoginRoutine = jest.spyOn(LoginRoutine, 'useLoginRoutine')
mockLoginRoutine.mockImplementation(() => loginRoutine)

const apiReinitializePasswordSpy = jest.spyOn(api, 'postNativeV1ResetPassword')

jest.spyOn(DeviceInfo, 'getModel').mockReturnValue('iPhone 13')
jest.spyOn(DeviceInfo, 'getSystemName').mockReturnValue('iOS')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest.useFakeTimers()

const user = userEvent.setup()

describe('ReinitializePassword Page', () => {
  beforeEach(() => {
    useRoute.mockReturnValue({ params: ROUTE_PARAMS })
  })

  it('should match snapshot', async () => {
    renderReinitializePassword()

    await screen.findByText('Nouveau mot de passe')

    expect(screen).toMatchSnapshot()
  })

  it('should enable the submit button when inputs are valid', async () => {
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

  it('should display error when the passwords dont match', async () => {
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

    expect(notMatchingErrorText).toBeOnTheScreen()
  })

  it('should request password reinitialization on connect button', async () => {
    mockServer.postApi('/v1/reset_password', {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    })

    renderReinitializePassword()
    const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
    const confirmationInput = screen.getByPlaceholderText('Confirmer le mot de passe')
    await act(async () => {
      fireEvent.changeText(passwordInput, 'user@AZERTY123')
    })
    await act(async () => {
      fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    })

    await user.press(screen.getByText('Se connecter'))

    expect(apiReinitializePasswordSpy).toHaveBeenCalledWith({
      newPassword: 'user@AZERTY123',
      resetPasswordToken: ROUTE_PARAMS.token,
      deviceInfo: {
        deviceId: 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
        os: 'iOS',
        source: 'iPhone 13',
        resolution: '750x1334',
        screenZoomLevel: 2,
      },
    })
  })

  it('should connect the user when password is successfully reset', async () => {
    mockServer.postApi('/v1/reset_password', {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    })

    renderReinitializePassword()
    const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
    const confirmationInput = screen.getByPlaceholderText('Confirmer le mot de passe')

    await act(async () => {
      fireEvent.changeText(passwordInput, 'user@AZERTY123')
    })
    await act(async () => {
      fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    })
    await user.press(screen.getByText('Se connecter'))

    expect(loginRoutine).toHaveBeenCalledWith(
      {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        accountState: AccountState.ACTIVE,
      },
      'fromReinitializePassword'
    )
  })

  it('should redirect to home page when password is successfully reset', async () => {
    mockServer.postApi('/v1/reset_password', {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    })
    renderReinitializePassword()
    const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
    const confirmationInput = screen.getByPlaceholderText('Confirmer le mot de passe')
    await act(async () => {
      fireEvent.changeText(passwordInput, 'user@AZERTY123')
    })
    await act(async () => {
      fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    })
    await user.press(screen.getByText('Se connecter'))

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })

  it('should log analytics with default from value "forgottenpassword" when password is successfully reset', async () => {
    mockServer.postApi('/v1/reset_password', {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    })
    renderReinitializePassword()
    const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
    const confirmationInput = screen.getByPlaceholderText('Confirmer le mot de passe')
    await act(async () => {
      fireEvent.changeText(passwordInput, 'user@AZERTY123')
    })
    await act(async () => {
      fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    })
    await user.press(screen.getByText('Se connecter'))

    expect(analytics.logHasChangedPassword).toHaveBeenCalledWith({
      from: 'forgottenpassword',
      reason: 'resetPassword',
    })
  })

  it('should log analytics with from params value when password is successfully reset', async () => {
    ROUTE_PARAMS.from = 'accountsecurity'
    renderReinitializePassword()
    mockServer.postApi('/v1/reset_password', {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    })

    const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
    const confirmationInput = screen.getByPlaceholderText('Confirmer le mot de passe')
    await act(async () => {
      fireEvent.changeText(passwordInput, 'user@AZERTY123')
    })
    await act(async () => {
      fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    })
    await user.press(screen.getByText('Se connecter'))

    expect(analytics.logHasChangedPassword).toHaveBeenCalledWith({
      from: 'accountsecurity',
      reason: 'resetPassword',
    })
  })

  it('should show success snack bar when password is successfully reset', async () => {
    mockServer.postApi('/v1/reset_password', {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    })
    renderReinitializePassword()
    const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
    const confirmationInput = screen.getByPlaceholderText('Confirmer le mot de passe')
    await act(async () => {
      fireEvent.changeText(passwordInput, 'user@AZERTY123')
    })
    await act(async () => {
      fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    })
    await user.press(screen.getByText('Se connecter'))

    expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
      message: 'Ton mot de passe est modifié\u00a0!',
      timeout: SNACK_BAR_TIME_OUT,
    })
  })

  it('should show error snack bar when reinitialize password request fails', async () => {
    mockServer.postApi('/v1/reset_password', { responseOptions: { statusCode: 400 } })
    renderReinitializePassword()
    const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
    const confirmationInput = screen.getByPlaceholderText('Confirmer le mot de passe')
    await act(async () => {
      fireEvent.changeText(passwordInput, 'user@AZERTY123')
    })
    await act(async () => {
      fireEvent.changeText(confirmationInput, 'user@AZERTY123')
    })
    await user.press(screen.getByText('Se connecter'))

    expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
      message: 'Une erreur s’est produite pendant la modification de ton mot de passe.',
      timeout: SNACK_BAR_TIME_OUT,
    })
  })

  it('should redirect to ResetPasswordExpiredLink when expiration_timestamp is expired', async () => {
    // eslint-disable-next-line local-rules/independent-mocks
    jest.spyOn(datesLib, 'isTimestampExpired').mockImplementation(() => true)
    renderReinitializePassword()

    await waitFor(() =>
      expect(replace).toHaveBeenNthCalledWith(1, 'ResetPasswordExpiredLink', {
        email: ROUTE_PARAMS.email,
      })
    )
  })
})

function renderReinitializePassword() {
  return render(reactQueryProviderHOC(<ReinitializePassword />))
}
