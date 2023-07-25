import React from 'react'

import { Venue } from 'features/venue/types'
import { SuggestedPlace } from 'libs/place'
import { checkAccessibilityFor, render } from 'tests/utils/web'

import { SuggestedPlaces } from './SuggestedPlaces'

const mockPlaces: SuggestedPlace[] = []
const mockVenues: Venue[] = []

jest.mock('libs/place', () => ({
  usePlaces: () => ({ data: mockPlaces, isLoading: false }),
  useVenues: () => ({ data: mockVenues, isLoading: false }),
}))

const mockSetSelectedPlaceOrVenue = jest.fn()

describe('<SuggestedPlaces/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <SuggestedPlaces query="paris" setSelectedPlaceOrVenue={mockSetSelectedPlaceOrVenue} />
      )
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
