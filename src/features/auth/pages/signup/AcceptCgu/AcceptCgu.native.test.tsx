import React from 'react'
import { Linking } from 'react-native'

import { navigate } from '__mocks__/@react-navigation/native'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { captureMonitoringError } from 'libs/monitoring'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { NetworkErrorFixture, UnknownErrorFixture } from 'libs/recaptcha/fixtures'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { simulateWebviewMessage, screen, fireEvent, render, waitFor, act } from 'tests/utils'

import { AcceptCgu } from './AcceptCgu'

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

mockUseNetInfoContext.mockReturnValue({
  isConnected: true,
})

const props = {
  goToNextStep: jest.fn(),
  signUp: jest.fn(),
  previousSignupData: {
    email: '',
    marketingEmailSubscription: false,
    password: '',
    birthdate: '',
  },
}

describe('<AcceptCgu/>', () => {
  it('should render correctly', () => {
    renderAcceptCGU()

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to the "CGU" page', () => {
    renderAcceptCGU()

    const link = screen.getByText('Nos conditions générales d’utilisation')
    fireEvent.press(link)

    expect(Linking.openURL).toHaveBeenCalledWith(env.CGU_LINK)
  })

  it('should redirect to the "Politique de confidentialité" page', () => {
    renderAcceptCGU()

    const link = screen.getByText('La charte des données personnelles')
    fireEvent.press(link)

    expect(Linking.openURL).toHaveBeenCalledWith(env.PRIVACY_POLICY_LINK)
  })

  it('should disable the button if the data charted is not checked', () => {
    renderAcceptCGU()

    fireEvent.press(
      screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*')
    )

    expect(screen.getByText('S’inscrire')).toBeDisabled()
  })

  it('should log analytics when pressing on signup button', async () => {
    renderAcceptCGU()
    fireEvent.press(
      screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*')
    )
    await act(() => {
      fireEvent.press(screen.getByText('J’ai lu la charte des données personnelles*'))
    })
    await act(() => fireEvent.press(screen.getByText('S’inscrire')))

    expect(analytics.logContinueCGU).toHaveBeenCalledTimes(1)
  })

  it("should NOT open reCAPTCHA challenge's modal when there is no network", async () => {
    simulateNoNetwork() // first render
    simulateNoNetwork() // render when pressing signup button

    renderAcceptCGU()

    const recaptchaWebviewModal = screen.getByTestId('recaptcha-webview-modal')

    expect(recaptchaWebviewModal.props.visible).toBeFalsy()

    fireEvent.press(
      screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*')
    )
    await act(() => {
      fireEvent.press(screen.getByText('J’ai lu la charte des données personnelles*'))
    })
    await act(() => fireEvent.press(screen.getByText('S’inscrire')))

    expect(recaptchaWebviewModal.props.visible).toBeFalsy()
    expect(screen.queryByText('Hors connexion\u00a0: en attente du réseau.')).toBeOnTheScreen()
    expect(screen.queryByTestId('Chargement en cours')).not.toBeOnTheScreen()
  })

  it("should open reCAPTCHA challenge's modal when pressing on signup button", async () => {
    renderAcceptCGU()
    const recaptchaWebviewModal = screen.getByTestId('recaptcha-webview-modal')

    expect(recaptchaWebviewModal.props.visible).toBeFalsy()

    fireEvent.press(
      screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*')
    )
    await act(() => {
      fireEvent.press(screen.getByText('J’ai lu la charte des données personnelles*'))
    })
    await act(() => fireEvent.press(screen.getByText('S’inscrire')))

    expect(recaptchaWebviewModal.props.visible).toBe(true)
  })

  it('should call API to create user account when reCAPTCHA challenge is successful', async () => {
    renderAcceptCGU()

    fireEvent.press(
      screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*')
    )
    await act(() => {
      fireEvent.press(screen.getByText('J’ai lu la charte des données personnelles*'))
    })
    await act(() => fireEvent.press(screen.getByText('S’inscrire')))
    const recaptchaWebview = screen.getByTestId('recaptcha-webview')

    simulateWebviewMessage(recaptchaWebview, '{ "message": "success", "token": "fakeToken" }')

    await waitFor(() => {
      expect(props.signUp).toHaveBeenCalledWith('fakeToken', false)
      expect(screen.queryByTestId('Chargement en cours')).not.toBeOnTheScreen()
    })
  })

  it('should log monitoring error and display error message when API call to create user account fails', async () => {
    props.signUp.mockImplementationOnce(() => {
      throw new Error()
    })
    renderAcceptCGU()

    fireEvent.press(
      screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*')
    )
    await act(() => {
      fireEvent.press(screen.getByText('J’ai lu la charte des données personnelles*'))
    })
    await act(() => fireEvent.press(screen.getByText('S’inscrire')))
    const recaptchaWebview = screen.getByTestId('recaptcha-webview')

    simulateWebviewMessage(recaptchaWebview, '{ "message": "success", "token": "fakeToken" }')

    await waitFor(() => {
      expect(props.signUp).toHaveBeenCalledWith('fakeToken', false)
      expect(
        screen.queryByText('Un problème est survenu pendant l’inscription, réessaie plus tard.')
      ).toBeOnTheScreen()
      expect(screen.queryByTestId('Chargement en cours')).not.toBeOnTheScreen()
    })
  })

  it('should NOT call API to create user account when reCAPTCHA challenge was failed', async () => {
    renderAcceptCGU()
    fireEvent.press(
      screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*')
    )
    await act(() => {
      fireEvent.press(screen.getByText('J’ai lu la charte des données personnelles*'))
    })
    await act(() => fireEvent.press(screen.getByText('S’inscrire')))
    const recaptchaWebview = screen.getByTestId('recaptcha-webview')
    simulateWebviewMessage(recaptchaWebview, UnknownErrorFixture)

    await waitFor(() => {
      expect(
        screen.queryByText('Un problème est survenu pendant l’inscription, réessaie plus tard.')
      ).toBeOnTheScreen()
      expect(props.signUp).not.toHaveBeenCalled()
      expect(screen.queryByTestId('Chargement en cours')).not.toBeOnTheScreen()
    })
  })

  it('should log to Sentry when reCAPTCHA challenge was failed', async () => {
    renderAcceptCGU()

    fireEvent.press(
      screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*')
    )
    await act(() => {
      fireEvent.press(screen.getByText('J’ai lu la charte des données personnelles*'))
    })
    await act(() => fireEvent.press(screen.getByText('S’inscrire')))
    const recaptchaWebview = screen.getByTestId('recaptcha-webview')

    simulateWebviewMessage(recaptchaWebview, UnknownErrorFixture)

    expect(captureMonitoringError).toHaveBeenCalledWith(
      'UnknownError someError',
      'AcceptCguOnReCaptchaError'
    )
  })

  it('should not log to Sentry on reCAPTCHA network error', async () => {
    renderAcceptCGU()

    fireEvent.press(
      screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*')
    )
    await act(() => {
      fireEvent.press(screen.getByText('J’ai lu la charte des données personnelles*'))
    })
    await act(() => fireEvent.press(screen.getByText('S’inscrire')))
    const recaptchaWebview = screen.getByTestId('recaptcha-webview')

    simulateWebviewMessage(recaptchaWebview, NetworkErrorFixture)

    expect(captureMonitoringError).not.toHaveBeenCalled()
  })

  it('should NOT call API to create user account when reCAPTCHA token has expired', async () => {
    renderAcceptCGU()

    fireEvent.press(
      screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*')
    )
    await act(() => {
      fireEvent.press(screen.getByText('J’ai lu la charte des données personnelles*'))
    })
    await act(() => fireEvent.press(screen.getByText('S’inscrire')))
    const recaptchaWebview = screen.getByTestId('recaptcha-webview')

    simulateWebviewMessage(recaptchaWebview, '{ "message": "expire" }')

    await waitFor(() => {
      expect(
        screen.queryByText('Le token reCAPTCHA a expiré, tu peux réessayer.')
      ).toBeOnTheScreen()
      expect(props.signUp).not.toHaveBeenCalled()
      expect(navigate).not.toHaveBeenCalled()
      expect(screen.queryByTestId('Chargement en cours')).not.toBeOnTheScreen()
    })
  })
})

function renderAcceptCGU() {
  return render(reactQueryProviderHOC(<AcceptCgu {...props} />))
}
