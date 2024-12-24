import { AvailableReactionBooking, BookingReponse, SubcategoryIdEnum } from 'api/gen'
import { THIRTY_ONE_DAYS, TWENTY_FOUR_HOURS } from 'features/home/constants'

const cinemaSubcategories = [
  SubcategoryIdEnum.SEANCE_CINE,
  SubcategoryIdEnum.CINE_PLEIN_AIR,
  SubcategoryIdEnum.CINE_VENTE_DISTANCE,
]

export function filterBookingsWithoutReaction(
  booking: BookingReponse,
  reactableBookings?: AvailableReactionBooking[]
): boolean {
  const now = new Date()

  if (!reactableBookings) return false

  const bookingWithoutReaction = reactableBookings.find(
    (availableBooking) => availableBooking.offerId === booking.stock.offer.id
  )

  if (!bookingWithoutReaction || !bookingWithoutReaction.dateUsed) {
    return false
  }

  // TODO(PC-33728) back need to type subcategoryId as SubcategoryIdeEnum rather than a string
  const isCinemaCategory = cinemaSubcategories.includes(
    bookingWithoutReaction.subcategoryId as SubcategoryIdEnum
  )
  const elapsedTime = now.getTime() - new Date(bookingWithoutReaction.dateUsed).getTime()
  const timeThreshold = isCinemaCategory ? TWENTY_FOUR_HOURS : THIRTY_ONE_DAYS

  return elapsedTime > timeThreshold
}
