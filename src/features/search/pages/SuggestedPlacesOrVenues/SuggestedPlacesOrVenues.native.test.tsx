import React from 'react'

import { SuggestedPlacesOrVenues } from 'features/search/pages/SuggestedPlacesOrVenues/SuggestedPlacesOrVenues'
import { Venue } from 'features/venue/types'
import { SuggestedPlace } from 'libs/place'
import { buildSuggestedPlaces } from 'libs/place/fetchPlaces'
import { mockedSuggestedPlaces } from 'libs/place/fixtures/mockedSuggestedPlaces'
import { fireEvent, render, screen } from 'tests/utils'

let mockPlaces: SuggestedPlace[] = []
const mockVenues: Venue[] = []

let mockIsLoading = false
jest.mock('libs/place', () => ({
  usePlaces: () => ({ data: mockPlaces, isLoading: mockIsLoading }),
  useVenues: () => ({ data: mockVenues, isLoading: mockIsLoading }),
}))

const mockSetSelectedPlaceOrVenue = jest.fn()

describe('<SuggestedPlacesOrVenues/>', () => {
  it('should call setSelectedPlaceOrVenue when selecting a place', () => {
    mockPlaces = buildSuggestedPlaces(mockedSuggestedPlaces)

    render(
      <SuggestedPlacesOrVenues
        query="paris"
        setSelectedPlaceOrVenue={mockSetSelectedPlaceOrVenue}
      />
    )

    fireEvent.press(screen.getByTestId(`${mockPlaces[1].label} ${mockPlaces[1].info}`))

    expect(mockSetSelectedPlaceOrVenue).toHaveBeenCalledWith(mockPlaces[1])
  })

  it('should show empty component only when query is not empty and the results are not loading', () => {
    mockPlaces = []
    mockIsLoading = false

    render(
      <SuggestedPlacesOrVenues
        query="paris"
        setSelectedPlaceOrVenue={mockSetSelectedPlaceOrVenue}
      />
    )

    expect(screen.getByText('Aucun lieu ne correspond à ta recherche')).toBeOnTheScreen()
  })

  it('should not show empty component if the query is empty and the results are not loading', () => {
    mockPlaces = []
    mockIsLoading = false

    render(
      <SuggestedPlacesOrVenues query="" setSelectedPlaceOrVenue={mockSetSelectedPlaceOrVenue} />
    )

    expect(screen.queryByText('Aucun lieu ne correspond à ta recherche')).not.toBeOnTheScreen()
  })

  it('should not show empty component if the results are still loading', () => {
    mockPlaces = []
    mockIsLoading = true

    render(
      <SuggestedPlacesOrVenues
        query="paris"
        setSelectedPlaceOrVenue={mockSetSelectedPlaceOrVenue}
      />
    )

    expect(screen.queryByText('Aucun lieu ne correspond à ta recherche')).not.toBeOnTheScreen()
  })
})
