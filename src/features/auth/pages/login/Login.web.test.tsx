import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { useRoute } from '__mocks__/@react-navigation/native'
import { AccountState, SigninResponse, UserProfileResponse } from 'api/gen'
import { AuthContext } from 'features/auth/context/AuthContext'
import { navigateToHome } from 'features/navigation/helpers'
import { nonBeneficiaryUser } from 'fixtures/user'
import { env } from 'libs/environment/__mocks__/envFixtures'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { GoogleOAuthProvider } from 'libs/react-native-google-sso/GoogleOAuthProvider'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, fireEvent, render, screen } from 'tests/utils/web'
import { SnackBarProvider } from 'ui/components/snackBar/SnackBarContext'

import { Login } from './Login'

jest.mock('features/navigation/helpers')

jest.mock('uuid', () => {
  let value = 0
  return {
    v1: jest.fn(),
    v4: jest.fn(() => value++),
  }
})

jest.mock('@react-oauth/google', () => ({
  ...jest.requireActual('@react-oauth/google'),
  useGoogleLogin: jest.fn(({ onSuccess }) => {
    return () => onSuccess({ code: 'ssoAuthorizationCode' })
  }),
}))

const mockIdentityCheckDispatch = jest.fn()
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({ dispatch: mockIdentityCheckDispatch })),
}))

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

describe('<Login/>', () => {
  beforeEach(() => {
    useFeatureFlagSpy.mockReturnValue(false)
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      useRoute.mockReturnValueOnce({ params: { displayForcedLoginHelpMessage: true } })
      const { container } = renderLogin()

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })

  it('should redirect to home when google login is successful', async () => {
    // We have to mock the return value this way due to multiple rerenders
    // eslint-disable-next-line local-rules/independent-mocks
    useFeatureFlagSpy.mockReturnValue(true)
    mockServer.postApiV1<SigninResponse>('/oauth/google/authorize', {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      accountState: AccountState.ACTIVE,
    })
    mockServer.getApiV1<UserProfileResponse>('/me', {
      ...nonBeneficiaryUser,
      needsToFillCulturalSurvey: false,
    })
    renderLogin()

    await act(async () => fireEvent.click(screen.getByTestId('SSO Google')))

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })

  it('should display forced login help message when the query param is given', async () => {
    useRoute.mockReturnValueOnce({ params: { displayForcedLoginHelpMessage: true } })
    renderLogin()

    await act(async () => {}) // Warning: An update to Login inside a test was not wrapped in act(...)

    const snackBar = await screen.findByRole('status')

    expect(snackBar).toHaveTextContent(
      'Pour sécuriser ton pass Culture, tu dois confirmer tes identifiants tous les 30 jours.'
    )
  })

  it('should not display the login help message when the query param is not given', async () => {
    useRoute.mockReturnValueOnce({})
    renderLogin()

    await act(async () => {}) // Warning: An update to Login inside a test was not wrapped in act(...)

    const snackBar = await screen.findByRole('status')

    expect(snackBar).not.toHaveTextContent(
      'Pour sécuriser ton pass Culture, tu dois confirmer tes identifiants tous les 30 jours.'
    )
  })
})

function renderLogin() {
  return render(
    reactQueryProviderHOC(
      <SafeAreaProvider>
        <SnackBarProvider>
          <AuthContext.Provider
            value={{
              isLoggedIn: true,
              setIsLoggedIn: jest.fn(),
              isUserLoading: false,
              refetchUser: jest.fn(),
            }}>
            <GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID}>
              <Login />
            </GoogleOAuthProvider>
          </AuthContext.Provider>
        </SnackBarProvider>
      </SafeAreaProvider>
    )
  )
}
