import React, { useMemo, useContext, useReducer } from 'react'

import {
  initialFavoritesState,
  favoritesReducer,
  FavoritesContext as FavoritesContextType,
} from 'features/favorites/pages/reducer'

export const FavoritesContext = React.createContext<FavoritesContextType | null>(null)

export const FavoritesWrapper = ({ children }: { children: Element }) => {
  const [contextValueWithoutDispatch, setContextValue] = useReducer(
    favoritesReducer,
    initialFavoritesState
  )
  const contextValue = useMemo(
    () => ({ ...contextValueWithoutDispatch, dispatch: setContextValue }),
    [[contextValueWithoutDispatch, setContextValue]]
  )
  return <FavoritesContext.Provider value={contextValue}>{children}</FavoritesContext.Provider>
}

export const useFavoritesState = (): FavoritesContextType => {
  return useContext(FavoritesContext) as FavoritesContextType
}
