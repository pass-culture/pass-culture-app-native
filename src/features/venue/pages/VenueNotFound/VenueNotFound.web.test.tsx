import React from 'react'

import { VenueNotFound } from 'features/venue/pages/VenueNotFound/VenueNotFound'
import { checkAccessibilityFor, render } from 'tests/utils/web'

const resetErrorBoundary = () => null
const error = new Error('error')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

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
