import React from 'react'

import { Venue } from 'features/venue/types'
import { SuggestedPlace } from 'libs/place'
import { buildSuggestedPlaces } from 'libs/place/fetchPlaces'
import { mockedSuggestedPlaces } from 'libs/place/fixtures/mockedSuggestedPlaces'
import { checkAccessibilityFor, fireEvent, render, screen } from 'tests/utils/web'

import { SuggestedPlaces } from './SuggestedPlaces'

let mockPlaces: SuggestedPlace[] = []
const mockVenues: Venue[] = []

jest.mock('libs/place', () => ({
  usePlaces: () => ({ data: mockPlaces, isLoading: false }),
  useVenues: () => ({ data: mockVenues, isLoading: false }),
}))

const mockSetSelectedPlaceOrVenue = jest.fn()

describe('<SuggestedPlaces/>', () => {
  it('should trigger onPress when pressing the Space bar on focused place', () => {
    mockPlaces = buildSuggestedPlaces(mockedSuggestedPlaces)
    render(<SuggestedPlaces query="paris" setSelectedPlaceOrVenue={mockSetSelectedPlaceOrVenue} />)

    fireEvent.focus(screen.getByTestId(`${mockPlaces[1].label} ${mockPlaces[1].info}`))
    fireEvent.keyDown(screen.getByTestId(`${mockPlaces[1].label} ${mockPlaces[1].info}`), {
      key: 'Spacebar',
    })

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
