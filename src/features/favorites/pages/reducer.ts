import { FavoriteSortBy } from 'features/favorites/types'

type FavoritesState = {
  sortBy: FavoriteSortBy
}

export type FavoritesContext = FavoritesState & {
  dispatch: (action: Action) => void
}

export const initialFavoritesState: FavoritesState = {
  sortBy: 'RECENTLY_ADDED',
}

type Action = { type: 'INIT' } | { type: 'SET_SORT_BY'; payload: FavoriteSortBy }

export const favoritesReducer = (state: FavoritesState, action: Action): FavoritesState => {
  switch (action.type) {
    case 'INIT':
      return initialFavoritesState
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload }
    default:
      return state
  }
}
