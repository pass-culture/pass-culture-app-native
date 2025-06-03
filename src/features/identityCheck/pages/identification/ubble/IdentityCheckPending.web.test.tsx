import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { IdentityCheckPending } from './IdentityCheckPending'

jest.mock('libs/firebase/analytics/analytics')

describe('<IdentityCheckPending/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<IdentityCheckPending />)
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
