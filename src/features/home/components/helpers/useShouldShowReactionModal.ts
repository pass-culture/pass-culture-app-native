import { BookingsResponse } from 'api/gen'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export enum ModalDisplayState {
  SHOULD_SHOW = 'shouldShow',
  SHOULD_NOT_SHOW = 'shouldNotShow',
}

export const useShouldShowReactionModal = (
  bookings: BookingsResponse | undefined
): ModalDisplayState => {
  const isReactionFeatureActive = useFeatureFlag(RemoteStoreFeatureFlags.WIP_REACTION_FEATURE)

  const bookingsEligibleToReaction =
    bookings?.ended_bookings?.filter(
      (booking) => booking.enablePopUpReaction && !booking.userReaction
    ) ?? []

  const firstBookingEligibleToReaction = bookingsEligibleToReaction[0]

  // There is an issue with !isCookieConsentChecked it goes to true for an instant and disrupts the modal conflict management hook
  return isReactionFeatureActive && firstBookingEligibleToReaction
    ? ModalDisplayState.SHOULD_SHOW
    : ModalDisplayState.SHOULD_NOT_SHOW
}
