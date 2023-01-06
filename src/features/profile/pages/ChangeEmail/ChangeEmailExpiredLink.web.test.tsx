import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { ChangeEmailExpiredLink } from './ChangeEmailExpiredLink'

describe('<ChangeEmailExpiredLink/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<ChangeEmailExpiredLink />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
