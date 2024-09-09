import React from 'react'

import { OfferNotFound } from 'features/offer/pages/OfferNotFound/OfferNotFound'
import { checkAccessibilityFor, render } from 'tests/utils/web'

const resetErrorBoundary = () => null
const error = new Error('error')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

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
