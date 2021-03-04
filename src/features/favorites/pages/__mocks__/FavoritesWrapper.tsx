import React from 'react'
import { View } from 'react-native'

import { initialFavoritesState } from 'features/favorites/pages/reducer'

import { FavoritesWrapper as ActualFavoritesWrapper } from '../FavoritesWrapper'

export const FavoritesWrapper: typeof ActualFavoritesWrapper = ({ children }) => <View>{children}</View>

export const useFavorites = () => ({
    favoritesState: initialFavoritesState,
    dispatch: jest.fn(),
})
