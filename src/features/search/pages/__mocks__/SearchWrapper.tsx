import React, { memo } from 'react'
import { View } from 'react-native'

import { initialSearchState } from 'features/search/pages/reducer'

const { SearchWrapper: ActualSearchWrapper } = jest.requireActual('../SearchWrapper')

export const SearchWrapper: typeof ActualSearchWrapper = memo(function SearchWrapper({ children }) {
  return <View>{children}</View>
})

export const useSearch = () => ({
  searchState: initialSearchState,
  dispatch: jest.fn(),
})

export const useStagedSearch = () => ({
  searchState: initialSearchState,
  dispatch: jest.fn(),
})

export const useCommit = () => ({
  commit: jest.fn(),
})
