import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import * as API from 'api/api'
import { AccountState, OauthStateResponseV2, SigninResponseV2 } from 'api/gen'
import { AuthContext } from 'features/auth/context/AuthContext'
import { getLastLoginInfo } from 'features/auth/helpers/getLastLoginInfo'
import { FormattedLastLoginInfo, Provider, SignInResponseFailure } from 'features/auth/types'
import { StepperOrigin } from 'features/navigation/navigators/RootNavigator/types'
import { UserProfile } from 'features/share/types'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { Apple } from 'ui/svg/icons/socialNetwork/Apple'
import { Google } from 'ui/svg/icons/socialNetwork/Google'

import { LoginMethodsWithLastLoginInfo } from './LoginMethodsWithLastLoginInfo'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/network/NetInfoWrapper')
jest.mock('libs/monitoring/services')
jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/helpers/usePreviousRouteName')
jest.mock('features/auth/helpers/getLastLoginInfo')

const mockResetSearch = jest.fn()

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: jest.fn(() => ({ resetSearch: mockResetSearch })),
}))

const mockIdentityCheckDispatch = jest.fn()

jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({ dispatch: mockIdentityCheckDispatch })),
}))

const apiPostOAuthAuthorize = jest.spyOn(API.api, 'postNativeV2OauthssoProviderAuthorize')

jest.useFakeTimers()

const user = userEvent.setup()

const LAST_LOGIN_INFO_EMAIL: FormattedLastLoginInfo = {
  maskedEmail: 'rog*************@gmail.com',
  provider: { label: 'E-mail', icon: EmailFilled, type: Provider.EMAIL },
  lastLoginAt: '17/08/2026',
}

const LAST_LOGIN_INFO_GOOGLE: FormattedLastLoginInfo = {
  maskedEmail: 'rog*************@gmail.com',
  provider: { label: 'Google', icon: Google, type: Provider.GOOGLE },
  lastLoginAt: '17/08/2026',
}

const LAST_LOGIN_INFO_APPLE: FormattedLastLoginInfo = {
  maskedEmail: 'rog*************@apple.com',
  provider: { label: 'Apple', icon: Apple, type: Provider.APPLE },
  lastLoginAt: '17/08/2026',
}

