import React from 'react'
import { Linking } from 'react-native'

import { navigate } from '__mocks__/@react-navigation/native'
import { AuthContext } from 'features/auth/context/AuthContext'
import { contactSupport } from 'features/auth/support.services'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { env } from 'libs/environment'
import { captureMonitoringError } from 'libs/monitoring'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { simulateWebviewMessage, fireEvent, render, waitFor } from 'tests/utils'

import { AcceptCgu } from './AcceptCgu'

jest.mock('features/auth/context/SettingsContext')
jest.mock('libs/monitoring')
const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock
function simulateNoNetwork() {
  mockUseNetInfoContext.mockReturnValue({
    isConnected: false,
  })
}

function simulateConnectedNetwork() {
  mockUseNetInfoContext.mockReturnValue({
    isConnected: true,
  })
}

const props = { goToNextStep: jest.fn(), signUp: jest.fn() }

describe('<AcceptCgu/>', () => {
  it('should open mail app when clicking on contact support button', async () => {
    simulateConnectedNetwork()
    const { getByText } = renderAcceptCGU()

    const contactSupportButton = getByText('Contacter le support')
    fireEvent.press(contactSupportButton)

    await waitFor(() => {
      expect(openUrl).toHaveBeenCalledWith(
        contactSupport.forGenericQuestion.url,
        contactSupport.forGenericQuestion.params,
        true
      )
    })
  })

  it('should redirect to the "CGU" page', async () => {
    simulateConnectedNetwork()

    const { getByTestId } = renderAcceptCGU()

    const link = getByTestId('Nouvelle fenêtre : Conditions Générales d’Utilisation')
    fireEvent.press(link)

    await waitFor(() => {
      expect(Linking.openURL).toHaveBeenCalledWith(env.CGU_LINK)
    })
  })

  it('should redirect to the "Politique de confidentialité" page', async () => {
    simulateConnectedNetwork()

    const { getByTestId } = renderAcceptCGU()

    const link = getByTestId('Nouvelle fenêtre : Politique de confidentialité.')
    fireEvent.press(link)

    await waitFor(() => {
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
    expect(renderAPI.queryByTestId('Chargement en cours')).toBeNull()
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
      expect(props.signUp).toHaveBeenCalledWith('fakeToken')
      expect(renderAPI.queryByTestId('Chargement en cours')).toBeNull()
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
      expect(props.signUp).toHaveBeenCalledWith('fakeToken')
      expect(
        renderAPI.queryByText('Un problème est survenu pendant l’inscription, réessaie plus tard.')
      ).toBeTruthy()
      expect(renderAPI.queryByTestId('Chargement en cours')).toBeNull()
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
        renderAPI.queryByText('Un problème est survenu pendant l’inscription, réessaie plus tard.')
      ).toBeTruthy()
      expect(captureMonitoringError).toHaveBeenNthCalledWith(
        1,
        'someError',
        'AcceptCguOnReCaptchaError'
      )
      expect(props.signUp).not.toBeCalled()
      expect(renderAPI.queryByTestId('Chargement en cours')).toBeNull()
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
      expect(renderAPI.queryByTestId('Chargement en cours')).toBeNull()
    })
  })
})

function renderAcceptCGU() {
  return render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <AuthContext.Provider
        value={{
          isLoggedIn: true,
          setIsLoggedIn: jest.fn(),
          isUserLoading: false,
          refetchUser: jest.fn(),
        }}>
        <AcceptCgu {...props} />
      </AuthContext.Provider>
    )
  )
}
