import { FavoriteResponse } from 'api/gen'

export interface FavoriteOfferMutationContext {
  previousFavorites: Array<FavoriteResponse>
}
