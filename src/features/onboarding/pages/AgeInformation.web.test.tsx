import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { OnboardingRootStackParamList } from 'features/navigation/RootNavigator/types'
import { AgeInformation } from 'features/onboarding/pages/AgeInformation'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render } from 'tests/utils/web'

const AGES = [15, 16, 17, 18]

describe('AgeInformation', () => {
  it.each(AGES)('should render null in web', (age) => {
    const { container } = renderAgeInformation({ age })
    expect(container).toBeEmptyDOMElement()
  })
})

const renderAgeInformation = (navigationParams: { age: number }) => {
  const navProps = { route: { params: navigationParams } } as StackScreenProps<
    OnboardingRootStackParamList,
    'AgeInformation'
  >
  return render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(<AgeInformation {...navProps} />)
  )
}
