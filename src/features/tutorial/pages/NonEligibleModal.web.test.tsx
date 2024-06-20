import React from 'react'

import { NonEligible, TutorialTypes } from 'features/tutorial/enums'
import { checkAccessibilityFor, render } from 'tests/utils/web'

import { NonEligibleModal } from './NonEligibleModal'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('<NonEligibleModal/>', () => {
  describe('Accessibility', () => {
    it('should render correctly for onboarding non-eligible under 15', async () => {
      const { container } = render(
        <NonEligibleModal
          visible
          hideModal={jest.fn()}
          userStatus={NonEligible.UNDER_15}
          type={TutorialTypes.ONBOARDING}
        />
      )

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('should render correctly for profile tutorial non-eligible under 15', async () => {
      const { container } = render(
        <NonEligibleModal
          visible
          hideModal={jest.fn()}
          userStatus={NonEligible.UNDER_15}
          type={TutorialTypes.PROFILE_TUTORIAL}
        />
      )

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('should render correctly for onboarding non-eligible over 18', async () => {
      const { container } = render(
        <NonEligibleModal
          visible
          hideModal={jest.fn()}
          userStatus={NonEligible.OVER_18}
          type={TutorialTypes.ONBOARDING}
        />
      )

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('should render correctly for profile tutorial non-eligible over 18', async () => {
      const { container } = render(
        <NonEligibleModal
          visible
          hideModal={jest.fn()}
          userStatus={NonEligible.OVER_18}
          type={TutorialTypes.PROFILE_TUTORIAL}
        />
      )

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
