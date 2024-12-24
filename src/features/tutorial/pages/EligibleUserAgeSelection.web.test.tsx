import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { TutorialRootStackParamList } from 'features/navigation/RootNavigator/types'
import { TutorialTypes } from 'features/tutorial/enums'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { EligibleUserAgeSelection } from './EligibleUserAgeSelection'

// I had to add this mock after adding the usage of useFeatureFlag to the EligibleUserAgeSelection screen, but I have no idea why?
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('<EligibleUserAgeSelection/>', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues for onboarding tutorial', async () => {
      const { container } = renderEligibleUserAgeSelection({ type: TutorialTypes.ONBOARDING })

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('should not have basic accessibility issues for profile tutorial', async () => {
      const { container } = renderEligibleUserAgeSelection({ type: TutorialTypes.PROFILE_TUTORIAL })

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

const renderEligibleUserAgeSelection = (navigationParams: { type: string }) => {
  const navProps = { route: { params: navigationParams } } as StackScreenProps<
    TutorialRootStackParamList,
    'EligibleUserAgeSelection'
  >
  return render(<EligibleUserAgeSelection {...navProps} />)
}
