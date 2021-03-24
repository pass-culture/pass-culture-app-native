import { SORT_OPTIONS } from 'features/favorites/pages/FavoritesSorts'

export type FavoritesState = {
  sortBy: keyof typeof SORT_OPTIONS
}

export type FavoritesContext = FavoritesState & {
  dispatch: (action: Action) => void
}

export const initialFavoritesState: FavoritesState = {
  sortBy: 'RECENTLY_ADDED',
}

export type Action = { type: 'INIT' } | { type: 'SET_FILTER'; payload: keyof typeof SORT_OPTIONS }

export const favoritesReducer = (state: FavoritesState, action: Action): FavoritesState => {
  switch (action.type) {
    case 'INIT':
      return initialFavoritesState
    case 'SET_FILTER':
      return { ...state, sortBy: action.payload }
    default:
      return state
  }
}
