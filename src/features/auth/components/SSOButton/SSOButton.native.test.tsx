// eslint-disable-next-line no-restricted-imports
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import React from 'react'
import DeviceInfo from 'react-native-device-info'

import * as API from 'api/api'
import { AccountState, OauthStateResponse, SigninResponse, UserProfileResponse } from 'api/gen'
import { SSOButton } from 'features/auth/components/SSOButton/SSOButton'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import * as useRemoteConfigContext from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { eventMonitoring } from 'libs/monitoring'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

jest.mock('libs/monitoring')
jest.mock('libs/react-native-device-info/getDeviceId')
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({ dispatch: jest.fn() })),
}))

jest.mock('libs/network/NetInfoWrapper')

const apiPostGoogleAuthorize = jest.spyOn(API.api, 'postNativeV1OauthGoogleAuthorize')
const getModelSpy = jest.spyOn(DeviceInfo, 'getModel')
const getSystemNameSpy = jest.spyOn(DeviceInfo, 'getSystemName')
const onSignInFailureSpy = jest.fn()

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    resetSearch: jest.fn(),
  }),
}))

jest.useFakeTimers()

jest.mock('libs/firebase/analytics/analytics')

const useRemoteConfigContextSpy = jest.spyOn(useRemoteConfigContext, 'useRemoteConfigContext')

describe('<SSOButton />', () => {
  beforeEach(() => {
    mockServer.getApi<OauthStateResponse>('/v1/oauth/state', {
      oauthStateToken: 'oauth_state_token',
    })
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_GOOGLE_SSO])
  })

  it('should sign in with device info when sso button is clicked', async () => {
    getModelSpy.mockReturnValueOnce('iPhone 13')
    getSystemNameSpy.mockReturnValueOnce('iOS')
    mockServer.postApi<SigninResponse>('/v1/oauth/google/authorize', {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      accountState: AccountState.ACTIVE,
    })
    mockServer.getApi<UserProfileResponse>('/v1/me', beneficiaryUser)

    renderSSOButton()

    await act(async () => fireEvent.press(await screen.findByTestId('S’inscrire avec Google')))

    expect(apiPostGoogleAuthorize).toHaveBeenCalledWith({
      authorizationCode: 'mockServerAuthCode',
      oauthStateToken: 'oauth_state_token',
      deviceInfo: {
        deviceId: 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
        os: 'iOS',
        source: 'iPhone 13',
      },
    })
  })

  it('should call onSignInFailure when signin fails', async () => {
    mockServer.postApi<SigninResponse>('/v1/oauth/google/authorize', {
      responseOptions: { statusCode: 500 },
    })

    renderSSOButton()
    await act(async () => fireEvent.press(await screen.findByTestId('S’inscrire avec Google')))

    expect(onSignInFailureSpy).toHaveBeenCalledWith({
      isSuccess: false,
      content: { code: 'NETWORK_REQUEST_FAILED', general: [] },
    })
  })

  it('should log analytics when logging in with sso from signup', async () => {
    mockServer.postApi<SigninResponse>('/v1/oauth/google/authorize', {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      accountState: AccountState.ACTIVE,
    })
    mockServer.getApi<UserProfileResponse>('/v1/me', beneficiaryUser)

    renderSSOButton()

    await act(async () => fireEvent.press(await screen.findByTestId('S’inscrire avec Google')))

    expect(analytics.logLogin).toHaveBeenCalledWith({ method: 'fromSignup', type: 'SSO_signup' })
  })

  it('should log analytics when logging in with sso from login', async () => {
    mockServer.postApi<SigninResponse>('/v1/oauth/google/authorize', {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      accountState: AccountState.ACTIVE,
    })
    mockServer.getApi<UserProfileResponse>('/v1/me', beneficiaryUser)

    renderSSOButton('login')

    await act(async () => fireEvent.press(await screen.findByTestId('Se connecter avec Google')))

    expect(analytics.logLogin).toHaveBeenCalledWith({ method: 'fromLogin', type: 'SSO_login' })
  })

  describe('When shouldLogInfo remote config is false', () => {
    beforeAll(() => {
      useRemoteConfigContextSpy.mockReturnValue({
        ...DEFAULT_REMOTE_CONFIG,
        shouldLogInfo: false,
      })
    })

    it('should not log to Sentry on SSO login error', async () => {
      jest.spyOn(GoogleSignin, 'signIn').mockRejectedValueOnce('GoogleSignIn Error')

      renderSSOButton()
      await act(async () => fireEvent.press(await screen.findByTestId('S’inscrire avec Google')))

      expect(eventMonitoring.captureException).toHaveBeenCalledTimes(0)
    })
  })

  describe('When shouldLogInfo remote config is true', () => {
    beforeAll(() => {
      useRemoteConfigContextSpy.mockReturnValue({
        ...DEFAULT_REMOTE_CONFIG,
        shouldLogInfo: true,
      })
    })

    afterAll(() => {
      useRemoteConfigContextSpy.mockReturnValue(DEFAULT_REMOTE_CONFIG)
    })

    it('should log to Sentry on SSO login error', async () => {
      jest.spyOn(GoogleSignin, 'signIn').mockRejectedValueOnce('GoogleSignIn Error')

      renderSSOButton()
      await act(async () => fireEvent.press(await screen.findByTestId('S’inscrire avec Google')))

      expect(eventMonitoring.captureException).toHaveBeenCalledWith(
        'Can’t login via Google: GoogleSignIn Error',
        { level: 'info', extra: { error: 'GoogleSignIn Error' } }
      )
    })
  })
})

const renderSSOButton = (type: 'signup' | 'login' = 'signup') => {
  render(reactQueryProviderHOC(<SSOButton type={type} onSignInFailure={onSignInFailureSpy} />))
}
