import { useBookings } from 'features/bookings/api'
import { useBookingsEligibleToReactions } from 'features/home/components/helpers/useBookingsEligibleToReactions'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export enum ModalDisplayState {
  PENDING = 'pending',
  SHOULD_SHOW = 'shouldShow',
  SHOULD_NOT_SHOW = 'shouldNotShow',
}

export const useShouldShowReactionModal = (): ModalDisplayState => {
  const { data: bookings, isLoading: isBookingsLoading } = useBookings()
  const isReactionFeatureActive = useFeatureFlag(RemoteStoreFeatureFlags.WIP_REACTION_FEATURE)
  const bookingsEligibleToReaction = useBookingsEligibleToReactions()
  const firstBookingWithoutReaction = bookingsEligibleToReaction[0]

  if (isBookingsLoading || bookings === undefined) {
    return ModalDisplayState.PENDING
  }

  // There is an issue with !isCookieConsentChecked it goes to true for an instant and disrupts the modal conflict management hook
  if (!isReactionFeatureActive || !firstBookingWithoutReaction)
    return ModalDisplayState.SHOULD_NOT_SHOW

  return ModalDisplayState.SHOULD_SHOW
}
