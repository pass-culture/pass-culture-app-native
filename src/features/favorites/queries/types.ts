import { FavoriteArtistResponse, FavoriteResponse } from 'api/gen'

export interface FavoriteOfferMutationContext {
  previousFavorites: Array<FavoriteResponse>
}

export interface FavoriteArtistMutationContext {
  previousFavorites: Array<FavoriteArtistResponse>
}
