import React from 'react'

import { SuggestedVenues } from 'features/search/pages/SuggestedPlacesOrVenues/SuggestedVenues'
import { Venue } from 'features/venue/types'
import { checkAccessibilityFor, render } from 'tests/utils/web'

const mockVenues: Venue[] = []

jest.mock('libs/place', () => ({
  useVenues: () => ({ data: mockVenues, isLoading: false }),
}))

const mockSetSelectedVenue = jest.fn()

describe('<SuggestedPlacesOrVenues/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <SuggestedVenues query="paris" setSelectedVenue={mockSetSelectedVenue} />
      )
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
