import { BookingReponse, BookingsResponse } from 'api/gen'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export enum ModalDisplayState {
  PENDING = 'pending',
  SHOULD_SHOW = 'shouldShow',
  SHOULD_NOT_SHOW = 'shouldNotShow',
}

export const useBookingsReactionHelpers = (
  bookings: BookingsResponse | undefined,
  isBookingsLoading: boolean
): {
  shouldShowReactionModal: ModalDisplayState
  bookingsEligibleToReaction: Array<BookingReponse> | undefined
} => {
  const isReactionFeatureActive = useFeatureFlag(RemoteStoreFeatureFlags.WIP_REACTION_FEATURE)

  const bookingsEligibleToReaction =
    bookings?.ended_bookings?.filter(
      (booking) => booking.enablePopUpReaction && !booking.userReaction
    ) ?? []

  const firstBookingWithoutReaction = bookingsEligibleToReaction[0]

  if (isBookingsLoading || bookings === undefined) {
    return {
      shouldShowReactionModal: ModalDisplayState.PENDING,
      bookingsEligibleToReaction: [],
    }
  }

  if (!isReactionFeatureActive || !firstBookingWithoutReaction)
    return {
      shouldShowReactionModal: ModalDisplayState.SHOULD_NOT_SHOW,
      bookingsEligibleToReaction: [],
    }

  return { shouldShowReactionModal: ModalDisplayState.SHOULD_SHOW, bookingsEligibleToReaction }
}
