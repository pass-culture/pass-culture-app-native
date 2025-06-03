import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'

import { AccessibilityDeclarationMobile } from './AccessibilityDeclarationMobile'

jest.mock('libs/firebase/analytics/analytics')

describe('<AccessibilityDeclarationMobile />', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<AccessibilityDeclarationMobile />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    }, 15_000) // we increase the timeout to 15s because axe-core can be slow on CI
  })
})
