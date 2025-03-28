import React from 'react'

import { VenueNotFound } from 'features/venue/pages/VenueNotFound/VenueNotFound'
import { checkAccessibilityFor, render } from 'tests/utils/web'

const resetErrorBoundary = () => null
const error = new Error('error')

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

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
