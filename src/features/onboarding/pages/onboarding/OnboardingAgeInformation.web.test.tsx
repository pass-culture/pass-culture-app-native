import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { OnboardingStackParamList } from 'features/navigation/OnboardingStackNavigator/OnboardingStackTypes'
import { OnboardingAgeInformation } from 'features/onboarding/pages/onboarding/OnboardingAgeInformation'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render } from 'tests/utils/web'

const AGES = [15, 16, 17, 18]

describe('OnboardingAgeInformation', () => {
  it.each(AGES)('should render null in web', (age) => {
    const { container } = renderOnboardingAgeInformation({ age })

    expect(container).toBeEmptyDOMElement()
  })
})

const renderOnboardingAgeInformation = (navigationParams: { age: number }) => {
  const navProps = { route: { params: navigationParams } } as StackScreenProps<
    OnboardingStackParamList,
    'OnboardingAgeInformation'
  >
  return render(reactQueryProviderHOC(<OnboardingAgeInformation {...navProps} />))
}
