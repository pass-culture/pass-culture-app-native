import React from 'react'

import { goBack } from '__mocks__/@react-navigation/native'
import { initialSearchState } from 'features/search/pages/reducer'
import { keyExtractor, SuggestedPlaces } from 'features/search/pages/SuggestedPlaces'
import { buildSuggestedPlaces } from 'libs/place'
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

describe('SuggestedPlaces component', () => {
  it('should dispatch LOCATION_PLACE on pick place', () => {
    const places = buildSuggestedPlaces(mockedSuggestedPlaces)
    const { getByTestId } = render(
      <SuggestedPlaces places={places} query="paris" isLoading={false} />
    )

    fireEvent.press(getByTestId(keyExtractor(places[1])))
    expect(mockStagedDispatch).toHaveBeenCalledWith({
      type: 'LOCATION_PLACE',
      payload: places[1],
    })
    expect(goBack).toHaveBeenCalledTimes(2)
  })

  it('should show empty component only when query is not empty and the results are not loading', () => {
    const { findByText } = render(<SuggestedPlaces places={[]} query="paris" isLoading={false} />)
    expect(findByText('Aucun lieu ne correspond à ta recherche')).toBeTruthy()
  })

  it('should not show empty component if the query is empty and the results are not loading', () => {
    const { queryByText } = render(<SuggestedPlaces places={[]} query="" isLoading={false} />)
    expect(queryByText('Aucun lieu ne correspond à ta recherche')).toBeFalsy()
  })

  it('should not show empty component if the results are still loading', () => {
    const { queryByText } = render(<SuggestedPlaces places={[]} query="paris" isLoading={true} />)
    expect(queryByText('Aucun lieu ne correspond à ta recherche')).toBeFalsy()
  })
})
