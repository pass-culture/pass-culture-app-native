import React, { useCallback, useContext, useReducer } from 'react'

import {
  initialFavoritesState,
  favoritesReducer,
  FavoritesState,
} from 'features/favorites/pages/reducer'

export const FavoritesContext = React.createContext<FavoritesState | null>(null)

export const FavoritesWrapper = ({ children }: { children: Element }) => {
  const memoizedDispatch = useCallback(function (action) {
    setContextValue(action)
  }, [])

  const [contextValue, setContextValue] = useReducer(favoritesReducer, {
    ...initialFavoritesState,
    dispatch: memoizedDispatch,
  })

  return <FavoritesContext.Provider value={contextValue}>{children}</FavoritesContext.Provider>
}

export const useFavoritesState = (): FavoritesState => {
  return useContext(FavoritesContext) as FavoritesState
}
