import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { initialSearchState } from 'features/search/pages/reducer'
import { keyExtractor, SuggestedPlaces } from 'features/search/pages/SuggestedPlaces'
import { buildSuggestedPlaces, SuggestedPlace } from 'libs/place'
import { mockedSuggestedPlaces } from 'libs/place/fixtures/mockedSuggestedPlaces'
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
let mockIsLoading = false
jest.mock('features/search/api', () => ({
  usePlaces: () => ({ data: mockPlaces, isLoading: mockIsLoading }),
  useVenues: () => ({ data: [], isLoading: false }),
}))

describe('SuggestedPlaces component', () => {
  beforeEach(jest.clearAllMocks)

  it.each`
    stateName              | from
    ${'fromNone'}          | ${undefined}
    ${'fromFilters'}       | ${'filters'}
    ${'fromSearchLanding'} | ${'search'}
  `(
    '$stateName: should dispatch LOCATION_PLACE on pick place when from is $from',
    ({ from }: { from: 'filters' | 'search' | undefined }) => {
      mockPlaces = buildSuggestedPlaces(mockedSuggestedPlaces)
      const { getByTestId } = render(<SuggestedPlaces query="paris" from={from} />)

      fireEvent.press(getByTestId(keyExtractor(mockPlaces[1])))

      const { venueId: _venueId, ...payload } = mockPlaces[1]
      expect(mockStagedDispatch).toHaveBeenCalledWith({
        type: 'LOCATION_PLACE',
        payload,
      })
      if (from) {
        expect(mockGoBack).not.toBeCalledTimes(1)
        const nextScreen = from === 'filters' ? 'SearchFilter' : 'Search'
        expect(navigate).toBeCalledWith(nextScreen)
      } else {
        expect(mockGoBack).toBeCalledTimes(1)
      }
    }
  )

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
})
