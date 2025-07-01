import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'

import { DeleteProfileContactSupport } from './DeleteProfileContactSupport'

jest.mock('libs/firebase/analytics/analytics')

describe('DeleteProfileContactSupport', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<DeleteProfileContactSupport />)
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
