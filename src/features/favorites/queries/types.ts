import { FavoriteResponse } from 'api/gen'

export interface FavoriteMutationContext {
  previousFavorites: Array<FavoriteResponse>
}
