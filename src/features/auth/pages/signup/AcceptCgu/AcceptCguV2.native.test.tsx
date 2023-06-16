import React from 'react'
import { Linking } from 'react-native'

import { navigate } from '__mocks__/@react-navigation/native'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { contactSupport } from 'features/auth/helpers/contactSupport'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { captureMonitoringError } from 'libs/monitoring'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { simulateWebviewMessage, screen, fireEvent, render, waitFor } from 'tests/utils'

import { AcceptCguV2 } from './AcceptCguV2'

jest.mock('features/auth/context/SettingsContext')
jest.mock('libs/monitoring')

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>
mockUseAuthContext.mockReturnValue({
  isLoggedIn: true,
  setIsLoggedIn: jest.fn(),
  refetchUser: jest.fn(),
  isUserLoading: false,
})

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock
function simulateNoNetwork() {
  mockUseNetInfoContext.mockReturnValueOnce({
    isConnected: false,
  })
  // useNetInfoContext is call twice in AcceptCguV2 and useAppSettings
  mockUseNetInfoContext.mockReturnValueOnce({
    isConnected: false,
  })
}

function simulateConnectedNetwork() {
  mockUseNetInfoContext.mockReturnValueOnce({
    isConnected: true,
  })
}

const props = { goToNextStep: jest.fn(), signUp: jest.fn() }

describe('<AcceptCgu/>', () => {
  it('should open mail app when clicking on contact support button', () => {
    simulateConnectedNetwork()
    renderAcceptCGU()

    const contactSupportButton = screen.getByText('Contacter le support')
    fireEvent.press(contactSupportButton)

    expect(openUrl).toHaveBeenCalledWith(
      contactSupport.forGenericQuestion.url,
      contactSupport.forGenericQuestion.params,
      true
    )
  })

  it('should redirect to the "CGU" page', () => {
    simulateConnectedNetwork()
    renderAcceptCGU()

    const link = screen.getByText('Nos conditions générales d’utilisation')
    fireEvent.press(link)

    expect(Linking.openURL).toHaveBeenCalledWith(env.CGU_LINK)
  })

  it('should redirect to the "Politique de confidentialité" page', () => {
    simulateConnectedNetwork()
    renderAcceptCGU()

    const link = screen.getByText('Notre politique de confidentialité')
    fireEvent.press(link)

    expect(Linking.openURL).toHaveBeenCalledWith(env.PRIVACY_POLICY_LINK)
  })

  it('should log analytics when pressing on signup button', () => {
    simulateConnectedNetwork()
    renderAcceptCGU()

    fireEvent.press(screen.getByText('Accepter et s’inscrire'))

    expect(analytics.logContinueCGU).toHaveBeenCalledTimes(1)
  })

  it("should NOT open reCAPTCHA challenge's modal when there is no network", () => {
    simulateNoNetwork()
    renderAcceptCGU()

    const recaptchaWebviewModal = screen.getByTestId('recaptcha-webview-modal')
    expect(recaptchaWebviewModal.props.visible).toBeFalsy()

    fireEvent.press(screen.getByText('Accepter et s’inscrire'))

    expect(recaptchaWebviewModal.props.visible).toBeFalsy()
    expect(screen.queryByText('Hors connexion\u00a0: en attente du réseau.')).toBeTruthy()
    expect(screen.queryByTestId('Chargement en cours')).toBeNull()
  })

  it("should open reCAPTCHA challenge's modal when pressing on signup button", () => {
    simulateConnectedNetwork()
    renderAcceptCGU()
    const recaptchaWebviewModal = screen.getByTestId('recaptcha-webview-modal')

    expect(recaptchaWebviewModal.props.visible).toBeFalsy()

    fireEvent.press(screen.getByText('Accepter et s’inscrire'))

    expect(recaptchaWebviewModal.props.visible).toBeTruthy()
  })

  it('should call API to create user account when reCAPTCHA challenge is successful', async () => {
    simulateConnectedNetwork()
    renderAcceptCGU()

    fireEvent.press(screen.getByText('Accepter et s’inscrire'))
    const recaptchaWebview = screen.getByTestId('recaptcha-webview')

    simulateWebviewMessage(recaptchaWebview, '{ "message": "success", "token": "fakeToken" }')

    await waitFor(() => {
      expect(props.signUp).toHaveBeenCalledWith('fakeToken')
      expect(screen.queryByTestId('Chargement en cours')).toBeNull()
    })
  })

  it('should log monitoring error and display error message when API call to create user account fails', async () => {
    simulateConnectedNetwork()
    props.signUp.mockImplementationOnce(() => {
      throw new Error()
    })
    renderAcceptCGU()

    fireEvent.press(screen.getByText('Accepter et s’inscrire'))
    const recaptchaWebview = screen.getByTestId('recaptcha-webview')

    simulateWebviewMessage(recaptchaWebview, '{ "message": "success", "token": "fakeToken" }')

    await waitFor(() => {
      expect(props.signUp).toHaveBeenCalledWith('fakeToken')
      expect(
        screen.queryByText('Un problème est survenu pendant l’inscription, réessaie plus tard.')
      ).toBeTruthy()
      expect(screen.queryByTestId('Chargement en cours')).toBeNull()
    })
  })

  it('should NOT call API to create user account when reCAPTCHA challenge was failed', async () => {
    simulateConnectedNetwork()
    renderAcceptCGU()

    fireEvent.press(screen.getByText('Accepter et s’inscrire'))
    const recaptchaWebview = screen.getByTestId('recaptcha-webview')

    simulateWebviewMessage(recaptchaWebview, '{ "message": "error", "error": "someError" }')

    await waitFor(() => {
      expect(
        screen.queryByText('Un problème est survenu pendant l’inscription, réessaie plus tard.')
      ).toBeTruthy()
      expect(captureMonitoringError).toHaveBeenNthCalledWith(
        1,
        'someError',
        'AcceptCguOnReCaptchaError'
      )
      expect(props.signUp).not.toBeCalled()
      expect(screen.queryByTestId('Chargement en cours')).toBeNull()
    })
  })

  it('should NOT call API to create user account when reCAPTCHA token has expired', async () => {
    simulateConnectedNetwork()
    renderAcceptCGU()

    fireEvent.press(screen.getByText('Accepter et s’inscrire'))
    const recaptchaWebview = screen.getByTestId('recaptcha-webview')

    simulateWebviewMessage(recaptchaWebview, '{ "message": "expire" }')

    await waitFor(() => {
      expect(screen.queryByText('Le token reCAPTCHA a expiré, tu peux réessayer.')).toBeTruthy()
      expect(props.signUp).not.toBeCalled()
      expect(navigate).not.toBeCalled()
      expect(screen.queryByTestId('Chargement en cours')).toBeNull()
    })
  })
})

function renderAcceptCGU() {
  return render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(<AcceptCguV2 {...props} />)
  )
}
