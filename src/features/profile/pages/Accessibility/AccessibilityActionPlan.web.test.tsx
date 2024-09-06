import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'

import { AccessibilityActionPlan } from './AccessibilityActionPlan'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('<AccessibilityActionPlan/>', () => {
  describe('Accessibility', () => {
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('should not have basic accessibility issues', async () => {
      const { container } = render(<AccessibilityActionPlan />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
