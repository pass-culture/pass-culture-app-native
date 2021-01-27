import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { goBack } from '__mocks__/@react-navigation/native'
import { keyExtractor, LocationPicker, SuggestedPlaces } from 'features/search/pages/LocationPicker'
import { initialSearchState } from 'features/search/pages/reducer'
import { buildSuggestedPlaces } from 'libs/place'
import { mockedSuggestedPlaces } from 'libs/place/fixtures/mockedSuggestedPlaces'

const mockSearchState = initialSearchState
const mockDispatch = jest.fn()

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

describe('LocationPicker component', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<LocationPicker />)
    expect(toJSON()).toMatchSnapshot()
  })
})

describe('SuggestedPlaces component', () => {
  it('should dispatch LOCATION_PLACE on pick place', async () => {
    const places = buildSuggestedPlaces(mockedSuggestedPlaces)
    const { getByTestId } = render(<SuggestedPlaces places={places} />)

    fireEvent.press(getByTestId(keyExtractor(places[1])))
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'LOCATION_PLACE',
      payload: places[1],
    })
    expect(goBack).toHaveBeenCalledTimes(1)
  })
})
