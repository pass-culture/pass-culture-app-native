import * as netInfoModule from '@react-native-community/netinfo'
import React from 'react'
import { Linking } from 'react-native'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { AuthContext } from 'features/auth/AuthContext'
import { contactSupport } from 'features/auth/support.services'
import { env } from 'libs/environment'
import { captureMonitoringError } from 'libs/monitoring'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { simulateWebviewMessage, fireEvent, render, superFlushWithAct, waitFor } from 'tests/utils'

import { AcceptCgu } from './AcceptCgu'

jest.mock('features/auth/settings')
jest.mock('libs/monitoring')

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

const props = { goToNextStep: jest.fn(), signUp: jest.fn() }

describe('<AcceptCgu/>', () => {
  it('should open mail app when clicking on contact support button', async () => {
    simulateConnectedNetwork()
    const { findByText } = renderAcceptCGU()

    const contactSupportButton = await findByText('Contacter le support')
    fireEvent.press(contactSupportButton)
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(contactSupport.forGenericQuestion).toBeCalledTimes(1)
    })
  })

  it('should redirect to the "CGU" page', async () => {
    simulateConnectedNetwork()

    const { getByTestId } = renderAcceptCGU()

    const link = getByTestId('external-link-cgu')
    fireEvent.press(link)

    await waitForExpect(() => {
      expect(Linking.openURL).toHaveBeenCalledWith(env.CGU_LINK)
    })
  })

  it('should redirect to the "Politique de confidentialité" page', async () => {
    simulateConnectedNetwork()

    const { getByTestId } = renderAcceptCGU()

    const link = getByTestId('external-link-privacy-policy')
    fireEvent.press(link)

    await waitForExpect(() => {
      expect(Linking.openURL).toHaveBeenCalledWith(env.PRIVACY_POLICY_LINK)
    })
  })

  it("should NOT open reCAPTCHA challenge's modal when there is no network", async () => {
    simulateNoNetwork()
    const renderAPI = renderAcceptCGU()
    const recaptchaWebviewModal = renderAPI.getByTestId('recaptcha-webview-modal')
    expect(recaptchaWebviewModal.props.visible).toBeFalsy()

    fireEvent.press(renderAPI.getByText('Accepter et s’inscrire'))

    expect(recaptchaWebviewModal.props.visible).toBeFalsy()
    expect(renderAPI.queryByText('Hors connexion\u00a0: en attente du réseau.')).toBeTruthy()
    expect(renderAPI.queryByTestId('button-isloading-icon')).toBeFalsy()
  })

  it("should open reCAPTCHA challenge's modal when pressing on signup button", () => {
    simulateConnectedNetwork()
    const renderAPI = renderAcceptCGU()
    const recaptchaWebviewModal = renderAPI.getByTestId('recaptcha-webview-modal')

    expect(recaptchaWebviewModal.props.visible).toBeFalsy()

    fireEvent.press(renderAPI.getByText('Accepter et s’inscrire'))

    expect(recaptchaWebviewModal.props.visible).toBeTruthy()
  })

  it('should call API to create user account when reCAPTCHA challenge is successful', async () => {
    simulateConnectedNetwork()
    const renderAPI = renderAcceptCGU()
    fireEvent.press(renderAPI.getByText('Accepter et s’inscrire'))
    const recaptchaWebview = renderAPI.getByTestId('recaptcha-webview')

    simulateWebviewMessage(recaptchaWebview, '{ "message": "success", "token": "fakeToken" }')

    await waitFor(() => {
      expect(props.signUp).toBeCalledWith('fakeToken')
      expect(renderAPI.queryByTestId('button-isloading-icon')).toBeFalsy()
    })
  })

  it('should log monitoring error and display error message when API call to create user account fails', async () => {
    simulateConnectedNetwork()
    props.signUp.mockImplementationOnce(() => {
      throw new Error()
    })
    const renderAPI = renderAcceptCGU()
    fireEvent.press(renderAPI.getByText('Accepter et s’inscrire'))
    const recaptchaWebview = renderAPI.getByTestId('recaptcha-webview')

    simulateWebviewMessage(recaptchaWebview, '{ "message": "success", "token": "fakeToken" }')

    await waitFor(() => {
      expect(props.signUp).toBeCalledWith('fakeToken')
      expect(
        renderAPI.queryByText("Un problème est survenu pendant l'inscription, réessaie plus tard.")
      ).toBeTruthy()
      expect(renderAPI.queryByTestId('button-isloading-icon')).toBeFalsy()
    })
  })

  it('should NOT call API to create user account when reCAPTCHA challenge was failed', async () => {
    simulateConnectedNetwork()
    const renderAPI = renderAcceptCGU()
    fireEvent.press(renderAPI.getByText('Accepter et s’inscrire'))
    const recaptchaWebview = renderAPI.getByTestId('recaptcha-webview')

    simulateWebviewMessage(recaptchaWebview, '{ "message": "error", "error": "someError" }')

    await waitFor(() => {
      expect(
        renderAPI.queryByText("Un problème est survenu pendant l'inscription, réessaie plus tard.")
      ).toBeTruthy()
      expect(captureMonitoringError).toHaveBeenNthCalledWith(
        1,
        'someError',
        'AcceptCguOnReCaptchaError'
      )
      expect(props.signUp).not.toBeCalled()
      expect(renderAPI.queryByTestId('button-isloading-icon')).toBeFalsy()
    })
  })

  it('should NOT call API to create user account when reCAPTCHA token has expired', async () => {
    simulateConnectedNetwork()
    const renderAPI = renderAcceptCGU()
    fireEvent.press(renderAPI.getByText('Accepter et s’inscrire'))
    const recaptchaWebview = renderAPI.getByTestId('recaptcha-webview')

    simulateWebviewMessage(recaptchaWebview, '{ "message": "expire" }')

    await waitFor(() => {
      expect(renderAPI.queryByText('Le token reCAPTCHA a expiré, tu peux réessayer.')).toBeTruthy()
      expect(props.signUp).not.toBeCalled()
      expect(navigate).not.toBeCalled()
      expect(renderAPI.queryByTestId('button-isloading-icon')).toBeFalsy()
    })
  })
})

function renderAcceptCGU() {
  return render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <AuthContext.Provider value={{ isLoggedIn: true, setIsLoggedIn: jest.fn() }}>
        <AcceptCgu {...props} />
      </AuthContext.Provider>
    )
  )
}
