import React from 'react'

import { NonEligible, TutorialTypes } from 'features/tutorial/enums'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { checkAccessibilityFor, render } from 'tests/utils/web'

import { NonEligibleModal } from './NonEligibleModal'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('<NonEligibleModal/>', () => {
  beforeEach(() => setFeatureFlags())

  describe('Accessibility', () => {
    it('should render correctly for onboarding', async () => {
      const { container } = render(
        <NonEligibleModal
          visible
          userStatus={NonEligible.UNDER_15}
          hideModal={jest.fn()}
          type={TutorialTypes.ONBOARDING}
        />
      )

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('should render correctly for profile tutorial', async () => {
      const { container } = render(
        <NonEligibleModal
          userStatus={NonEligible.UNDER_15}
          visible
          hideModal={jest.fn()}
          type={TutorialTypes.PROFILE_TUTORIAL}
        />
      )

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
