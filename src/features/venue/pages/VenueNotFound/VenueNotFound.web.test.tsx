import React from 'react'

import { VenueNotFound } from 'features/venue/pages/VenueNotFound/VenueNotFound'
import { checkAccessibilityFor, render } from 'tests/utils/web'

const resetErrorBoundary = () => null
const error = new Error('error')

describe('<VenueNotFound />', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <VenueNotFound error={error} resetErrorBoundary={resetErrorBoundary} />
      )
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
