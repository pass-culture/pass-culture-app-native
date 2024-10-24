import { BookingReponse, PostOneReactionRequest } from 'api/gen'

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
