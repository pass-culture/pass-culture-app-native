import { BookingReponse } from 'api/gen'
import { ReactionChoiceModalBodyEnum } from 'features/reactions/enum'

export function getReactionChoiceModalBodyType(bookings: BookingReponse[]) {
  const offerWithImagesCount = bookings.filter((booking) => booking.stock.offer.image?.url).length

  if (bookings.length === 1) {
    return ReactionChoiceModalBodyEnum.VALIDATION
  }

  if (offerWithImagesCount === 0) {
    return ReactionChoiceModalBodyEnum.BOOKINGS_WITHOUT_IMAGE
  }

  return ReactionChoiceModalBodyEnum.BOOKINGS_WITH_IMAGE
}
