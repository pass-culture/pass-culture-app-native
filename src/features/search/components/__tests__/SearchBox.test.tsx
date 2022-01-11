import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnum } from 'api/gen'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { SearchState } from 'features/search/types'
import { analytics } from 'libs/analytics'
import { SuggestedVenue } from 'libs/venue'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { fireEvent, render } from 'tests/utils'

import { SearchBox } from '../SearchBox'

const venue: SuggestedVenue = mockedSuggestedVenues[0]

const mockSearchState = initialSearchState
const mockStagedSearchState: SearchState = {
  ...initialSearchState,
  offerCategories: [SearchGroupNameEnum.CINEMA],
  locationFilter: { locationType: LocationType.VENUE, venue },
  priceRange: [0, 20],
}

const mockDispatch = jest.fn()
const mockStagedDispatch = jest.fn()
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({ searchState: mockSearchState, dispatch: mockDispatch }),
  useStagedSearch: () => ({ searchState: mockStagedSearchState, dispatch: mockStagedDispatch }),
}))
jest.mock('libs/analytics')

describe('SearchBox component', () => {
  it('should call mockStagedDispatch() when typing', () => {
    const { getByPlaceholderText } = render(<SearchBox />)
    const searchInput = getByPlaceholderText('Titre, artiste, lieu...')
    expect(mockStagedDispatch).toBeCalledWith({ type: 'SET_QUERY', payload: '' })
    fireEvent.changeText(searchInput, 'Ma')
    expect(mockStagedDispatch).toBeCalledWith({ type: 'SET_QUERY', payload: 'Ma' })
    fireEvent.changeText(searchInput, 'Mama')
    expect(mockStagedDispatch).toBeCalledWith({ type: 'SET_QUERY', payload: 'Mama' })
  })

  it('should call logSearchQuery on submit', () => {
    const { getByPlaceholderText } = render(<SearchBox />)
    const searchInput = getByPlaceholderText('Titre, artiste, lieu...')

    fireEvent(searchInput, 'onSubmitEditing', { nativeEvent: { text: 'jazzaza' } })

    expect(analytics.logSearchQuery).toBeCalledWith('jazzaza')
    expect(navigate).toBeCalledWith(
      ...getTabNavConfig('Search', {
        query: 'jazzaza',
        showResults: true,
        offerCategories: mockStagedSearchState.offerCategories,
        locationFilter: mockStagedSearchState.locationFilter,
        priceRange: mockStagedSearchState.priceRange,
      })
    )
  })
})
