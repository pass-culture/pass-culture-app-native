import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { PhoneValidationTipsModal } from './PhoneValidationTipsModal'

describe('<PhoneValidationTipsModal/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <PhoneValidationTipsModal isVisible dismissModal={jest.fn()} onGoBack={jest.fn()} />
      )
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
