import React from 'react'
import { View } from 'react-native'

import { initialSearchState } from 'features/search/pages/reducer'

import { SearchWrapper as ActualSearchWrapper } from '../SearchWrapper'

export const SearchWrapper: typeof ActualSearchWrapper = ({ children }) => <View>{children}</View>

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
