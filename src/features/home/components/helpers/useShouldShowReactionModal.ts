import { BookingsResponse } from 'api/gen'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export enum ModalDisplayState {
  PENDING = 'pending',
  SHOULD_SHOW = 'shouldShow',
  SHOULD_NOT_SHOW = 'shouldNotShow',
}

export const useShouldShowReactionModal = (
  bookings: BookingsResponse | undefined,
  isBookingsLoading: boolean
): ModalDisplayState => {
  const isReactionFeatureActive = useFeatureFlag(RemoteStoreFeatureFlags.WIP_REACTION_FEATURE)

  const bookingsEligibleToReaction =
    bookings?.ended_bookings?.filter(
      (booking) => booking.enablePopUpReaction && !booking.userReaction
    ) ?? []

  const firstBookingEligibleToReaction = bookingsEligibleToReaction[0]

  if (isBookingsLoading || bookings === undefined) {
    return ModalDisplayState.PENDING
  }

  if (isReactionFeatureActive && firstBookingEligibleToReaction)
    return ModalDisplayState.SHOULD_SHOW

  // There is an issue with !isCookieConsentChecked it goes to true for an instant and disrupts the modal conflict management hook
  return ModalDisplayState.SHOULD_NOT_SHOW
}
