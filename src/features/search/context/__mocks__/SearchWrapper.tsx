import React, { memo } from 'react'
import { View } from 'react-native'

import { initialSearchState } from 'features/search/context/reducer'

const { SearchWrapper: ActualSearchWrapper } = jest.requireActual('../SearchWrapper')

export const SearchWrapper: typeof ActualSearchWrapper = memo(function SearchWrapper({ children }) {
  return <View>{children}</View>
})

export const useSearch = () => ({
  searchState: initialSearchState,
  dispatch: jest.fn(),
})
