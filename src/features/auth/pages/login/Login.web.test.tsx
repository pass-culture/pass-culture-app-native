// eslint-disable-next-line no-restricted-imports
import { GoogleOAuthProvider } from '@react-oauth/google'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { useRoute } from '__mocks__/@react-navigation/native'
import { OauthStateResponse } from 'api/gen'
import { AuthContext } from 'features/auth/context/AuthContext'
import { env } from 'libs/environment/fixtures'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render } from 'tests/utils/web'
import { SnackBarProvider } from 'ui/components/snackBar/SnackBarContext'

import { Login } from './Login'

// This mock returns different values to avoid the error : "IDs used in ARIA and labels must be unique (duplicate-id-aria)" because the UUIDV4 mock return "testUuidV4"
jest.mock('uuid', () => {
  let value = 0
  return {
    v1: jest.fn(),
    v4: jest.fn(() => value++),
  }
})

const mockIdentityCheckDispatch = jest.fn()
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({ dispatch: mockIdentityCheckDispatch })),
}))

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    resetSearch: jest.fn(),
  }),
}))

jest.mock('libs/firebase/analytics/analytics')

describe('<Login/>', () => {
  beforeEach(() => {
    setFeatureFlags()
    mockServer.getApi<OauthStateResponse>('/v1/oauth/state', {
      oauthStateToken: 'oauth_state_token',
    })
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
