import React from 'react'

import { SuggestedVenues } from 'features/search/pages/SuggestedPlacesOrVenues/SuggestedVenues'
import { Venue } from 'features/venue/types'
import { fireEvent, render, screen } from 'tests/utils'

const mockedSuggestedVenues: Venue[] = [
  {
    _geoloc: { lat: 48.94083, lng: 2.47987 },
    info: 'Paris',
    label: 'La librairie quantique DATA',
    venueId: 9384,
  },
  {
    _geoloc: { lat: 48.94083, lng: 2.47987 },
    info: 'Paris',
    label: 'La librairie quantique',
    venueId: 9299,
  },
]

let mockVenues: Venue[] = []

let mockIsLoading = false
jest.mock('libs/place', () => ({
  useVenues: () => ({ data: mockVenues, isLoading: mockIsLoading }),
}))

const mockSetSelectedVenue = jest.fn()

describe('<SuggestedVenues/>', () => {
  it('should call setSelectedVenue when selecting a venue', () => {
    mockVenues = mockedSuggestedVenues

    render(<SuggestedVenues query="Librairie" setSelectedVenue={mockSetSelectedVenue} />)

    fireEvent.press(screen.getByTestId(`${mockVenues[1].label} ${mockVenues[1].info}`))

    expect(mockSetSelectedVenue).toHaveBeenCalledWith(mockVenues[1])
  })

  it('should show empty component only when query is not empty and the results are not loading', () => {
    mockVenues = []
    mockIsLoading = false

    render(<SuggestedVenues query="Librairie" setSelectedVenue={mockSetSelectedVenue} />)

    expect(screen.getByText('Aucun point de vente ne correspond à ta recherche')).toBeOnTheScreen()
  })

  it('should not show empty component if the query is empty and the results are not loading', () => {
    mockVenues = []
    mockIsLoading = false

    render(<SuggestedVenues query="" setSelectedVenue={mockSetSelectedVenue} />)

    expect(
      screen.queryByText('Aucun point de vente ne correspond à ta recherche')
    ).not.toBeOnTheScreen()
  })

  it('should not show empty component if the results are still loading', () => {
    mockVenues = []
    mockIsLoading = true

    render(<SuggestedVenues query="Librairie" setSelectedVenue={mockSetSelectedVenue} />)

    expect(
      screen.queryByText('Aucun point de vente ne correspond à ta recherche')
    ).not.toBeOnTheScreen()
  })
})
