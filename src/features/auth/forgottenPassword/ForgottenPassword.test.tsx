import * as netInfoModule from '@react-native-community/netinfo'
import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { ForgottenPassword } from 'features/auth/forgottenPassword/ForgottenPassword'
import { homeNavigateConfig } from 'features/navigation/helpers'
import { requestPasswordResetFail, requestPasswordResetSuccess, server } from 'tests/server'
import { simulateWebviewMessage, superFlushWithAct } from 'tests/utils'
import * as emailCheck from 'ui/components/inputs/emailCheck'

beforeEach(() => {
  jest.clearAllMocks()
  simulateConnectedNetwork()
  server.use(requestPasswordResetSuccess())
})

describe('<ForgottenPassword />', () => {
  it('should enable validate button when email input is filled', async () => {
    const { getByPlaceholderText, toJSON } = render(<ForgottenPassword />)
    const disabledButtonSnapshot = toJSON()

    const emailInput = getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')

    await waitForExpect(() => {
      const enabledButtonSnapshot = toJSON()
      expect(disabledButtonSnapshot).toMatchDiffSnapshot(enabledButtonSnapshot)
    })
  })

  it('should redirect to Login when clicking on ArrowPrevious icon', async () => {
    const { getByTestId } = render(<ForgottenPassword />)

    const leftIcon = getByTestId('leftIcon')
    fireEvent.press(leftIcon)

    await waitForExpect(() => {
      expect(navigate).toBeCalledTimes(1)
      expect(navigate).toHaveBeenCalledWith('Login')
    })
  })

  it("should NOT open reCAPTCHA challenge's modal when there is no network", () => {
    simulateNoNetwork()
    const renderAPI = render(<ForgottenPassword />)
    const recaptchaWebviewModal = renderAPI.getByTestId('recaptcha-webview-modal')

    expect(recaptchaWebviewModal.props.visible).toBeFalsy()

    const emailInput = renderAPI.getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    fireEvent.press(renderAPI.getByText('Valider'))

    expect(recaptchaWebviewModal.props.visible).toBeFalsy()
    expect(renderAPI.queryByText('Hors connexion : en attente du réseau.')).toBeTruthy()
    expect(renderAPI.queryByTestId('button-isloading-icon')).toBeFalsy()
  })

  it("should open reCAPTCHA challenge's modal when pressing on validate button", () => {
    const renderAPI = render(<ForgottenPassword />)
    const recaptchaWebviewModal = renderAPI.getByTestId('recaptcha-webview-modal')

    expect(recaptchaWebviewModal.props.visible).toBeFalsy()

    const emailInput = renderAPI.getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    fireEvent.press(renderAPI.getByText('Valider'))

    expect(recaptchaWebviewModal.props.visible).toBeTruthy()
  })

  it('should redirect to ResetPasswordEmailSent when password reset request is successful', async () => {
    const renderAPI = render(<ForgottenPassword />)

    const emailInput = renderAPI.getByPlaceholderText('tonadresse@email.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    fireEvent.press(renderAPI.getByText('Valider'))
    const recaptchaWebview = renderAPI.getByTestId('recaptcha-webview')
    simulateWebviewMessage(recaptchaWebview, '{ "message": "success", "token": "fakeToken" }')
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(navigate).toBeCalledTimes(1)
      expect(navigate).toHaveBeenCalledWith('ResetPasswordEmailSent', {
        email: 'john.doe@gmail.com',
        backNavigation: {
          from: homeNavigateConfig.screen,
          params: homeNavigateConfig.params,
        },
      })
      expect(renderAPI.queryByTestId('button-isloading-icon')).toBeFalsy()
    })
  })

  it('should NOT redirect to ResetPasswordEmailSent when reCAPTCHA challenge has failed', async () => {
    const renderAPI = render(<ForgottenPassword />)

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
      expect(navigate).not.toBeCalled()
      expect(renderAPI.queryByTestId('button-isloading-icon')).toBeFalsy()
    })
  })

  it('should NOT redirect to ResetPasswordEmailSent when reset password request API call has failed', async () => {
    server.use(requestPasswordResetFail())
    const renderAPI = render(<ForgottenPassword />)

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
      expect(navigate).not.toBeCalled()
      expect(renderAPI.queryByTestId('button-isloading-icon')).toBeFalsy()
    })
  })

  describe('email format validation', () => {
    it('should NOT display invalid email format when email format is valid', () => {
      const isEmailValid = jest.spyOn(emailCheck, 'isEmailValid')

      const { getByText, getByPlaceholderText, queryByText } = render(<ForgottenPassword />)

      const emailInput = getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'john.doe@gmail.com')

      const continueButton = getByText('Valider')
      fireEvent.press(continueButton)

      expect(isEmailValid).toReturnWith(true)
      expect(queryByText("Format de l'e-mail incorrect")).toBeFalsy()
    })

    it('should display invalid email format when email format is valid', () => {
      const { getByText, getByPlaceholderText, queryByText } = render(<ForgottenPassword />)

      const emailInput = getByPlaceholderText('tonadresse@email.com')
      fireEvent.changeText(emailInput, 'john.doe')

      const continueButton = getByText('Valider')
      fireEvent.press(continueButton)

      expect(queryByText("Format de l'e-mail incorrect")).toBeTruthy()
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
