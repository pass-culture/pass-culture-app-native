import {
  BookingReponse,
  BookingsListResponseV2,
  BookingsResponseV2,
  PostOneReactionRequest,
} from 'api/gen'

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

type BookingItem =
  | BookingsResponseV2['endedBookings'][number]
  | BookingsListResponseV2['bookings'][number]

const addReactions = <
  T extends BookingsResponseV2['endedBookings'] | BookingsListResponseV2['bookings'],
>(
  endedBookings: T,
  reactions: PostOneReactionRequest[]
): T => {
  if (!endedBookings?.length || !reactions?.length) return endedBookings

  return endedBookings.map((booking: BookingItem) => {
    const foundReaction = reactions.find((reaction) => reaction.offerId === booking.stock.offer.id)
    return foundReaction ? { ...booking, userReaction: foundReaction.reactionType } : booking
  }) as T
}

export const addReactionsToBookingsV2 = (
  endedBookings: BookingsResponseV2['endedBookings'],
  reactions: PostOneReactionRequest[]
): BookingsResponseV2['endedBookings'] => addReactions(endedBookings, reactions)

export const addReactionsToBookingsList = (
  endedBookings: BookingsListResponseV2['bookings'],
  reactions: PostOneReactionRequest[]
): BookingsListResponseV2['bookings'] => addReactions(endedBookings, reactions)
