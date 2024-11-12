import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { TutorialRootStackParamList } from 'features/navigation/RootNavigator/types'
import { TutorialTypes } from 'features/tutorial/enums'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { AgeSelection } from './AgeSelection'

describe('<AgeSelection/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues for onboarding tutorial', async () => {
      const { container } = renderAgeSelection({ type: TutorialTypes.ONBOARDING })

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('should not have basic accessibility issues for profile tutorial', async () => {
      const { container } = renderAgeSelection({ type: TutorialTypes.PROFILE_TUTORIAL })

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

const renderAgeSelection = (navigationParams: { type: string }) => {
  const navProps = { route: { params: navigationParams } } as StackScreenProps<
    TutorialRootStackParamList,
    'AgeSelection'
  >
  return render(<AgeSelection {...navProps} />)
}
