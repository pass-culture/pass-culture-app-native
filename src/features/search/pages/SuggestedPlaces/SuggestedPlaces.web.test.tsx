import React from 'react'

import { SuggestedPlace } from 'libs/place'
import { buildSuggestedPlaces } from 'libs/place/fetchPlaces'
import { mockedSuggestedPlaces } from 'libs/place/fixtures/mockedSuggestedPlaces'
import { SuggestedVenue } from 'libs/venue'
import { checkAccessibilityFor, fireEvent, render } from 'tests/utils/web'

import { keyExtractor, SuggestedPlaces } from './SuggestedPlaces'

let mockPlaces: SuggestedPlace[] = []
const mockVenues: SuggestedVenue[] = []

jest.mock('libs/place', () => ({
  usePlaces: () => ({ data: mockPlaces, isLoading: false }),
  useVenues: () => ({ data: mockVenues, isLoading: false }),
}))

const mockSetSelectedPlaceOrVenue = jest.fn()

describe('<SuggestedPlaces/>', () => {
  it('should trigger onPress when pressing the Space bar on focused place', () => {
    mockPlaces = buildSuggestedPlaces(mockedSuggestedPlaces)
    const { getByTestId } = render(
      <SuggestedPlaces query="paris" setSelectedPlaceOrVenue={mockSetSelectedPlaceOrVenue} />
    )

    fireEvent.focus(getByTestId(keyExtractor(mockPlaces[1])))
    fireEvent.keyDown(getByTestId(keyExtractor(mockPlaces[1])), { key: 'Spacebar' })

    expect(mockSetSelectedPlaceOrVenue).toHaveBeenCalledWith(mockPlaces[1])
  })

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
