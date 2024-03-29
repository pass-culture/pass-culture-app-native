import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { TutorialRootStackParamList } from 'features/navigation/RootNavigator/types'
import { OnboardingAgeInformation } from 'features/tutorial/pages/onboarding/OnboardingAgeInformation'
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
    TutorialRootStackParamList,
    'OnboardingAgeInformation'
  >
  return render(reactQueryProviderHOC(<OnboardingAgeInformation {...navProps} />))
}
