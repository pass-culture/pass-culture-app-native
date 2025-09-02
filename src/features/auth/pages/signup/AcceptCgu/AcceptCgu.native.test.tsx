import React from 'react'
import { Linking } from 'react-native'

import { navigate } from '__mocks__/@react-navigation/native'
import { setSettings } from 'features/auth/tests/setSettings'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { UnknownErrorFixture } from 'libs/recaptcha/fixtures'
import { mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, simulateWebviewMessage, userEvent, waitFor } from 'tests/utils'

import { AcceptCgu } from './AcceptCgu'

jest.mock('libs/network/NetInfoWrapper')

jest.mock('libs/monitoring/services')

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

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<AcceptCgu/>', () => {
  beforeEach(() => {
    setSettings()
  })

  it('should render correctly', () => {
    renderAcceptCGU()

    expect(screen).toMatchSnapshot()
  })

  it('should render correctly for SSO subscription', () => {
    renderAcceptCGU({ isSSOSubscription: true, previousMarketingData: false })

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to the "CGU" page', async () => {
    renderAcceptCGU()

    const link = screen.getByText('Nos conditions générales d’utilisation')
    await user.press(link)

    expect(Linking.openURL).toHaveBeenCalledWith(env.CGU_LINK)
  })

  it('should redirect to the "Charte des données personnelles" page', async () => {
    renderAcceptCGU()

    const link = screen.getByText('La charte des données personnelles')
    await user.press(link)

    expect(Linking.openURL).toHaveBeenCalledWith(env.PRIVACY_POLICY_LINK)
  })

  it('should disable the button if the data charted is not checked', () => {
    renderAcceptCGU()

    user.press(screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*'))

    expect(screen.getByText('S’inscrire')).toBeDisabled()
  })

  it('should log analytics when pressing on signup button', async () => {
    renderAcceptCGU()
    user.press(screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*'))

    await user.press(screen.getByText('J’ai lu la charte des données personnelles*'))

    await user.press(screen.getByText('S’inscrire'))

    expect(analytics.logContinueCGU).toHaveBeenCalledTimes(1)
  })

  it("should open reCAPTCHA challenge's modal when pressing on signup button", async () => {
    renderAcceptCGU()

    expect(screen.queryByTestId('recaptcha-webview-modal')).not.toBeOnTheScreen()

    user.press(screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*'))

    await user.press(screen.getByText('J’ai lu la charte des données personnelles*'))

    await user.press(screen.getByText('S’inscrire'))

    expect(screen.getByTestId('recaptcha-webview-modal')).toBeOnTheScreen()
  })

  it('should call API to create user account when reCAPTCHA challenge is successful', async () => {
    renderAcceptCGU()

    user.press(screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*'))
    await user.press(screen.getByText('J’ai lu la charte des données personnelles*'))

    await user.press(screen.getByText('S’inscrire'))
    const recaptchaWebview = screen.getByTestId('recaptcha-webview')

    simulateWebviewMessage(recaptchaWebview, '{ "message": "success", "token": "fakeToken" }')

    await waitFor(() => {
      expect(props.signUp).toHaveBeenCalledWith('fakeToken', false)
      expect(screen.queryByTestId('Chargement en cours')).not.toBeOnTheScreen()
    })
  })

  it('should call API with previous marketing data to create classic account', async () => {
    renderAcceptCGU({ isSSOSubscription: false, previousMarketingData: true })

    user.press(screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*'))
    await user.press(screen.getByText('J’ai lu la charte des données personnelles*'))

    await user.press(screen.getByText('S’inscrire'))

    const recaptchaWebview = screen.getByTestId('recaptcha-webview')
    simulateWebviewMessage(recaptchaWebview, '{ "message": "success", "token": "fakeToken" }')

    await waitFor(() => {
      expect(props.signUp).toHaveBeenCalledWith('fakeToken', true)
    })
  })

  it('should call API with marketing email subscription information to create SSO account', async () => {
    renderAcceptCGU({ isSSOSubscription: true, previousMarketingData: false })

    user.press(
      screen.getByText(
        'J’accepte de recevoir les newsletters, bons plans et les recommandations personnalisées du pass Culture.'
      )
    )
    await user.press(
      screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*')
    )
    await user.press(screen.getByText('J’ai lu la charte des données personnelles*'))
    await user.press(screen.getByText('S’inscrire'))

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

    await user.press(
      screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*')
    )
    await user.press(screen.getByText('J’ai lu la charte des données personnelles*'))

    await user.press(screen.getByText('S’inscrire'))
    const recaptchaWebview = screen.getByTestId('recaptcha-webview')

    simulateWebviewMessage(recaptchaWebview, '{ "message": "success", "token": "fakeToken" }')

    await waitFor(() => {
      expect(props.signUp).toHaveBeenCalledWith('fakeToken', false)
      expect(
        screen.getByText('Un problème est survenu pendant l’inscription, réessaie plus tard.', {
          exact: false,
          hidden: true,
        })
      ).toBeOnTheScreen()
      expect(screen.queryByTestId('Chargement en cours')).not.toBeOnTheScreen()
    })
  })

  it('should NOT call API to create user account when reCAPTCHA challenge was failed', async () => {
    renderAcceptCGU()
    await user.press(
      screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*')
    )
    await user.press(screen.getByText('J’ai lu la charte des données personnelles*'))

    await user.press(screen.getByText('S’inscrire'))
    const recaptchaWebview = screen.getByTestId('recaptcha-webview')
    simulateWebviewMessage(recaptchaWebview, UnknownErrorFixture)

    await waitFor(() => {
      expect(
        screen.getByText('Un problème est survenu pendant l’inscription, réessaie plus tard.', {
          exact: false,
          hidden: true,
        })
      ).toBeOnTheScreen()
      expect(props.signUp).not.toHaveBeenCalled()
      expect(screen.queryByTestId('Chargement en cours')).not.toBeOnTheScreen()
    })
  })

  it('should NOT call API to create user account when reCAPTCHA token has expired', async () => {
    renderAcceptCGU()

    await user.press(
      screen.getByText('J’ai lu et j’accepte les conditions générales d’utilisation*')
    )
    await user.press(screen.getByText('J’ai lu la charte des données personnelles*'))

    await user.press(screen.getByText('S’inscrire'))
    const recaptchaWebview = screen.getByTestId('recaptcha-webview')

    simulateWebviewMessage(recaptchaWebview, '{ "message": "expire" }')

    await waitFor(() => {
      expect(
        screen.getByText('Le token reCAPTCHA a expiré, tu peux réessayer.', { hidden: true })
      ).toBeOnTheScreen()
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
