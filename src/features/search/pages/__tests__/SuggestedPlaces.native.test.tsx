import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialSearchState } from 'features/search/pages/reducer'
import { keyExtractor, SuggestedPlaces } from 'features/search/pages/SuggestedPlaces'
import { SuggestedPlace } from 'libs/place'
import { buildSuggestedPlaces } from 'libs/place/fetchPlaces'
import { mockedSuggestedPlaces } from 'libs/place/fixtures/mockedSuggestedPlaces'
import { SuggestedVenue } from 'libs/venue'
import { fireEvent, render } from 'tests/utils'

const mockSearchState = initialSearchState
const mockStagedDispatch = jest.fn()

jest.mock('features/search/pages/SearchWrapper', () => ({
  useStagedSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockStagedDispatch,
  }),
}))

let mockPlaces: SuggestedPlace[] = []
const mockVenues: SuggestedVenue[] = []

let mockIsLoading = false
jest.mock('libs/place', () => ({
  usePlaces: () => ({ data: mockPlaces, isLoading: mockIsLoading }),
  useVenues: () => ({ data: mockVenues, isLoading: mockIsLoading }),
}))

describe('SuggestedPlaces component', () => {
  it('should navigate on location filter page when selecting a place', () => {
    mockPlaces = buildSuggestedPlaces(mockedSuggestedPlaces)
    const { getByTestId } = render(<SuggestedPlaces query="paris" />)

    fireEvent.press(getByTestId(keyExtractor(mockPlaces[1])))

    expect(navigate).toHaveBeenCalledWith('LocationFilter', { selectedPlace: mockPlaces[1] })
  })

  it('should show empty component only when query is not empty and the results are not loading', () => {
    mockPlaces = []
    mockIsLoading = false
    const { getByText } = render(<SuggestedPlaces query="paris" />)
    expect(getByText('Aucun lieu ne correspond à ta recherche')).toBeTruthy()
  })

  it('should not show empty component if the query is empty and the results are not loading', () => {
    mockPlaces = []
    mockIsLoading = false
    const { queryByText } = render(<SuggestedPlaces query="" />)
    expect(queryByText('Aucun lieu ne correspond à ta recherche')).toBeNull()
  })

  it('should not show empty component if the results are still loading', () => {
    mockPlaces = []
    mockIsLoading = true
    const { queryByText } = render(<SuggestedPlaces query="paris" />)
    expect(queryByText('Aucun lieu ne correspond à ta recherche')).toBeNull()
  })
})
