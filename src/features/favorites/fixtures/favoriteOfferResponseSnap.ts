import { FavoriteOfferResponse } from 'api/gen'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'

export const favoriteOfferResponseSnap: FavoriteOfferResponse = {
  ...favoriteResponseSnap.offer,
}
