import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import * as API from 'api/api'
import {
  AccountState,
  FavoriteResponse,
  OauthStateResponse,
  SigninResponse,
  SigninResponseV2,
} from 'api/gen'
import { AuthContext } from 'features/auth/context/AuthContext'
import { SignInResponseFailure } from 'features/auth/types'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { StepperOrigin } from 'features/navigation/navigators/RootNavigator/types'
import { UserProfile } from 'features/share/types'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { storage } from 'libs/storage'
import { deviceInfoStoreActions } from 'shared/store/deviceInfoStore'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

import { LoginMethods } from './LoginMethods'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/network/NetInfoWrapper')
jest.mock('libs/monitoring/services')
jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/helpers/usePreviousRouteName')

const mockResetSearch = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: jest.fn(() => ({ resetSearch: mockResetSearch })),
}))

const mockIdentityCheckDispatch = jest.fn()
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({ dispatch: mockIdentityCheckDispatch })),
}))

const apiPostOAuthAuthorize = jest.spyOn(API.api, 'postNativeV1OauthssoProviderAuthorize')

jest.useFakeTimers()
const user = userEvent.setup()

describe('<LoginMethods/>', () => {
  beforeEach(() => {
    setFeatureFlags([])
    mockServer.postApi<FavoriteResponse>('/v1/me/favorites', favoriteResponseSnap)
    mockServer.getApi<OauthStateResponse>('/v1/oauth/state', {
      oauthStateToken: 'oauth_state_token',
    })
    simulateSignin200(AccountState.ACTIVE)
    mockMeApiCall({ showEligibleCard: false } as UserProfile)
    deviceInfoStoreActions.setDeviceInfo({
      deviceId: 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
      source: 'iPhone 13',
      os: 'iOS',
    })
  })

  afterEach(async () => {
    await storage.clear('has_seen_eligible_card')
  })

  it('should render correctly', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_APPLE_SSO])
    renderLogin()

    await screen.findByText('Méthode recommandée')

    expect(screen).toMatchSnapshot()
  })

  it('should log analytics on render', async () => {
    useRoute.mockReturnValueOnce({ params: { from: StepperOrigin.PROFILE } })
    renderLogin()

    await screen.findByText('Méthode recommandée')

    expect(analytics.logStepperDisplayed).toHaveBeenNthCalledWith(
      1,
      StepperOrigin.PROFILE,
      'LoginMethods'
    )
  })

  describe('with Google SSO', () => {
    it('should sign in when SSO button is clicked with device info', async () => {
      mockServer.postApi<SigninResponse>('/v1/oauth/google/authorize', {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        accountState: AccountState.ACTIVE,
      })

      renderLogin()

      await user.press(await screen.findByTestId('Se connecter avec Google'))

      expect(apiPostOAuthAuthorize).toHaveBeenCalledWith(
        {
          authorizationCode: 'mockServerAuthCode',
          oauthStateToken: 'oauth_state_token',
          deviceInfo: {
            deviceId: 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
            os: 'iOS',
            source: 'iPhone 13',
          },
        },
        'google'
      )
    })

    it('should show snackbar when SSO login fails because account is invalid', async () => {
      mockServer.postApi<SignInResponseFailure['content']>('/v1/oauth/google/authorize', {
        responseOptions: { statusCode: 400, data: { code: 'SSO_ERROR', general: [] } },
      })

      renderLogin()

      await user.press(await screen.findByTestId('Se connecter avec Google'))

      expect(
        screen.getByText(
          'La connexion avec ton compte Google est refusée. Contacte le support pour plus d’informations depuis le Profil.'
        )
      ).toBeOnTheScreen()
    })

    it('should redirect to signup form when SSO login fails because user does not exist', async () => {
      mockServer.postApi<SignInResponseFailure['content']>('/v1/oauth/google/authorize', {
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

      renderLogin()

      await user.press(await screen.findByTestId('Se connecter avec Google'))

      expect(navigate).toHaveBeenCalledWith('SignupForm', {
        accountCreationToken: 'accountCreationToken',
        email: 'user@gmail.com',
        from: StepperOrigin.LOGIN,
        ssoProvider: 'google',
      })
    })

    it('should log analytics when signing in with SSO', async () => {
      mockServer.postApi<SigninResponse>('/v1/oauth/google/authorize', {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        accountState: AccountState.ACTIVE,
      })

      renderLogin()

      await user.press(await screen.findByTestId('Se connecter avec Google'))

      expect(analytics.logLogin).toHaveBeenCalledWith({
        method: 'fromLoginGoogle',
        type: 'SSO_login',
      })
    })
  })

  describe('with Apple SSO', () => {
    it('should show snackbar when Apple SSO login fails because account is invalid', async () => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_APPLE_SSO])
      mockServer.postApi<SignInResponseFailure['content']>('/v1/oauth/apple/authorize', {
        responseOptions: { statusCode: 400, data: { code: 'SSO_ERROR', general: [] } },
      })
      renderLogin()

      await user.press(await screen.findByText('Se connecter avec Apple'))

      expect(
        screen.getByText(
          'La connexion avec ton compte Apple est refusée. Contacte le support pour plus d’informations depuis le Profil.'
        )
      ).toBeOnTheScreen()
    })

    it('should display Apple SSO button when Apple SSO feature flag is enabled', async () => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_APPLE_SSO])
      renderLogin()

      expect(await screen.findByText('Se connecter avec Apple')).toBeOnTheScreen()
    })

    it('should not display Apple SSO button when Apple SSO feature flag is disabled', async () => {
      renderLogin()

      await screen.findByText('Méthode recommandée')

      expect(screen.queryByText('Se connecter avec Apple')).not.toBeOnTheScreen()
    })
  })

  describe('with email', () => {
    it('should navigate to Login when "Continuer avec mon e-mail" is clicked', async () => {
      renderLogin()
      await screen.findByText('Méthode recommandée')

      await user.press(screen.getByText('Continuer avec mon e-mail'))

      expect(navigate).toHaveBeenNthCalledWith(1, 'Login', {})
    })
  })
})

function renderLogin() {
  return render(
    reactQueryProviderHOC(
      <AuthContext.Provider
        value={{
          isLoggedIn: false,
          setIsLoggedIn: jest.fn(),
          isUserLoading: false,
          refetchUser: jest.fn(),
        }}>
        <LoginMethods />
      </AuthContext.Provider>
    )
  )
}

function mockMeApiCall(response: UserProfile) {
  mockServer.getApi<UserProfile>('/v1/me', response)
}

function simulateSignin200(accountState: AccountState) {
  mockServer.postApi<SigninResponseV2>('/v2/signin', {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    accountState,
  })
}
