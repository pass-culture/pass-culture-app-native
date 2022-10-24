import React, { memo } from 'react'
import { View } from 'react-native'

import { initialFavoritesState } from 'features/favorites/context/reducer'

import { FavoritesWrapper as ActualFavoritesWrapper } from '../FavoritesWrapper'

// eslint-disable-next-line react/display-name
export const FavoritesWrapper: typeof ActualFavoritesWrapper = memo(({ children }) => (
  <View>{children}</View>
))

export const useFavoritesState = () => ({
  favoritesState: initialFavoritesState,
  dispatch: jest.fn(),
})
