import React from 'react'
import DeviceInfo from 'react-native-device-info'

import { useRoute, replace } from '__mocks__/@react-navigation/native'
import { api } from 'api/api'
import { AccountState } from 'api/gen'
import * as LoginRoutine from 'features/auth/helpers/useLoginRoutine'
import { navigateToHome } from 'features/navigation/helpers'
import { Referrals } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import * as datesLib from 'libs/dates'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { ReinitializePassword } from './ReinitializePassword'

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

jest.mock('features/navigation/helpers')

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

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)
jest.spyOn(DeviceInfo, 'getModel').mockReturnValue('iPhone 13')
jest.spyOn(DeviceInfo, 'getSystemName').mockReturnValue('iOS')

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

    expect(apiReinitializePasswordSpy).toHaveBeenCalledWith({
      newPassword: 'user@AZERTY123',
      resetPasswordToken: ROUTE_PARAMS.token,
      deviceInfo: undefined,
    })
  })

  it('should send device info if trusted device feature flag is activated', async () => {
    // Due to multiple renders we need to mock the feature flag many times
    // eslint-disable-next-line local-rules/independent-mocks
    useFeatureFlagSpy.mockReturnValue(true)

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

    expect(apiReinitializePasswordSpy).toHaveBeenCalledWith({
      newPassword: 'user@AZERTY123',
      resetPasswordToken: ROUTE_PARAMS.token,
      deviceInfo: {
        deviceId: 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
        os: 'iOS',
        source: 'iPhone 13',
      },
    })

    // eslint-disable-next-line local-rules/independent-mocks
    useFeatureFlagSpy.mockReturnValue(false)
  })

  it('should connect the user when password is successfully reset', async () => {
    mockServer.postAPIV1('/native/v1/reset_password', {
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

  it('should redirect to home page when password is successfully reset', async () => {
    mockServer.postAPIV1('/native/v1/reset_password', {
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
    await act(async () => {
      fireEvent.press(screen.getByText('Se connecter'))
    })

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })

  it('should log analytics with default from value "forgottenpassword" when password is successfully reset', async () => {
    mockServer.postAPIV1('/native/v1/reset_password', {
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
    await act(async () => {
      fireEvent.press(screen.getByText('Se connecter'))
    })

    expect(analytics.logHasChangedPassword).toBeCalledWith({
      from: 'forgottenpassword',
      reason: 'resetPassword',
    })
  })

  it('should log analytics with from params value when password is successfully reset', async () => {
    ROUTE_PARAMS.from = 'accountsecurity'
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

    expect(analytics.logHasChangedPassword).toBeCalledWith({
      from: 'accountsecurity',
      reason: 'resetPassword',
    })
  })

  it('should show success snack bar when password is successfully reset', async () => {
    mockServer.postAPIV1('/native/v1/reset_password', {
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
    await act(async () => {
      fireEvent.press(screen.getByText('Se connecter'))
    })

    expect(mockShowSuccessSnackBar).toBeCalledWith({
      message: 'Ton mot de passe est modifié\u00a0!',
      timeout: SNACK_BAR_TIME_OUT,
    })
  })

  it('should show error snack bar when reinitialize password request fails', async () => {
    mockServer.postAPIV1('/native/v1/reset_password', { responseOptions: { statusCode: 400 } })
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
