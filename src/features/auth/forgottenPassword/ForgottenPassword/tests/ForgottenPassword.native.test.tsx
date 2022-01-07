import * as netInfoModule from '@react-native-community/netinfo'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate, replace } from '__mocks__/@react-navigation/native'
import { ForgottenPassword } from 'features/auth/forgottenPassword/ForgottenPassword/ForgottenPassword'
import { captureMonitoringError } from 'libs/monitoring'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { requestPasswordResetFail, requestPasswordResetSuccess, server } from 'tests/server'
import { simulateWebviewMessage, superFlushWithAct, fireEvent, render } from 'tests/utils'
import * as emailCheck from 'ui/components/inputs/emailCheck'

jest.mock('features/navigation/helpers')

jest.mock('features/auth/settings')

jest.mock('libs/monitoring')

beforeEach(() => {
  simulateConnectedNetwork()
  server.use(requestPasswordResetSuccess())
})

describe('<ForgottenPassword />', () => {
  it('should enable validate button when email input is filled', async () => {
    const { getByPlaceholderText, toJSON } = renderForgottenPassword()
    const disabledButtonSnapshot = toJSON()

    const emailInput = getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')

    await waitForExpect(() => {
      const enabledButtonSnapshot = toJSON()
      expect(disabledButtonSnapshot).toMatchDiffSnapshot(enabledButtonSnapshot)
    })
  })

  it('should redirect to Login when clicking on ArrowPrevious icon', async () => {
    const { getByTestId } = renderForgottenPassword()

    const leftIcon = getByTestId('leftIcon')
    fireEvent.press(leftIcon)

    await waitForExpect(() => {
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
    expect(renderAPI.queryByText('Hors connexion\u00a0: en attente du réseau.')).toBeTruthy()
    expect(renderAPI.queryByTestId('button-isloading-icon')).toBeFalsy()
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
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(replace).toBeCalledTimes(1)
      expect(replace).toHaveBeenCalledWith('ResetPasswordEmailSent', {
        email: 'john.doe@gmail.com',
      })
      expect(renderAPI.queryByTestId('button-isloading-icon')).toBeFalsy()
    })
  })

  it('should NOT redirect to ResetPasswordEmailSent when reCAPTCHA challenge has failed', async () => {
    const renderAPI = renderForgottenPassword()

    const emailInput = renderAPI.getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    fireEvent.press(renderAPI.getByText('Valider'))
    const recaptchaWebview = renderAPI.getByTestId('recaptcha-webview')
    simulateWebviewMessage(recaptchaWebview, '{ "message": "error", "error": "someError" }')
    await superFlushWithAct()

    await waitForExpect(() => {
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
      expect(renderAPI.queryByTestId('button-isloading-icon')).toBeFalsy()
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
    await superFlushWithAct()

    await waitForExpect(() => {
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
      expect(renderAPI.queryByTestId('button-isloading-icon')).toBeFalsy()
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
          "L'e-mail renseigné est incorrect. Exemple de format attendu\u00a0: edith.piaf@email.fr"
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
          "L'e-mail renseigné est incorrect. Exemple de format attendu\u00a0: edith.piaf@email.fr"
        )
      ).toBeTruthy()
    })
  })
})

function simulateNoNetwork() {
  jest.spyOn(netInfoModule, 'useNetInfo').mockReturnValue({
    isConnected: false,
  } as netInfoModule.NetInfoState)
}

function simulateConnectedNetwork() {
  jest.spyOn(netInfoModule, 'useNetInfo').mockReturnValue({
    isConnected: true,
  } as netInfoModule.NetInfoState)
}

function renderForgottenPassword() {
  return render(<ForgottenPassword />, {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
