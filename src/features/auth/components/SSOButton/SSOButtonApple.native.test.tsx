// eslint-disable-next-line no-restricted-imports
import appleAuth from '@invertase/react-native-apple-authentication'
import React from 'react'
import DeviceInfo from 'react-native-device-info'

import * as API from 'api/api'
import { AccountState, OauthStateResponse, SigninResponse } from 'api/gen'
import { SSOButtonApple } from 'features/auth/components/SSOButton/SSOButtonApple'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { eventMonitoring } from 'libs/monitoring/services'
import { queryClient } from 'libs/react-query/queryClient'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'
import * as snackBarStoreModule from 'ui/designSystem/Snackbar/snackBar.store'

jest.mock('libs/monitoring/services')
jest.mock('libs/react-native-device-info/getDeviceId')
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({ dispatch: jest.fn() })),
}))

jest.mock('libs/network/NetInfoWrapper')

const apiPostOAuthAuthorize = jest.spyOn(API.api, 'postNativeV1OauthssoProviderAuthorize')
const getModelSpy = jest.spyOn(DeviceInfo, 'getModel')
const getSystemNameSpy = jest.spyOn(DeviceInfo, 'getSystemName')
const onSignInFailureSpy = jest.fn()
const showErrorSnackBarSpy = jest.spyOn(snackBarStoreModule, 'showErrorSnackBar')

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    resetSearch: jest.fn(),
  }),
}))

const user = userEvent.setup()
jest.useFakeTimers()

jest.mock('libs/firebase/analytics/analytics')

const useRemoteConfigSpy = jest.spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')

describe('<SSOButtonApple />', () => {
  beforeEach(() => {
    mockServer.getApi<OauthStateResponse>('/v1/oauth/state', {
      oauthStateToken: 'oauth_state_token',
    })
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_APPLE_SSO])
  })

  it('should sign in with device info when sso button is clicked', async () => {
    getModelSpy.mockReturnValueOnce('iPhone 13')
    getSystemNameSpy.mockReturnValueOnce('iOS')
    mockServer.postApi<SigninResponse>('/v1/oauth/apple/authorize', {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      accountState: AccountState.ACTIVE,
    })
    mockServer.getApi<UserProfileResponseWithoutSurvey>('/v1/me', beneficiaryUser)

    renderSSOButton()

    await user.press(await screen.findByTestId('S\u2019inscrire avec Apple'))

    expect(apiPostOAuthAuthorize).toHaveBeenCalledWith(
      {
        authorizationCode: 'mockAppleAuthCode',
        oauthStateToken: 'oauth_state_token',
        deviceInfo: {
          deviceId: 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
          os: 'iOS',
          source: 'iPhone 13',
          resolution: '750x1334',
          screenZoomLevel: undefined,
          fontScale: -1,
        },
      },
      'apple'
    )
  })

  it('should call onSignInFailure when signin fails', async () => {
    mockServer.postApi<SigninResponse>('/v1/oauth/apple/authorize', {
      responseOptions: { statusCode: 500 },
    })

    renderSSOButton()
    await user.press(await screen.findByTestId('S\u2019inscrire avec Apple'))

    expect(onSignInFailureSpy).toHaveBeenCalledWith({
      isSuccess: false,
      content: { code: 'NETWORK_REQUEST_FAILED', general: [] },
      provider: 'apple',
    })
  })

  it('should not show snackbar when sso login is cancelled by user', async () => {
    jest.spyOn(appleAuth, 'performRequest').mockRejectedValueOnce({
      code: appleAuth.Error.CANCELED,
      message: 'Sign in cancelled',
    })

    renderSSOButton()
    await user.press(await screen.findByTestId('S\u2019inscrire avec Apple'))

    expect(showErrorSnackBarSpy).not.toHaveBeenCalled()
  })

  it('should show snackbar when sso login fails', async () => {
    jest.spyOn(appleAuth, 'performRequest').mockRejectedValueOnce(new Error('Apple auth error'))

    renderSSOButton()
    await user.press(await screen.findByTestId('S\u2019inscrire avec Apple'))

    expect(showErrorSnackBarSpy).toHaveBeenCalledWith(
      'Une erreur est survenue, veuillez réessayer.'
    )
  })

  it('should log analytics when logging in with sso from signup', async () => {
    mockServer.postApi<SigninResponse>('/v1/oauth/apple/authorize', {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      accountState: AccountState.ACTIVE,
    })
    mockServer.getApi<UserProfileResponseWithoutSurvey>('/v1/me', beneficiaryUser)

    renderSSOButton()

    await user.press(await screen.findByTestId('S\u2019inscrire avec Apple'))

    expect(analytics.logLogin).toHaveBeenCalledWith({ method: 'fromSignup', type: 'SSO_signup' })
  })

  it('should log analytics when logging in with sso from login', async () => {
    mockServer.postApi<SigninResponse>('/v1/oauth/apple/authorize', {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      accountState: AccountState.ACTIVE,
    })
    mockServer.getApi<UserProfileResponseWithoutSurvey>('/v1/me', beneficiaryUser)

    renderSSOButton('login')

    await user.press(await screen.findByTestId('Se connecter avec Apple'))

    expect(analytics.logLogin).toHaveBeenCalledWith({ method: 'fromLogin', type: 'SSO_login' })
  })

  describe('When shouldLogInfo remote config is false', () => {
    beforeEach(() => {
      useRemoteConfigSpy.mockReturnValue({
        ...remoteConfigResponseFixture,
        data: {
          ...DEFAULT_REMOTE_CONFIG,
          shouldLogInfo: false,
        },
      })
    })

    it('should not log to Sentry on SSO login error', async () => {
      jest
        .spyOn(appleAuth, 'performRequest')
        .mockRejectedValueOnce(new Error('Apple Sign-In Error'))

      renderSSOButton()
      await user.press(await screen.findByTestId('S\u2019inscrire avec Apple'))

      expect(eventMonitoring.captureException).toHaveBeenCalledTimes(0)
    })
  })

  describe('When shouldLogInfo remote config is true', () => {
    beforeAll(() => {
      useRemoteConfigSpy.mockReturnValue({
        ...remoteConfigResponseFixture,
        data: {
          ...DEFAULT_REMOTE_CONFIG,
          shouldLogInfo: true,
        },
      })
    })

    afterAll(() => {
      queryClient.clear()
      useRemoteConfigSpy.mockReturnValue(remoteConfigResponseFixture)
    })

    it('should log to Sentry on SSO login error', async () => {
      jest
        .spyOn(appleAuth, 'performRequest')
        .mockRejectedValueOnce(new Error('Apple Sign-In Error'))

      renderSSOButton()
      await user.press(await screen.findByTestId('S\u2019inscrire avec Apple'))

      expect(eventMonitoring.captureException).toHaveBeenCalledWith(
        'Can\u2019t login via Apple: Apple Sign-In Error',
        { level: 'info', extra: { error: new Error('Apple Sign-In Error') } }
      )
    })
  })
})

const renderSSOButton = (type: 'signup' | 'login' = 'signup') => {
  render(reactQueryProviderHOC(<SSOButtonApple type={type} onSignInFailure={onSignInFailureSpy} />))
}
