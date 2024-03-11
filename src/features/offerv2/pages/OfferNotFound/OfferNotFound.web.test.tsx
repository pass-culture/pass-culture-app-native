import React from 'react'

import { OfferNotFound } from 'features/offerv2/pages/OfferNotFound/OfferNotFound'
import { checkAccessibilityFor, render } from 'tests/utils/web'

const resetErrorBoundary = () => null
const error = new Error('error')

describe('<OfferNotFound/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <OfferNotFound resetErrorBoundary={resetErrorBoundary} error={error} />
      )

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
