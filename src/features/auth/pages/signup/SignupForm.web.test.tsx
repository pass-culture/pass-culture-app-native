import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render, screen, waitFor } from 'tests/utils/web'

import { SignupForm } from './SignupForm'

jest.mock('uuid', () => {
  let value = 0
  return {
    v1: jest.fn(),
    v4: jest.fn(() => value++),
  }
})

const realUseState = React.useState
const mockUseState = jest.spyOn(React, 'useState')

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

describe('<SignupForm/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues for SetEmail', async () => {
      const { container } = renderSignupForm()
      await act(async () => {})

      await waitFor(() => {
        expect(screen.getByTestId('Entrée pour l’email')).toHaveFocus()
      })

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
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <SafeAreaProvider>
        <SignupForm />
      </SafeAreaProvider>
    )
  )
