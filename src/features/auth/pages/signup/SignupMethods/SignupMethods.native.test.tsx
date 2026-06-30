import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { api } from 'api/api'
import { AccountState, OauthStateResponse, SigninResponse } from 'api/gen'
import { SignInResponseFailure } from 'features/auth/types'
import { StepperOrigin } from 'features/navigation/navigators/RootNavigator/types'
import { UserProfile } from 'features/share/types'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/__mocks__/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { deviceInfoStoreActions } from 'shared/store/deviceInfoStore'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderAsync, screen, userEvent, waitForButtonToBePressable } from 'tests/utils'

import { SignupMethods } from './SignupMethods'

jest.mock('libs/network/NetInfoWrapper')
jest.mock('libs/firebase/analytics/analytics')

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({ resetSearch: jest.fn() }),
}))

jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({ dispatch: jest.fn() })),
}))

const apiPostOAuthAuthorize = jest.spyOn(api, 'postNativeV1OauthssoProviderAuthorize')

const deviceInfo = {
  deviceId: 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
  source: 'iPhone 13',
  os: 'iOS',
}

jest.useFakeTimers()
const user = userEvent.setup()

describe('<SignupMethods />', () => {
  beforeEach(() => {
    setFeatureFlags([])
    mockServer.getApi<OauthStateResponse>('/v1/oauth/state', {
      responseOptions: { data: { oauthStateToken: 'oauth_state_token' } },
    })
    deviceInfoStoreActions.setDeviceInfo(deviceInfo)
  })

  it('should render correctly', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_APPLE_SSO])
    await renderSignupMethods()

    expect(screen).toMatchSnapshot()
  })

  describe('generic SSO errors', () => {
    it('should display rate limit snackbar when too many attempts error occurs with Google', async () => {
      mockServer.postApi<SignInResponseFailure['content']>('/v1/oauth/google/authorize', {
        responseOptions: {
          statusCode: 429,
          data: { code: 'TOO_MANY_ATTEMPTS', general: [] },
        },
      })

      await renderSignupMethods()

      await user.press(await screen.findByTestId('S’inscrire avec Google'))

      expect(screen.getByTestId('snackbar-error')).toBeOnTheScreen()

      expect(
        screen.getByText('Nombre de tentatives dépassé. Réessaye dans 1 minute.')
      ).toBeOnTheScreen()
    })

    it('should display network error snackbar when network request failed', async () => {
      mockServer.postApi<SignInResponseFailure['content']>('/v1/oauth/google/authorize', {
        responseOptions: {
          statusCode: 500,
          data: { code: 'NETWORK_REQUEST_FAILED', general: [] },
        },
      })

      await renderSignupMethods()

      await user.press(await screen.findByTestId('S’inscrire avec Google'))

      expect(screen.getByTestId('snackbar-error')).toBeOnTheScreen()

      expect(
        screen.getByText('Erreur réseau. Tu peux réessayer une fois la connexion réétablie.')
      ).toBeOnTheScreen()
    })

    it('should fallback to SSO error message when error code is unknown', async () => {
      mockServer.postApi<SignInResponseFailure['content']>('/v1/oauth/google/authorize', {
        responseOptions: {
          statusCode: 500,
          data: {
            code: 'UNKNOWN_ERROR',
            general: [],
          } as unknown as SignInResponseFailure['content'],
        },
      })

      await renderSignupMethods()

      await user.press(await screen.findByTestId('S’inscrire avec Google'))

      expect(screen.getByTestId('snackbar-error')).toBeOnTheScreen()

      expect(screen.getByText('Erreur lors de la tentative de connexion')).toBeOnTheScreen()
    })
  })

  describe('for SSO Google method', () => {
    it('should sign in when sso button is clicked and sso account already exists', async () => {
      mockServer.postApi<SigninResponse>('/v1/oauth/google/authorize', {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        accountState: AccountState.ACTIVE,
      })
      mockServer.getApi<UserProfile>('/v1/me', beneficiaryUser)

      await renderSignupMethods()

      await pressSSOButton()

      expect(apiPostOAuthAuthorize).toHaveBeenCalledWith(
        {
          authorizationCode: 'mockServerAuthCode',
          oauthStateToken: 'oauth_state_token',
          deviceInfo,
        },
        'google',
        {
          credentials: 'omit',
        }
      )
    })

    it('should navigate to SignupMethods when clicking Google SSO button and account does not already exist', async () => {
      mockServer.postApi<SignInResponseFailure['content']>('/v1/oauth/google/authorize', {
        responseOptions: {
          statusCode: 401,
          data: {
            code: 'SSO_EMAIL_NOT_FOUND',
            accountCreationToken: 'accountCreationToken',
            email: 'user@gmail.com',
            general: [],
          },
        },
      })

      await renderSignupMethods()

      await user.press(screen.getByText('S’inscrire avec Google'))

      expect(navigate).toHaveBeenNthCalledWith(1, 'SignupForm', {
        accountCreationToken: 'accountCreationToken',
        email: 'user@gmail.com',
        from: StepperOrigin.SIGNUP_METHODS,
        ssoProvider: 'google',
      })
    })

    it('should display snackbar when Google SSO account is invalid', async () => {
      mockServer.postApi<SignInResponseFailure['content']>('/v1/oauth/google/authorize', {
        responseOptions: { data: { code: 'SSO_ERROR', general: [] }, statusCode: 400 },
      })

      await renderSignupMethods()

      await user.press(screen.getByText('S’inscrire avec Google'))

      expect(screen.getByTestId('snackbar-error')).toBeOnTheScreen()
      expect(
        screen.getByText(
          'L’inscription avec ce compte Google est refusée. Contacte le support pour plus d’informations depuis le Profil.'
        )
      ).toBeOnTheScreen()
    })

    it('should display rate limit snackbar when too many attempts error occurs', async () => {
      mockServer.postApi<SignInResponseFailure['content']>('/v1/oauth/google/authorize', {
        responseOptions: { statusCode: 429, data: { code: 'TOO_MANY_ATTEMPTS', general: [] } },
      })

      await renderSignupMethods()

      await user.press(screen.getByText('S’inscrire avec Google'))

      expect(screen.getByTestId('snackbar-error')).toBeOnTheScreen()

      expect(
        screen.getByText('Nombre de tentatives dépassé. Réessaye dans 1 minute.')
      ).toBeOnTheScreen()
    })
  })

  describe('for Apple SSO method', () => {
    beforeEach(() => setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_APPLE_SSO]))

    it('should display Apple SSO button when feature flag is enabled', async () => {
      await renderSignupMethods()

      expect(await screen.findByText('S’inscrire avec Apple')).toBeOnTheScreen()
    })

    it('should not display Apple SSO button when feature flag is disabled', async () => {
      setFeatureFlags([])
      await renderSignupMethods()

      expect(screen.queryByText('S’inscrire avec Apple')).not.toBeOnTheScreen()
    })

    it('should navigate to SignupMethods when clicking Apple SSO button and account does not already exist', async () => {
      mockServer.postApi<SignInResponseFailure['content']>('/v1/oauth/apple/authorize', {
        responseOptions: {
          statusCode: 401,
          data: {
            code: 'SSO_EMAIL_NOT_FOUND',
            accountCreationToken: 'accountCreationToken',
            email: 'user@gmail.com',
            general: [],
          },
        },
      })

      await renderSignupMethods()

      await user.press(screen.getByText('S’inscrire avec Apple'))

      expect(navigate).toHaveBeenNthCalledWith(1, 'SignupForm', {
        accountCreationToken: 'accountCreationToken',
        email: 'user@gmail.com',
        from: StepperOrigin.SIGNUP_METHODS,
        ssoProvider: 'apple',
      })
    })

    it('should display snackbar when Apple SSO account is invalid', async () => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_APPLE_SSO])
      mockServer.postApi<SignInResponseFailure['content']>('/v1/oauth/apple/authorize', {
        responseOptions: { data: { code: 'SSO_ERROR', general: [] }, statusCode: 400 },
      })

      await renderSignupMethods()

      await user.press(screen.getByText('S’inscrire avec Apple'))

      expect(screen.getByTestId('snackbar-error')).toBeOnTheScreen()
      expect(
        screen.getByText(
          'L’inscription avec ce compte Apple est refusée. Contacte le support pour plus d’informations depuis le Profil.'
        )
      ).toBeOnTheScreen()
    })
  })

  describe('for email method', () => {
    it('should navigate to Login when "S’inscrire avec mon e-mail" is clicked', async () => {
      await renderSignupMethods()

      await user.press(screen.getByText('S’inscrire avec mon e-mail'))

      expect(navigate).toHaveBeenNthCalledWith(1, 'SignupForm', {})
    })
  })

  describe('for login method', () => {
    it('should navigate to LoginMethods when "Se connecter" is clicked', async () => {
      await renderSignupMethods()

      await user.press(screen.getByText('Se connecter'))

      expect(navigate).toHaveBeenNthCalledWith(1, 'LoginMethods', {})
    })

    it('should log analytics event when "Se connecter" is clicked', async () => {
      await renderSignupMethods()

      await user.press(screen.getByText('Se connecter'))

      expect(analytics.logLoginClicked).toHaveBeenNthCalledWith(1, { from: 'signupMethods' })
    })
  })
})

const renderSignupMethods = async () => {
  await renderAsync(reactQueryProviderHOC(<SignupMethods />))
}

const pressSSOButton = async () => {
  const SSOButton = await screen.findByTestId('S’inscrire avec Google')
  await waitForButtonToBePressable(SSOButton)
  await user.press(SSOButton)
}
