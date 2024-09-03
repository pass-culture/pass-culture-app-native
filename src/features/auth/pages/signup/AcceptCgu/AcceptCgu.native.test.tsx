import React from 'react'
import { Linking } from 'react-native'

import { navigate } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { UnknownErrorFixture } from 'libs/recaptcha/fixtures'
import { mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, simulateWebviewMessage, waitFor } from 'tests/utils'

import { AcceptCgu } from './AcceptCgu'

jest.mock('libs/network/NetInfoWrapper')

jest.mock('features/auth/context/SettingsContext')
jest.mock('libs/monitoring')

jest.mock('features/auth/context/AuthContext')
mockAuthContextWithoutUser({ persist: true })
const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

mockUseNetInfoContext.mockReturnValueOnce({
  isConnected: false,
})

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

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

describe('<AcceptCgu/>', () => {
  it('should render correctly', () => {
    renderAcceptCGU()

    expect(screen).toMatchSnapshot()
  })

  it('should render correctly for SSO subscription', () => {
    renderAcceptCGU({ isSSOSubscription: true, previousMarketingData: false })

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to the "CGU" page', () => {
    renderAcceptCGU()

    const link = screen.getByText('Nos conditions générales d’utilisation')
    fireEvent.press(link)

    expect(Linking.openURL).toHaveBeenCalledWith(env.CGU_LINK)
  })

  it('should redirect to the "Charte des données personnelles" page', () => {
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

  it('should call API with previous marketing data to create classic account', async () => {
    renderAcceptCGU({ isSSOSubscription: false, previousMarketingData: true })

    await act(() => {
      fireEvent.press(
        screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*')
      )
      fireEvent.press(screen.getByText('J’ai lu la charte des données personnelles*'))
    })
    await act(() => fireEvent.press(screen.getByText('S’inscrire')))

    const recaptchaWebview = screen.getByTestId('recaptcha-webview')
    simulateWebviewMessage(recaptchaWebview, '{ "message": "success", "token": "fakeToken" }')

    await waitFor(() => {
      expect(props.signUp).toHaveBeenCalledWith('fakeToken', true)
    })
  })

  it('should call API with marketing email subscription information to create SSO account', async () => {
    renderAcceptCGU({ isSSOSubscription: true, previousMarketingData: false })

    await act(() => {
      fireEvent.press(
        screen.getByText(
          'J’accepte de recevoir les newsletters, bons plans et les recommandations personnalisées du pass Culture.'
        )
      )
      fireEvent.press(
        screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*')
      )
      fireEvent.press(screen.getByText('J’ai lu la charte des données personnelles*'))
    })
    await act(() => fireEvent.press(screen.getByText('S’inscrire')))

    const recaptchaWebview = screen.getByTestId('recaptcha-webview')
    simulateWebviewMessage(recaptchaWebview, '{ "message": "success", "token": "fakeToken" }')

    await waitFor(() => {
      expect(props.signUp).toHaveBeenCalledWith('fakeToken', true)
    })
  })

  it('should not take into account previous marketing data for SSO account in CGU page', async () => {
    renderAcceptCGU({ isSSOSubscription: true, previousMarketingData: true })

    const marketingCheckbox = await screen.findByLabelText(
      'J’accepte de recevoir les newsletters, bons plans et les recommandations personnalisées du pass Culture.'
    )

    expect(marketingCheckbox.props.accessibilityState.checked).toBe(false)
  })

  it('should display error message when API call to create user account fails', async () => {
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
        screen.getByText('Un problème est survenu pendant l’inscription, réessaie plus tard.')
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
        screen.getByText('Un problème est survenu pendant l’inscription, réessaie plus tard.')
      ).toBeOnTheScreen()
      expect(props.signUp).not.toHaveBeenCalled()
      expect(screen.queryByTestId('Chargement en cours')).not.toBeOnTheScreen()
    })
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
      expect(screen.getByText('Le token reCAPTCHA a expiré, tu peux réessayer.')).toBeOnTheScreen()
      expect(props.signUp).not.toHaveBeenCalled()
      expect(navigate).not.toHaveBeenCalled()
      expect(screen.queryByTestId('Chargement en cours')).not.toBeOnTheScreen()
    })
  })
})

function renderAcceptCGU(
  { isSSOSubscription, previousMarketingData } = {
    isSSOSubscription: false,
    previousMarketingData: props.previousSignupData.marketingEmailSubscription,
  }
) {
  return render(
    reactQueryProviderHOC(
      <AcceptCgu
        {...props}
        isSSOSubscription={isSSOSubscription}
        previousSignupData={{
          ...props.previousSignupData,
          marketingEmailSubscription: previousMarketingData,
        }}
      />
    )
  )
}
