import React, { memo, useMemo, useContext, useReducer } from 'react'

import {
  initialFavoritesState,
  favoritesReducer,
  FavoritesContext as FavoritesContextType,
} from 'features/favorites/context/reducer'

const FavoritesContext = React.createContext<FavoritesContextType | null>(null)

export const FavoritesWrapper = memo<{ children: JSX.Element }>(function FavoritesWrapper({
  children,
}: {
  children: JSX.Element
}) {
  const [contextValueWithoutDispatch, dispatch] = useReducer(
    favoritesReducer,
    initialFavoritesState
  )
  const contextValue = useMemo(
    () => ({ ...contextValueWithoutDispatch, dispatch }),
    [contextValueWithoutDispatch, dispatch]
  )
  return <FavoritesContext.Provider value={contextValue}>{children}</FavoritesContext.Provider>
})

export const useFavoritesState = (): FavoritesContextType => {
  return useContext(FavoritesContext) as FavoritesContextType
}
