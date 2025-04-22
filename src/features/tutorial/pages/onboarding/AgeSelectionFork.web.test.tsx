import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { OnboardingStackParamList } from 'features/navigation/OnboardingStackNavigator/OnboardingStackTypes'
import { AgeSelectionFork } from 'features/tutorial/pages/onboarding/AgeSelectionFork'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { checkAccessibilityFor, render } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('AgeSelectionFork', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should not have basic accessibility', async () => {
    const { container } = renderAgeSelectionFork()

    const results = await checkAccessibilityFor(container)

    expect(results).toHaveNoViolations()
  })
})

const renderAgeSelectionFork = () => {
  const navProps = {} as StackScreenProps<OnboardingStackParamList, 'AgeSelectionFork'>
  return render(<AgeSelectionFork {...navProps} />)
}
