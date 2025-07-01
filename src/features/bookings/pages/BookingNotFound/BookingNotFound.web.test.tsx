import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { BookingNotFound } from './BookingNotFound'

jest.mock('libs/firebase/analytics/analytics')

describe('<BookingNotFound/>', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <BookingNotFound error={new Error('error')} resetErrorBoundary={() => null} />
      )
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
