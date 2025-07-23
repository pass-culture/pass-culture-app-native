import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'

import { AccessibilityActionPlan } from './AccessibilityActionPlan'

jest.setTimeout(20000) // to avoid exceeded timeout

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/src/private/animated/NativeAnimatedHelper')

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}))

const TEST_TIMEOUT_IN_MS = 15000
jest.setTimeout(TEST_TIMEOUT_IN_MS)

describe('<AccessibilityActionPlan/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<AccessibilityActionPlan />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
