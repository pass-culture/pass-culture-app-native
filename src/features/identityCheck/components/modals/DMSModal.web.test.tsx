import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'

import { DMSModal } from './DMSModal'

jest.mock('libs/firebase/analytics/analytics')

describe('<DMSModal/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<DMSModal visible hideModal={jest.fn()} />)
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
