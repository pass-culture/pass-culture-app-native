import React from 'react'

import { SuggestedPlaces } from 'features/search/pages/SuggestedPlacesOrVenues/SuggestedPlaces'
import { SuggestedPlace } from 'libs/place'
import { buildSuggestedPlaces } from 'libs/place/fetchPlaces'
import { mockedSuggestedPlaces } from 'libs/place/fixtures/mockedSuggestedPlaces'
import { fireEvent, render, screen } from 'tests/utils'

let mockPlaces: SuggestedPlace[] = []

let mockIsLoading = false
jest.mock('libs/place', () => ({
  usePlaces: () => ({ data: mockPlaces, isLoading: mockIsLoading }),
}))

const mockSetSelectedPlace = jest.fn()

describe('<SuggestedPlaces/>', () => {
  it('should call setSelectedPlace when selecting a place', () => {
    mockPlaces = buildSuggestedPlaces(mockedSuggestedPlaces)

    render(<SuggestedPlaces query="paris" setSelectedPlace={mockSetSelectedPlace} />)

    fireEvent.press(screen.getByTestId(`${mockPlaces[1].label} ${mockPlaces[1].info}`))

    expect(mockSetSelectedPlace).toHaveBeenCalledWith(mockPlaces[1])
  })

  it('should show empty component only when query is not empty and the results are not loading', () => {
    mockPlaces = []
    mockIsLoading = false

    render(<SuggestedPlaces query="paris" setSelectedPlace={mockSetSelectedPlace} />)

    expect(screen.getByText('Aucune localisation ne correspond à ta recherche')).toBeOnTheScreen()
  })

  it('should not show empty component if the query is empty and the results are not loading', () => {
    mockPlaces = []
    mockIsLoading = false

    render(<SuggestedPlaces query="" setSelectedPlace={mockSetSelectedPlace} />)

    expect(
      screen.queryByText('Aucune localisation ne correspond à ta recherche')
    ).not.toBeOnTheScreen()
  })

  it('should not show empty component if the results are still loading', () => {
    mockPlaces = []
    mockIsLoading = true

    render(<SuggestedPlaces query="paris" setSelectedPlace={mockSetSelectedPlace} />)

    expect(
      screen.queryByText('Aucune localisation ne correspond à ta recherche')
    ).not.toBeOnTheScreen()
  })
})
