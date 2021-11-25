import React from 'react'

import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { initialSearchState } from 'features/search/pages/reducer'
import { MAX_RADIUS } from 'features/search/pages/reducer.helpers'
import { keyExtractor, SuggestedPlaces } from 'features/search/pages/SuggestedPlaces'
import { analytics } from 'libs/analytics'
import { SuggestedPlace } from 'libs/place'
import { buildSuggestedPlaces } from 'libs/place/fetchPlaces'
import { mockedSuggestedPlaces } from 'libs/place/fixtures/mockedSuggestedPlaces'
import { SuggestedVenue } from 'libs/venue'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { fireEvent, render } from 'tests/utils/web'

const mockSearchState = initialSearchState
const mockStagedDispatch = jest.fn()
const venueId = mockedSuggestedVenues[1].venueId

jest.mock('features/search/pages/SearchWrapper', () => ({
  useStagedSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockStagedDispatch,
  }),
}))

let mockPlaces: SuggestedPlace[] = []
let mockVenues: SuggestedVenue[] = []

let mockIsLoading = false
jest.mock('libs/place', () => ({
  usePlaces: () => ({ data: mockPlaces, isLoading: mockIsLoading }),
  useVenues: () => ({ data: mockVenues, isLoading: mockIsLoading }),
}))

describe('SuggestedPlaces component', () => {
  it('should dispatch LOCATION_PLACE on pick place', () => {
    mockPlaces = buildSuggestedPlaces(mockedSuggestedPlaces)
    const { getByTestId } = render(<SuggestedPlaces query="paris" />)

    fireEvent.click(getByTestId(keyExtractor(mockPlaces[1])))

    expect(mockStagedDispatch).toHaveBeenCalledWith({
      type: 'SET_LOCATION_PLACE',
      payload: { aroundRadius: MAX_RADIUS, place: mockPlaces[1] },
    })
    expect(mockGoBack).toBeCalledTimes(2)
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
    expect(queryByText('Aucun lieu ne correspond à ta recherche')).toBeFalsy()
  })

  it('should not show empty component if the results are still loading', () => {
    mockPlaces = []
    mockIsLoading = true
    const { queryByText } = render(<SuggestedPlaces query="paris" />)
    expect(queryByText('Aucun lieu ne correspond à ta recherche')).toBeFalsy()
  })

  it(`should log analytics event ChooseLocation when clicking on pick place`, () => {
    mockPlaces = buildSuggestedPlaces(mockedSuggestedPlaces)
    const { getByTestId } = render(<SuggestedPlaces query="paris" />)

    fireEvent.click(getByTestId(keyExtractor(mockPlaces[1])))
    expect(analytics.logChooseLocation).toHaveBeenNthCalledWith(1, { type: 'place' })
  })

  it(`should log analytics event ChooseLocation when clicking on pick venue`, () => {
    mockVenues = mockedSuggestedVenues
    mockIsLoading = false
    const { getByTestId } = render(<SuggestedPlaces query="paris" />)

    fireEvent.click(getByTestId(keyExtractor(mockVenues[1])))
    expect(analytics.logChooseLocation).toHaveBeenNthCalledWith(1, { type: 'venue', venueId })
  })
})
