// eslint-disable-next-line no-restricted-imports
import { NetInfoState } from '@react-native-community/netinfo'
import React from 'react'

import { initialSearchState } from 'features/search/context/reducer'
import * as useSearch from 'features/search/context/SearchWrapper'
import { ISearchContext } from 'features/search/context/SearchWrapper'
import { SearchResults as SearchResultsV2 } from 'features/search/pages/SearchResults/v2/SearchResults'
import * as useNetInfoContext from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
jest.mock('libs/firebase/analytics/analytics')

jest
  .spyOn(useNetInfoContext, 'useNetInfoContext')
  .mockReturnValue({ isConnected: true, isInternetReachable: true } as NetInfoState)

const mockDispatch = jest.fn()
const isFocusOnSuggestions = false
const mockSearchState = {
  searchState: initialSearchState,
  dispatch: mockDispatch,
  resetSearch: jest.fn(),
  isFocusOnSuggestions,
  showSuggestions: jest.fn(),
  hideSuggestions: jest.fn(),
}

describe('Search Results V2', () => {
  beforeEach(jest.fn())

  it('should display 3 search filter pastilles when `isFocusOnSuggestions` is false', () => {
    getUseSearch()

    render(reactQueryProviderHOC(<SearchResultsV2 />))

    expect(screen.getByTestId('Offres-search-filter')).toBeOnTheScreen()
    expect(screen.getByTestId('Artistes-search-filter')).toBeOnTheScreen()
    expect(screen.getByTestId('Lieux-search-filter')).toBeOnTheScreen()
  })

  it('should not display search filter pastilles when `isFocusOnSuggestions` is true', () => {
    getUseSearch({ ...mockSearchState, isFocusOnSuggestions: true })

    render(reactQueryProviderHOC(<SearchResultsV2 />))

    expect(screen.queryByTestId('Offres-search-filter')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('Artistes-search-filter')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('Lieux-search-filter')).not.toBeOnTheScreen()
  })
})

const getUseSearch = (searchState?: ISearchContext) =>
  jest.spyOn(useSearch, 'useSearch').mockReturnValue(searchState ?? mockSearchState)
