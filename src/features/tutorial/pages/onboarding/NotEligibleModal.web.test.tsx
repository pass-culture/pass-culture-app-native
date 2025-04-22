import React from 'react'

import { NonEligible } from 'features/tutorial/enums'
import { checkAccessibilityFor, render } from 'tests/utils/web'

import { NotEligibleModal } from './NotEligibleModal'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('<NotEligibleModal/>', () => {
  describe('Accessibility', () => {
    it('should render correctly for onboarding', async () => {
      const { container } = render(
        <NotEligibleModal visible userStatus={NonEligible.UNDER_15} hideModal={jest.fn()} />
      )

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
