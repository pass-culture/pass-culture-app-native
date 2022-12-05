import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { OnboardingRootStackParamList } from 'features/navigation/RootNavigator/types'
import { AgeInformation } from 'features/onboarding/pages/AgeInformation'
import { CreditStatus } from 'features/onboarding/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render } from 'tests/utils'

const AGES = [15, 16, 17, 18]

describe('AgeInformation', () => {
  it.each(AGES)('should render correctly for %s-year-old', (age) => {
    const renderAPI = renderAgeInformation({ age })
    expect(renderAPI).toMatchSnapshot()
  })

  it.each(AGES)('should only display one active block for %s-year-old', (age) => {
    const { queryAllByText } = renderAgeInformation({ age })
    const ongoingTags = queryAllByText(CreditStatus.ONGOING)

    expect(ongoingTags).toHaveLength(1)
  })

  it.each(AGES)('should only display correct amount of inactive blocks for %s-year-old', (age) => {
    const { queryAllByText } = renderAgeInformation({ age })
    const goneTags = queryAllByText(CreditStatus.GONE)

    expect(goneTags).toHaveLength(age - 15)
  })

  it.each(AGES)(
    'should only display correct amount of coming credit blocks for %s-year-old',
    (age) => {
      const { queryAllByText } = renderAgeInformation({ age })
      const comingTags = queryAllByText(CreditStatus.COMING)

      expect(comingTags).toHaveLength(18 - age)
    }
  )
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
