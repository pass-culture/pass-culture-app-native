import React from 'react'

import { OfferNotFound } from 'features/offer/pages/OfferNotFound/OfferNotFound'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { checkAccessibilityFor, render } from 'tests/utils/web'

const resetErrorBoundary = () => null
const error = new Error('error')

jest.mock('libs/firebase/analytics/analytics')

describe('<OfferNotFound/>', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

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
