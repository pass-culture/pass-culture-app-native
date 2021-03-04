import { FavoriteResponse } from 'api/gen'

export type FavoritesParameters = {
  favorites: Array<FavoriteResponse>
}

export type FavoritesState = FavoritesParameters & {
  showResults: boolean
  dispatch: (action: Action) => void
}

export const initialFavoritesState: FavoritesState = {
  showResults: false,
  favorites: [],
  dispatch: () => null,
}

export type Action = { type: 'SHOW_RESULTS'; payload: boolean }

export const favoritesReducer = (state: FavoritesState, action: Action): FavoritesState => {
  switch (action.type) {
    case 'SHOW_RESULTS':
      return { ...state, showResults: action.payload }
    default:
      return state
  }
}
