import React from 'react'

import { SuggestedVenues } from 'features/search/pages/SuggestedPlacesOrVenues/SuggestedVenues'
import { Venue } from 'features/venue/types'
import { fireEvent, render, screen } from 'tests/utils'

const firstVenue = {
  _geoloc: { lat: 48.94083, lng: 2.47987 },
  info: 'Paris',
  label: 'La librairie quantique DATA',
  venueId: 9384,
  isOpenToPublic: true,
}
const secondVenue = {
  _geoloc: { lat: 48.94083, lng: 2.47987 },
  info: 'Paris',
  label: 'La librairie quantique',
  venueId: 9299,
  isOpenToPublic: true,
}
const mockedSuggestedVenues: Venue[] = [firstVenue, secondVenue]
const mockVenues: Venue[] = []
const useVenuesWithoutData = { data: mockVenues, isLoading: false }
const useVenuesWithData = { data: mockedSuggestedVenues, isLoading: false }
const mockUseVenues = jest.fn(() => useVenuesWithoutData)
jest.mock('libs/place/useVenues', () => ({
  useVenues: () => mockUseVenues(),
}))

const mockSetSelectedVenue = jest.fn()

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<SuggestedVenues/>', () => {
  it('should call setSelectedVenue when selecting a venue', async () => {
    mockUseVenues.mockReturnValueOnce(useVenuesWithData)
    render(<SuggestedVenues query="Librairie" setSelectedVenue={mockSetSelectedVenue} />)
    // TO-DO(PC-34194): simply replacing by a userEvent is not working, should be investigated
    // eslint-disable-next-line local-rules/no-fireEvent
    fireEvent.press(screen.getByText('La librairie quantique DATA'))

    expect(mockSetSelectedVenue).toHaveBeenCalledWith(firstVenue)
  })

  it('should show empty component only when query is not empty and the results are not loading', () => {
    mockUseVenues.mockReturnValueOnce(useVenuesWithoutData)
    render(<SuggestedVenues query="Librairie" setSelectedVenue={mockSetSelectedVenue} />)

    expect(screen.getByText('Aucun lieu culturel ne correspond à ta recherche')).toBeOnTheScreen()
  })

  it('should not show empty component if the query is empty and the results are not loading', () => {
    mockUseVenues.mockReturnValueOnce(useVenuesWithData)

    render(<SuggestedVenues query="" setSelectedVenue={mockSetSelectedVenue} />)

    expect(
      screen.queryByText('Aucun lieu culturel ne correspond à ta recherche')
    ).not.toBeOnTheScreen()
  })

  it('should not show empty component if the results are still loading', () => {
    mockUseVenues.mockReturnValueOnce({ ...useVenuesWithData, isLoading: true })

    render(<SuggestedVenues query="Librairie" setSelectedVenue={mockSetSelectedVenue} />)

    expect(
      screen.queryByText('Aucun lieu culturel ne correspond à ta recherche')
    ).not.toBeOnTheScreen()
  })
})
