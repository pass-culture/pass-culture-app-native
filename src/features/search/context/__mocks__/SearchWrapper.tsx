import React, { memo } from 'react'
import { View } from 'react-native'

import { initialSearchState } from 'features/search/context/reducer'

const { SearchWrapper: _ActualSearchWrapper } = jest.requireActual('../SearchWrapper')

export const SearchWrapper: typeof _ActualSearchWrapper = memo(function SearchWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <View>{children}</View>
})

export const useSearch = () => ({
  searchState: initialSearchState,
  dispatch: jest.fn(),
  resetSearch: jest.fn(),
  showSuggestions: jest.fn(),
  hideSuggestions: jest.fn(),
  isFocusOnSuggestions: false,
})
