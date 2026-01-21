import { FavoriteOfferResponse } from 'api/gen'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'

export function getBookingId(
  offerId: FavoriteOfferResponse['id'],
  bookedOffersIds: UserProfileResponseWithoutSurvey['bookedOffers'] = {}
): number | undefined {
  return bookedOffersIds[offerId]
}
