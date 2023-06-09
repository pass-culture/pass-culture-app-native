import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { navigation } from '__mocks__/@react-navigation/native'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { act, checkAccessibilityFor, render, screen } from 'tests/utils/web'

import { SignupForm } from './SignupForm'

jest.mock('uuid', () => {
  let value = 0
  return {
    v1: jest.fn(),
    v4: jest.fn(() => value++),
  }
})

const defaultProps = {
  navigation,
  route: { name: 'SignupForm', key: '', params: { preventCancellation: false } },
} as unknown as StackScreenProps<RootStackParamList, 'SignupForm'>

const realUseState = React.useState
const mockUseState = jest.spyOn(React, 'useState')

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

describe('<SignupForm/>', () => {
  describe('Accessibility', () => {
    it.each`
      stepIndex | component
      ${0}      | ${'SetEmail'}
      ${1}      | ${'SetPassword'}
      ${2}      | ${'SetBirthday'}
      ${3}      | ${'AcceptCgu'}
    `('should not have basic accessibility issues for $component', async ({ stepIndex }) => {
      mockUseState.mockImplementationOnce(() => realUseState(stepIndex))

      const { container } = render(
        <SafeAreaProvider>
          <SignupForm {...defaultProps} />
        </SafeAreaProvider>
      )

      await screen.findByLabelText('Abandonner l’inscription')

      await act(async () => {
        const results = await checkAccessibilityFor(container)
        expect(results).toHaveNoViolations()
      })
    })
  })
})
