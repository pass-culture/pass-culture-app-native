import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { AccessibilityDeclaration } from './AccessibilityDeclaration'

// TODO(PC-21801): temporary skip this flaky test until github actions migration
describe.skip('<AccessibilityDeclaration />', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<AccessibilityDeclaration />)

      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
