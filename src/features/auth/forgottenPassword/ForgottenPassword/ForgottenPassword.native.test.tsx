import React from 'react'

import { navigate, replace } from '__mocks__/@react-navigation/native'
import { ForgottenPassword } from 'features/auth/forgottenPassword/ForgottenPassword/ForgottenPassword'
import { captureMonitoringError } from 'libs/monitoring'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { requestPasswordResetFail, requestPasswordResetSuccess, server } from 'tests/server'
import { simulateWebviewMessage, fireEvent, render, waitFor } from 'tests/utils'
import * as emailCheck from 'ui/components/inputs/emailCheck'

jest.mock('features/navigation/helpers')

jest.mock('features/auth/settings')

jest.mock('libs/monitoring')

const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

beforeEach(() => {
  simulateConnectedNetwork()
  server.use(requestPasswordResetSuccess())
})

describe('<ForgottenPassword />', () => {
  it('should enable validate button when email input is filled', async () => {
    const { getByPlaceholderText, getByText } = renderForgottenPassword()

    const emailInput = getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')

    await waitFor(() => {
      const validateButton = getByText('Valider')
      expect(validateButton).toBeEnabled()
    })
  })

  it('should redirect to Login when clicking on ArrowPrevious icon', async () => {
    const { getByTestId } = renderForgottenPassword()

    const leftIcon = getByTestId('leftIcon')
    fireEvent.press(leftIcon)

    await waitFor(() => {
      expect(navigate).toBeCalledWith('Login')
    })
  })

  it("should NOT open reCAPTCHA challenge's modal when there is no network", () => {
    simulateNoNetwork()
    const renderAPI = renderForgottenPassword()
    const recaptchaWebviewModal = renderAPI.getByTestId('recaptcha-webview-modal')

    expect(recaptchaWebviewModal.props.visible).toBeFalsy()

    const emailInput = renderAPI.getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    fireEvent.press(renderAPI.getByText('Valider'))

    expect(recaptchaWebviewModal.props.visible).toBeFalsy()
    expect(renderAPI.queryByText('Hors connexion : en attente du réseau.')).toBeTruthy()
    expect(renderAPI.queryByTestId('button-isloading-icon')).toBeNull()
  })

  it("should open reCAPTCHA challenge's modal when pressing on validate button", () => {
    const renderAPI = renderForgottenPassword()
    const recaptchaWebviewModal = renderAPI.getByTestId('recaptcha-webview-modal')

    expect(recaptchaWebviewModal.props.visible).toBeFalsy()

    const emailInput = renderAPI.getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    fireEvent.press(renderAPI.getByText('Valider'))

    expect(recaptchaWebviewModal.props.visible).toBeTruthy()
  })

  it('should redirect to ResetPasswordEmailSent when password reset request is successful', async () => {
    const renderAPI = renderForgottenPassword()

    const emailInput = renderAPI.getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    fireEvent.press(renderAPI.getByText('Valider'))
    const recaptchaWebview = renderAPI.getByTestId('recaptcha-webview')
    simulateWebviewMessage(recaptchaWebview, '{ "message": "success", "token": "fakeToken" }')

    await waitFor(() => {
      expect(replace).toBeCalledTimes(1)
      expect(replace).toHaveBeenCalledWith('ResetPasswordEmailSent', {
        email: 'john.doe@gmail.com',
      })
      expect(renderAPI.queryByTestId('button-isloading-icon')).toBeNull()
    })
  })

  it('should NOT redirect to ResetPasswordEmailSent when reCAPTCHA challenge has failed', async () => {
    const renderAPI = renderForgottenPassword()

    const emailInput = renderAPI.getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    fireEvent.press(renderAPI.getByText('Valider'))
    const recaptchaWebview = renderAPI.getByTestId('recaptcha-webview')
    simulateWebviewMessage(recaptchaWebview, '{ "message": "error", "error": "someError" }')

    await waitFor(() => {
      expect(
        renderAPI.queryByText(
          'Un problème est survenu pendant la réinitialisation, réessaie plus tard.'
        )
      ).toBeTruthy()
      expect(captureMonitoringError).toHaveBeenNthCalledWith(
        1,
        'someError',
        'ForgottenPasswordOnRecaptchaError'
      )
      expect(navigate).not.toBeCalled()
      expect(renderAPI.queryByTestId('button-isloading-icon')).toBeNull()
    })
  })

  it('should NOT redirect to ResetPasswordEmailSent when reset password request API call has failed', async () => {
    server.use(requestPasswordResetFail())
    const renderAPI = renderForgottenPassword()

    const emailInput = renderAPI.getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    fireEvent.press(renderAPI.getByText('Valider'))
    const recaptchaWebview = renderAPI.getByTestId('recaptcha-webview')
    simulateWebviewMessage(recaptchaWebview, '{ "message": "success", "token": "fakeToken" }')

    await waitFor(() => {
      expect(
        renderAPI.queryByText(
          'Un problème est survenu pendant la réinitialisation, réessaie plus tard.'
        )
      ).toBeTruthy()
      expect(captureMonitoringError).toHaveBeenNthCalledWith(
        1,
        'Échec de la requête https://localhost/native/v1/request_password_reset, code: 400',
        'ForgottenPasswordRequestResetError'
      )
      expect(navigate).not.toBeCalled()
      expect(renderAPI.queryByTestId('button-isloading-icon')).toBeNull()
    })
  })

  describe('email format validation', () => {
    it('should NOT display invalid email format when email format is valid', () => {
      const isEmailValid = jest.spyOn(emailCheck, 'isEmailValid')

      const { getByText, getByPlaceholderText, queryByText } = renderForgottenPassword()

      const emailInput = getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'john.doe@gmail.com')

      const continueButton = getByText('Valider')
      fireEvent.press(continueButton)

      expect(isEmailValid).toReturnWith(true)
      expect(
        queryByText(
          'L’e-mail renseigné est incorrect. Exemple de format attendu : edith.piaf@email.fr'
        )
      ).toBeFalsy()
    })

    it('should display invalid email format when email format is valid', () => {
      const { getByText, getByPlaceholderText, queryByText } = renderForgottenPassword()

      const emailInput = getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'john.doe')

      const continueButton = getByText('Valider')
      fireEvent.press(continueButton)

      expect(
        queryByText(
          'L’e-mail renseigné est incorrect. Exemple de format attendu : edith.piaf@email.fr'
        )
      ).toBeTruthy()
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
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
