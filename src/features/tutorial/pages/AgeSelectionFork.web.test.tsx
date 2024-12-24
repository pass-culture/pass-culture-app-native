import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { TutorialRootStackParamList } from 'features/navigation/RootNavigator/types'
import { TutorialTypes } from 'features/tutorial/enums'
import { AgeSelectionFork } from 'features/tutorial/pages/AgeSelectionFork'
import { checkAccessibilityFor, render } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('AgeSelectionFork', () => {
  it('should not have basic accessibility', async () => {
    useRoute.mockReturnValueOnce({ params: { type: TutorialTypes.ONBOARDING } })
    const { container } = renderAgeSelectionFork({ type: TutorialTypes.ONBOARDING })

    const results = await checkAccessibilityFor(container)

    expect(results).toHaveNoViolations()
  })
})

const renderAgeSelectionFork = (navigationParams: { type: string }) => {
  const navProps = { route: { params: navigationParams } } as StackScreenProps<
    TutorialRootStackParamList,
    'AgeSelectionFork'
  >
  return render(<AgeSelectionFork {...navProps} />)
}
