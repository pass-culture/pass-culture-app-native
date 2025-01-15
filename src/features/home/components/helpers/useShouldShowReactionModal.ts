import { BookingReponse } from 'api/gen'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export const useShouldShowReactionModal = (bookingsEligibleToReaction: BookingReponse[]) => {
  const isReactionFeatureActive = useFeatureFlag(RemoteStoreFeatureFlags.WIP_REACTION_FEATURE)
  const firstBookingEligibleToReaction = bookingsEligibleToReaction[0]
  // There is an issue with !isCookieConsentChecked it goes to true for an instant and disrupts the modal conflict management hook
  return isReactionFeatureActive && firstBookingEligibleToReaction
}
