import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnum } from 'api/gen'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { SearchState } from 'features/search/types'
import { analytics } from 'libs/firebase/analytics'
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
jest.mock('libs/firebase/analytics')

const mockSettings = {
  appEnableSearchHomepageRework: false,
}

jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => ({
    data: mockSettings,
  })),
}))

describe('SearchBox component', () => {
  const searchInputID = uuidv4()

  it('should render SearchBox', () => {
    expect(render(<SearchBox searchInputID={searchInputID} />)).toMatchSnapshot()
  })

  it('should call mockStagedDispatch() when typing', () => {
    const { getByPlaceholderText } = render(<SearchBox searchInputID={searchInputID} />)
    const searchInput = getByPlaceholderText('Offre, artiste...')
    expect(mockStagedDispatch).toBeCalledWith({ type: 'SET_QUERY', payload: '' })
    fireEvent.changeText(searchInput, 'Ma')
    expect(mockStagedDispatch).toBeCalledWith({ type: 'SET_QUERY', payload: 'Ma' })
    fireEvent.changeText(searchInput, 'Mama')
    expect(mockStagedDispatch).toBeCalledWith({ type: 'SET_QUERY', payload: 'Mama' })
  })

  it('should call logSearchQuery on submit', async () => {
    const { getByPlaceholderText } = render(<SearchBox searchInputID={searchInputID} />)
    const searchInput = getByPlaceholderText('Offre, artiste...')

    await fireEvent(searchInput, 'onSubmitEditing', { nativeEvent: { text: 'jazzaza' } })

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

  it('should not execute a search if input is empty', () => {
    const { getByPlaceholderText } = render(<SearchBox searchInputID={searchInputID} />)
    const searchInput = getByPlaceholderText('Offre, artiste...')

    fireEvent(searchInput, 'onSubmitEditing', { nativeEvent: { text: '' } })

    expect(navigate).not.toBeCalled()
  })

  it('should execute a search if input is not empty', () => {
    const { getByPlaceholderText } = render(<SearchBox searchInputID={searchInputID} />)
    const searchInput = getByPlaceholderText('Offre, artiste...')

    fireEvent(searchInput, 'onSubmitEditing', { nativeEvent: { text: 'jazzaza' } })

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
