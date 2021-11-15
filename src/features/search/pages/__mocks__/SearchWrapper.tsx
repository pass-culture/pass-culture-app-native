import React, { memo } from 'react'
import { View } from 'react-native'

import { SearchView } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'

const { SearchWrapper: ActualSearchWrapper } = jest.requireActual('../SearchWrapper')

export const SearchWrapper: typeof ActualSearchWrapper = memo(function SearchWrapper({ children }) {
  return <View>{children}</View>
})

export const useSearchView = () => ({
  searchView: SearchView.LANDING,
  setSearchView: jest.fn(),
})

export const useSearch = () => ({
  searchState: initialSearchState,
  dispatch: jest.fn(),
})

export const useStagedSearch = () => ({
  searchState: initialSearchState,
  dispatch: jest.fn(),
})

export const useCommitStagedSearch = () => ({
  commitStagedSearch: jest.fn(),
})
