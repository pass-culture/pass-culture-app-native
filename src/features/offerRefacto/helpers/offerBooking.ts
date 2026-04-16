import { FavoriteOfferResponse } from 'api/gen'
import { UserProfile } from 'features/share/types'

export function getBookingId(
  offerId: FavoriteOfferResponse['id'],
  bookedOffersIds: UserProfile['bookedOffers'] = {}
): number | undefined {
  return bookedOffersIds[offerId]
}
