import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { BookingNotFound } from './BookingNotFound'

describe('<BookingNotFound/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = await render(
        <BookingNotFound error={new Error('error')} resetErrorBoundary={() => null} />
      )
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
