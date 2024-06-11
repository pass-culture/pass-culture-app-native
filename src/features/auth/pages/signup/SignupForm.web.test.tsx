import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
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

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

const realUseState = React.useState
const mockUseState = jest.spyOn(React, 'useState')

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    resetSearch: jest.fn(),
  }),
}))

jest.mock('libs/firebase/analytics/analytics')

describe('<SignupForm/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues for SetEmail', async () => {
      const { container } = renderSignupForm()
      await act(async () => {})

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it.each`
      stepIndex | component
      ${1}      | ${'SetPassword'}
      ${2}      | ${'SetBirthday'}
      ${3}      | ${'AcceptCgu'}
    `('should not have basic accessibility issues for $component', async ({ stepIndex }) => {
      mockUseState.mockImplementationOnce(() => realUseState(stepIndex))
      mockUseState.mockImplementationOnce(() => realUseState(stepIndex))

      const { container } = renderSignupForm()
      await act(async () => {})

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

const renderSignupForm = () =>
  render(
    reactQueryProviderHOC(
      <SafeAreaProvider>
        <SignupForm />
      </SafeAreaProvider>
    )
  )
