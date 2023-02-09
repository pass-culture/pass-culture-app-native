import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { DMSModal } from './DMSModal'

describe('<DMSModal/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<DMSModal visible hideModal={jest.fn()} />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
