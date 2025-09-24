import { BookingReponse, BookingsResponseV2, PostOneReactionRequest } from 'api/gen'

// To Remove this V1 helper once Bookings V1 is fully deprecated and only Bookings V2 remains.
export const addReactionsToBookings = (
  endedBookings: BookingReponse[],
  reactions: PostOneReactionRequest[]
): BookingReponse[] => {
  const offerIds = reactions.map((reaction) => reaction.offerId)

  return endedBookings.map((booking) =>
    offerIds.includes(booking.stock.offer.id)
      ? {
          ...booking,
          userReaction: reactions.find((reaction) => reaction.offerId === booking.stock.offer.id)
            ?.reactionType,
        }
      : booking
  )
}

export function addReactionsToBookingsV2(
  endedBookings: BookingsResponseV2['endedBookings'],
  reactions: PostOneReactionRequest[]
): BookingsResponseV2['endedBookings'] {
  if (!endedBookings?.length || !reactions?.length) return endedBookings

  return endedBookings.map((booking) => {
    const match = reactions.find((reaction) => reaction.offerId === booking.stock.offer.id)
    return match ? { ...booking, userReaction: match.reactionType } : booking
  })
}
