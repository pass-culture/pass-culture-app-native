// eslint-disable-next-line no-restricted-imports
import { GoogleOAuthProvider } from '@react-oauth/google'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { useRoute } from '__mocks__/@react-navigation/native'
import { EmailValidationRemainingResendsResponse, OauthStateResponse } from 'api/gen'
import { StepperOrigin } from 'features/navigation/navigators/RootNavigator/types'
import { env } from 'libs/environment/fixtures'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render } from 'tests/utils/web'

import { SignupForm } from './SignupForm'

// Fix the error "IDs used in ARIA and labels must be unique (duplicate-id-aria)" because the UUIDV4 mock return "testUuidV4"
jest.mock('uuid', () => {
  let value = 0
  return {
    v1: jest.fn(),
    v4: jest.fn(() => value++),
  }
})

jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({ dispatch: jest.fn() })),
}))

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    resetSearch: jest.fn(),
  }),
}))

jest.mock('libs/firebase/analytics/analytics')

describe('<SignupForm/>', () => {
  beforeEach(() => {
    setFeatureFlags()
    mockServer.getApi<EmailValidationRemainingResendsResponse>(
      '/v1/email_validation_remaining_resends/email%40gmail.com',
      {
        remainingResends: 3,
      }
    )
    useRoute.mockReturnValue({ params: { from: StepperOrigin.HOME } })

    mockServer.getApi<OauthStateResponse>('/v1/oauth/state', {
      responseOptions: { data: { oauthStateToken: 'oauth_state_token' } },
      requestOptions: { persist: true },
    })
  })

  describe('Accessibility', () => {
    it.each`
      stepIndex | component
      ${0}      | ${'SetEmail'}
      ${1}      | ${'SetPassword'}
      ${2}      | ${'SetBirthday'}
      ${3}      | ${'AcceptCgu'}
    `('should not have basic accessibility issues for $component', async ({ stepIndex }) => {
      const { container } = renderSignupForm(stepIndex)

      await act(async () => {})

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

const renderSignupForm = (currentStep?: number) =>
  render(
    reactQueryProviderHOC(
      // @ts-expect-error - type incompatibility with React 19
      <GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID}>
        <SafeAreaProvider>
          <SignupForm currentStep={currentStep} />
        </SafeAreaProvider>
      </GoogleOAuthProvider>
    )
  )
