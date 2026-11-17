import { FavoriteArtistResponse, FavoriteOfferResponseV2, FavoriteVenueResponse } from 'api/gen'

export interface FavoriteOfferMutationContext {
  previousFavorites: Array<FavoriteOfferResponseV2>
}

export interface FavoriteArtistMutationContext {
  previousFavorites: Array<FavoriteArtistResponse>
}

export interface FavoriteVenueMutationContext {
  previousFavorites: Array<FavoriteVenueResponse>
}
