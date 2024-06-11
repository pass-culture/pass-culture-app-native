import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { AccessibilityDeclaration } from './AccessibilityDeclaration'

jest.mock('libs/firebase/analytics/analytics')

describe('<AccessibilityDeclaration />', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<AccessibilityDeclaration />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    }, 15_000) // we increase the timeout to 15s because axe-core can be slow on CI
  })
})
