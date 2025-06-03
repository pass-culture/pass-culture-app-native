import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'

import { DeleteProfileAccountHacked } from './DeleteProfileAccountHacked'

jest.mock('libs/firebase/analytics/analytics')

describe('DeleteProfileAccountHacked', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<DeleteProfileAccountHacked />)
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
