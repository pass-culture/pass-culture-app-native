import React from 'react'

import { navigate, replace } from '__mocks__/@react-navigation/native'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { captureMonitoringError, eventMonitoring } from 'libs/monitoring'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { NetworkErrorFixture, UnknownErrorFixture } from 'libs/recaptcha/fixtures'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { simulateWebviewMessage, fireEvent, render, waitFor, screen, act } from 'tests/utils'
import * as emailCheck from 'ui/components/inputs/emailCheck'
import { SUGGESTION_DELAY_IN_MS } from 'ui/components/inputs/EmailInputWithSpellingHelp/useEmailSpellingHelp'

import { ForgottenPassword } from './ForgottenPassword'

jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/auth/context/SettingsContext')
jest.mock('libs/monitoring')
jest.useFakeTimers()

const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

beforeEach(() => {
  simulateConnectedNetwork()
  mockServer.postApi('/v1/request_password_reset', {
    responseOptions: { statusCode: 204, data: {} },
  })
})

describe('<ForgottenPassword />', () => {
  it('should match snapshot', () => {
    renderForgottenPassword()

    expect(screen).toMatchSnapshot()
  })

  it('should enable validate button when email input is filled', async () => {
    renderForgottenPassword()

    const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')

    await waitFor(() => {
      const validateButton = screen.getByText('Valider')

      expect(validateButton).toBeEnabled()
    })
  })

  it('should show email suggestion', async () => {
    renderForgottenPassword()
    const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmal.com')

    await act(async () => {
      jest.advanceTimersByTime(SUGGESTION_DELAY_IN_MS)
    })

    expect(screen.getByText('Veux-tu plutôt dire john.doe@gmail.com\u00a0?')).toBeOnTheScreen()
  })

  it('should redirect to Login when clicking on ArrowPrevious icon', async () => {
    renderForgottenPassword()

    const leftIcon = screen.getByTestId('Revenir en arrière')
    fireEvent.press(leftIcon)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('Login', { from: StepperOrigin.FORGOTTEN_PASSWORD })
    })
  })

  it("should NOT open reCAPTCHA challenge's modal when there is no network", () => {
    simulateNoNetwork()
    renderForgottenPassword()
    const recaptchaWebviewModal = screen.getByTestId('recaptcha-webview-modal')

    expect(recaptchaWebviewModal.props.visible).toBeFalsy()

    const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    fireEvent.press(screen.getByText('Valider'))

    expect(recaptchaWebviewModal.props.visible).toBeFalsy()
    expect(screen.getByText('Hors connexion : en attente du réseau.')).toBeOnTheScreen()
    expect(screen.queryByTestId('Chargement en cours')).not.toBeOnTheScreen()
  })

  it("should open reCAPTCHA challenge's modal when pressing on validate button", () => {
    renderForgottenPassword()
    const recaptchaWebviewModal = screen.getByTestId('recaptcha-webview-modal')

    expect(recaptchaWebviewModal.props.visible).toBeFalsy()

    const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    fireEvent.press(screen.getByText('Valider'))

    expect(recaptchaWebviewModal.props.visible).toBe(true)
  })

  it('should redirect to ResetPasswordEmailSent when password reset request is successful', async () => {
    renderForgottenPassword()

    const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    fireEvent.press(screen.getByText('Valider'))
    const recaptchaWebview = screen.getByTestId('recaptcha-webview')
    simulateWebviewMessage(recaptchaWebview, '{ "message": "success", "token": "fakeToken" }')

    await waitFor(() => {
      expect(replace).toHaveBeenCalledTimes(1)
      expect(replace).toHaveBeenCalledWith('ResetPasswordEmailSent', {
        email: 'john.doe@gmail.com',
      })
      expect(screen.queryByTestId('Chargement en cours')).not.toBeOnTheScreen()
    })
  })

  it('should log to Sentry on reCAPTCHA failure', async () => {
    renderForgottenPassword()

    const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    fireEvent.press(screen.getByText('Valider'))
    const recaptchaWebview = screen.getByTestId('recaptcha-webview')
    simulateWebviewMessage(recaptchaWebview, UnknownErrorFixture)

    expect(captureMonitoringError).toHaveBeenCalledWith(
      'UnknownError someError',
      'ForgottenPasswordOnRecaptchaError'
    )
  })

  it('should not log to Sentry on reCAPTCHA network error', async () => {
    renderForgottenPassword()

    const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    fireEvent.press(screen.getByText('Valider'))
    const recaptchaWebview = screen.getByTestId('recaptcha-webview')
    simulateWebviewMessage(recaptchaWebview, NetworkErrorFixture)

    expect(captureMonitoringError).not.toHaveBeenCalled()
  })

  it('should notifies user on reCAPTCHA network error', async () => {
    renderForgottenPassword()

    const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    fireEvent.press(screen.getByText('Valider'))
    const recaptchaWebview = screen.getByTestId('recaptcha-webview')
    simulateWebviewMessage(recaptchaWebview, NetworkErrorFixture)

    expect(
      screen.getByText(
        'Un problème est survenu pendant la réinitialisation, vérifie ta connexion internet et réessaie plus tard.'
      )
    ).toBeOnTheScreen()
  })

  it('should NOT redirect to ResetPasswordEmailSent when reCAPTCHA challenge has failed', async () => {
    renderForgottenPassword()

    const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    fireEvent.press(screen.getByText('Valider'))
    const recaptchaWebview = screen.getByTestId('recaptcha-webview')
    await simulateWebviewMessage(recaptchaWebview, UnknownErrorFixture)

    expect(
      screen.getByText('Un problème est survenu pendant la réinitialisation, réessaie plus tard.')
    ).toBeOnTheScreen()
    expect(navigate).not.toHaveBeenCalled()
    expect(screen.queryByTestId('Chargement en cours')).not.toBeOnTheScreen()
  })

  it('should NOT redirect to ResetPasswordEmailSent when reset password request API call has failed', async () => {
    mockServer.postApi('/v1/request_password_reset', {
      responseOptions: { statusCode: 400, data: {} },
    })
    renderForgottenPassword()

    const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    fireEvent.press(screen.getByText('Valider'))
    const recaptchaWebview = screen.getByTestId('recaptcha-webview')
    simulateWebviewMessage(recaptchaWebview, '{ "message": "success", "token": "fakeToken" }')

    await waitFor(() => {
      expect(
        screen.getByText('Un problème est survenu pendant la réinitialisation, réessaie plus tard.')
      ).toBeOnTheScreen()
      expect(captureMonitoringError).toHaveBeenNthCalledWith(
        1,
        'Échec de la requête https://localhost/native/v1/request_password_reset, code: 400',
        'ForgottenPasswordRequestResetError'
      )
      expect(navigate).not.toHaveBeenCalled()
      expect(screen.queryByTestId('Chargement en cours')).not.toBeOnTheScreen()
    })
  })

  it.each([
    401, // Unauthorized
    500, // Internal Server Error
    502, // Bad Gateway
    503, // Service Unavailable
    504, // Gateway Timeout
  ])(
    'should capture an info in Sentry when reset password request API call has failed and error code is %s',
    async (statusCode) => {
      mockServer.postApi('/v1/request_password_reset', {
        responseOptions: { statusCode: statusCode, data: {} },
      })
      renderForgottenPassword()

      const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'john.doe@gmail.com')
      fireEvent.press(screen.getByText('Valider'))
      const recaptchaWebview = screen.getByTestId('recaptcha-webview')
      simulateWebviewMessage(recaptchaWebview, '{ "message": "success", "token": "fakeToken" }')

      await waitFor(() => {
        expect(eventMonitoring.captureException).toHaveBeenNthCalledWith(
          1,
          `Échec de la requête https://localhost/native/v1/request_password_reset, code: ${statusCode}`,
          { level: 'info' }
        )
      })
    }
  )

  it('should not capture an in Sentry when reset password request API call has failed and error code is 400', async () => {
    mockServer.postApi('/v1/request_password_reset', {
      responseOptions: { statusCode: 400, data: {} },
    })
    renderForgottenPassword()

    const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    fireEvent.press(screen.getByText('Valider'))
    const recaptchaWebview = screen.getByTestId('recaptcha-webview')
    simulateWebviewMessage(recaptchaWebview, '{ "message": "success", "token": "fakeToken" }')

    expect(eventMonitoring.captureException).not.toHaveBeenCalled()
  })

  describe('email format validation', () => {
    it('should NOT display invalid email format when email format is valid', () => {
      const isEmailValid = jest.spyOn(emailCheck, 'isEmailValid')

      renderForgottenPassword()

      const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'john.doe@gmail.com')

      const continueButton = screen.getByText('Valider')
      fireEvent.press(continueButton)

      expect(isEmailValid).toHaveReturnedWith(true)
      expect(
        screen.queryByText(
          'L’e-mail renseigné est incorrect. Exemple de format attendu : edith.piaf@email.fr'
        )
      ).not.toBeOnTheScreen()
    })

    it('should display invalid email format when email format is valid', () => {
      renderForgottenPassword()

      const emailInput = screen.getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'john.doe')

      const continueButton = screen.getByText('Valider')
      fireEvent.press(continueButton)

      expect(
        screen.getByText(
          'L’e-mail renseigné est incorrect. Exemple de format attendu : edith.piaf@email.fr'
        )
      ).toBeOnTheScreen()
    })
  })
})

function simulateNoNetwork() {
  mockUseNetInfoContext.mockReturnValue({
    isConnected: false,
    isInternetReachable: false,
  })
}

function simulateConnectedNetwork() {
  mockUseNetInfoContext.mockReturnValue({
    isConnected: true,
    isInternetReachable: true,
  })
}

function renderForgottenPassword() {
  return render(<ForgottenPassword />, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
