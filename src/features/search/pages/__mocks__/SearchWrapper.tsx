import React, { memo } from 'react'
import { View } from 'react-native'

import { initialSearchState } from 'features/search/pages/reducer'

// import {
//   SearchWrapper as ActualSearchWrapper,
//   searchRouteParamsToSearchState as actualSearchRouteParamsToSearchState,
//   sanitizeSearchStateParams as actualsanitizeSearchStateParams,
// } from '../SearchWrapper'

const {
  SearchWrapper: ActualSearchWrapper,
  searchRouteParamsToSearchState: actualSearchRouteParamsToSearchState,
  sanitizeSearchStateParams: actualSanitizeSearchStateParams,
} = jest.requireActual('../SearchWrapper')
export const SearchWrapper: typeof ActualSearchWrapper = memo(({ children }) => <View>{children}</View>)

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

export const searchRouteParamsToSearchState = actualSearchRouteParamsToSearchState
export const sanitizeSearchStateParams = actualSanitizeSearchStateParams