describe('<LoginMethodsWithLastLoginInfo />', () => {
  beforeEach(() => {
    setFeatureFlags([])
    jest.mocked(getLastLoginInfo).mockResolvedValue(LAST_LOGIN_INFO_EMAIL)
    useRoute.mockReturnValue({ params: {} })

    mockServer.getApi<OauthStateResponseV2>('/v2/oauth/state', {
      oauthStateToken: 'oauth_state_token',
    })

    mockServer.postApi<SigninResponseV2>('/v2/signin', {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      accountState: AccountState.ACTIVE,
    })

    mockMeApiCall({ showEligibleCard: false } as UserProfile)
  })

  afterEach(() => jest.clearAllMocks())

  it('should display the last login information', async () => {
    renderLoginMethodsWithLastLoginInfo()

    expect(await screen.findByText('rog*************@gmail.com')).toBeOnTheScreen()
    expect(screen.getByText('E-mail')).toBeOnTheScreen()
    expect(screen.getByText('Connecté pour la dernière fois le 17/08/2026')).toBeOnTheScreen()
  })

  describe('when the last login provider is Google', () => {
    beforeEach(() => jest.mocked(getLastLoginInfo).mockResolvedValue(LAST_LOGIN_INFO_GOOGLE))

    it('should display the Google sign in button', async () => {
      renderLoginMethodsWithLastLoginInfo()

      expect(await screen.findByText('Se connecter avec Google')).toBeOnTheScreen()
      expect(screen.queryByText('Se connecter avec Apple')).not.toBeOnTheScreen()
      expect(screen.queryByText('Continuer avec mon e-mail')).not.toBeOnTheScreen()
    })
  })

  describe('when the last login provider is Apple', () => {
    beforeEach(() => jest.mocked(getLastLoginInfo).mockResolvedValue(LAST_LOGIN_INFO_APPLE))

    it('should display the Apple sign in button when Apple SSO is enabled', async () => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_APPLE_SSO])

      renderLoginMethodsWithLastLoginInfo()

      expect(await screen.findByText('Se connecter avec Apple')).toBeOnTheScreen()
      expect(screen.queryByText('Se connecter avec Google')).not.toBeOnTheScreen()
      expect(screen.queryByText('Continuer avec mon e-mail')).not.toBeOnTheScreen()
    })

    it('should not display the Apple sign in button when Apple SSO is disabled', async () => {
      renderLoginMethodsWithLastLoginInfo()

      await screen.findByText('Connecte-toi')

      expect(screen.queryByText('Se connecter avec Apple')).not.toBeOnTheScreen()
    })
  })

  describe('when the last login provider is email', () => {
    it('should display the email sign in button', async () => {
      renderLoginMethodsWithLastLoginInfo()

      expect(await screen.findByText('Continuer avec mon e-mail')).toBeOnTheScreen()
      expect(screen.queryByText('Se connecter avec Google')).not.toBeOnTheScreen()
      expect(screen.queryByText('Se connecter avec Apple')).not.toBeOnTheScreen()
    })

    it('should navigate to Login when the email sign in button is clicked', async () => {
      renderLoginMethodsWithLastLoginInfo()

      const emailButton = await screen.findByText('Continuer avec mon e-mail')
      await user.press(emailButton)

      expect(navigate).toHaveBeenCalledWith('Login', {})
    })
  })

  describe('other login methods', () => {
    it('should navigate to LoginMethods when the other login methods button is clicked', async () => {
      renderLoginMethodsWithLastLoginInfo()

      const otherMethodsButton = await screen.findByText('Autres moyens de connexion')
      await user.press(otherMethodsButton)

      expect(navigate).toHaveBeenCalledWith('LoginMethods', {})
    })
  })

  describe('signup CTA', () => {
    it('should navigate to SignupMethods when the signup button is clicked', async () => {
      renderLoginMethodsWithLastLoginInfo()

      const signupButton = await screen.findByText('Créer un compte')
      await user.press(signupButton)

      expect(navigate).toHaveBeenCalledWith('SignupMethods', {})
    })

    it('should log analytics when the signup button is clicked', async () => {
      renderLoginMethodsWithLastLoginInfo()

      const signupButton = await screen.findByText('Créer un compte')
      await user.press(signupButton)

      expect(analytics.logSignUpClicked).toHaveBeenCalledWith({ from: 'loginMethods' })
    })
  })

  describe('generic SSO errors', () => {
    it('should display rate limit snackbar when too many attempts error occurs with Google', async () => {
      jest.mocked(getLastLoginInfo).mockResolvedValueOnce(LAST_LOGIN_INFO_GOOGLE)

      mockServer.postApi<SignInResponseFailure['content']>('/v2/oauth/google/authorize', {
        responseOptions: { statusCode: 429, data: { code: 'TOO_MANY_ATTEMPTS', general: [] } },
      })

      renderLoginMethodsWithLastLoginInfo()

      await user.press(await screen.findByTestId('Se connecter avec Google'))

      expect(screen.getByTestId('snackbar-error')).toBeOnTheScreen()
      expect(
        screen.getByText('Nombre de tentatives dépassé. Réessaye dans 1 minute.')
      ).toBeOnTheScreen()
    })

    it('should display network error snackbar when network request failed with Google', async () => {
      jest.mocked(getLastLoginInfo).mockResolvedValueOnce(LAST_LOGIN_INFO_GOOGLE)

      mockServer.postApi<SignInResponseFailure['content']>('/v2/oauth/google/authorize', {
        responseOptions: { statusCode: 500, data: { code: 'NETWORK_REQUEST_FAILED', general: [] } },
      })

      renderLoginMethodsWithLastLoginInfo()

      await user.press(await screen.findByTestId('Se connecter avec Google'))

      expect(screen.getByTestId('snackbar-error')).toBeOnTheScreen()
      expect(
        screen.getByText('Erreur réseau. Tu peux réessayer une fois la connexion réétablie.')
      ).toBeOnTheScreen()
    })

    it('should redirect to signup form when SSO email is not found', async () => {
      jest.mocked(getLastLoginInfo).mockResolvedValueOnce(LAST_LOGIN_INFO_GOOGLE)

      mockServer.postApi<SignInResponseFailure['content']>('/v2/oauth/google/authorize', {
        responseOptions: {
          statusCode: 401,
          data: {
            code: 'SSO_EMAIL_NOT_FOUND',
            general: [],
            accountCreationToken: 'accountCreationToken',
            email: 'user@gmail.com',
          },
        },
      })

      renderLoginMethodsWithLastLoginInfo()

      await user.press(await screen.findByTestId('Se connecter avec Google'))

      expect(navigate).toHaveBeenCalledWith('SignupForm', {
        accountCreationToken: 'accountCreationToken',
        email: 'user@gmail.com',
        from: StepperOrigin.LOGIN_METHODS,
        ssoProvider: Provider.GOOGLE,
      })
    })
  })

  describe('Apple SSO', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_APPLE_SSO])
      jest.mocked(getLastLoginInfo).mockResolvedValue(LAST_LOGIN_INFO_APPLE)
    })

    it('should sign in when Apple SSO button is clicked', async () => {
      mockServer.postApi<SigninResponseV2>('/v2/oauth/apple/authorize', {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        accountState: AccountState.ACTIVE,
      })

      mockMeApiCall({ showEligibleCard: false } as UserProfile)

      renderLoginMethodsWithLastLoginInfo()

      await user.press(await screen.findByText('Se connecter avec Apple'))

      expect(apiPostOAuthAuthorize).toHaveBeenCalledWith(
        {
          authorizationCode: 'mockAppleAuthCode',
          oauthStateToken: 'oauth_state_token',
          deviceInfo: { deviceId: '', os: undefined, source: undefined },
        },
        Provider.APPLE,
        { credentials: 'omit' }
      )
    })
  })

  describe('with route params', () => {
    beforeEach(() => useRoute.mockReturnValue({ params: { offerId: 1, from: StepperOrigin.HOME } }))

    it('should pass the route params to the Login screen', async () => {
      renderLoginMethodsWithLastLoginInfo()

      await user.press(await screen.findByText('Continuer avec mon e-mail'))

      expect(navigate).toHaveBeenCalledWith('Login', { offerId: 1, from: StepperOrigin.HOME })
    })
  })
})

const renderLoginMethodsWithLastLoginInfo = () => {
  return render(
    reactQueryProviderHOC(
      <AuthContext.Provider
        value={{
          isLoggedIn: false,
          setIsLoggedIn: jest.fn(),
          isUserLoading: false,
          refetchUser: jest.fn(),
        }}>
        <LoginMethodsWithLastLoginInfo />
      </AuthContext.Provider>
    )
  )
}

const mockMeApiCall = (response: UserProfile) => mockServer.getApi<UserProfile>('/v1/me', response)
