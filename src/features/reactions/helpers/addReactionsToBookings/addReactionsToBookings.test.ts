import { BookingReponse, PostOneReactionRequest, ReactionTypeEnum } from 'api/gen'
import { bookingsSnap } from 'features/bookings/fixtures'
import { addReactionsToBookings } from 'features/reactions/helpers/addReactionsToBookings/addReactionsToBookings'

const mockBookings: BookingReponse[] = [bookingsSnap.ended_bookings[0]]

const mockReactions: PostOneReactionRequest[] = [
  { offerId: 147874, reactionType: ReactionTypeEnum.LIKE },
]

const mockUnrelatedReactions: PostOneReactionRequest[] = [
  { offerId: 1, reactionType: ReactionTypeEnum.LIKE },
]

describe('addReactionsToBookings', () => {
  it('should return bookings with reactions when reactions added', () => {
    const updatedBookings = addReactionsToBookings(mockBookings, mockReactions)

    expect(updatedBookings).toEqual([{ ...mockBookings[0], userReaction: ReactionTypeEnum.LIKE }])
  })

  it('should return bookings without update when no reaction added', () => {
    const updatedBookings = addReactionsToBookings(mockBookings, [])

    expect(updatedBookings).toEqual(mockBookings)
  })

  it('should return original bookings when bookings not matched reactions', () => {
    const updatedBookings = addReactionsToBookings(mockBookings, mockUnrelatedReactions)

    expect(updatedBookings).toEqual(mockBookings)
  })

  it('should return empty array when no bookings specified', () => {
    const updatedBookings = addReactionsToBookings([], mockReactions)

    expect(updatedBookings).toEqual([])
  })
})
