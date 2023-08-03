import { FavoriteOfferResponse, UserProfileResponse } from 'api/gen'

export function getBookingOfferId(
  offerId: FavoriteOfferResponse['id'],
  bookedOffersIds: UserProfileResponse['bookedOffers'] = {}
): number | undefined {
  return bookedOffersIds[offerId]
}
