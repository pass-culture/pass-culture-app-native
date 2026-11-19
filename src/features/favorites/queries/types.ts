import { FavoriteArtistResponse, FavoriteOfferResponseV2 } from 'api/gen'

export interface FavoriteOfferMutationContext {
  previousFavorites: Array<FavoriteOfferResponseV2>
}

export interface FavoriteArtistMutationContext {
  previousFavorites: Array<FavoriteArtistResponse>
}
