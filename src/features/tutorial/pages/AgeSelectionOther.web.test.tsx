import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { TutorialRootStackParamList } from 'features/navigation/RootNavigator/types'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { AgeSelectionOther } from './AgeSelectionOther'

describe('<AgeSelectionOther/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues for onboarding tutorial', async () => {
      const { container } = renderAgeSelectionOther({ type: 'onboarding' })

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('should not have basic accessibility issues for profile tutorial', async () => {
      const { container } = renderAgeSelectionOther({ type: 'profileTutorial' })

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

const renderAgeSelectionOther = (navigationParams: { type: string }) => {
  const navProps = { route: { params: navigationParams } } as StackScreenProps<
    TutorialRootStackParamList,
    'AgeSelection'
  >
  return render(<AgeSelectionOther {...navProps} />)
}
