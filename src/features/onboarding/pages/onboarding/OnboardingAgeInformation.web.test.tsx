import { NativeStackScreenProps } from '@react-navigation/native-stack'
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
  const navProps = { route: { params: navigationParams } } as NativeStackScreenProps<
    OnboardingStackParamList,
    'OnboardingAgeInformation'
  >
  return render(reactQueryProviderHOC(<OnboardingAgeInformation {...navProps} />))
}
