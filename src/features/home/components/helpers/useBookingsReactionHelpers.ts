import { BookingsResponse } from 'api/gen'
import { useIsCookiesListUpToDate } from 'features/cookies/helpers/useIsCookiesListUpToDate'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export const useBookingsReactionHelpers = (
  bookings: BookingsResponse = {
    ended_bookings: [],
    ongoing_bookings: [],
    hasBookingsAfter18: false,
  }
) => {
  const isReactionFeatureActive = useFeatureFlag(RemoteStoreFeatureFlags.WIP_REACTION_FEATURE)
  const { isCookiesListUpToDate, cookiesLastUpdate } = useIsCookiesListUpToDate()
  const isCookieConsentChecked = cookiesLastUpdate && isCookiesListUpToDate

  const bookingsEligibleToReaction =
    bookings?.ended_bookings?.filter(
      (booking) => booking.enablePopUpReaction && !booking.userReaction
    ) ?? []

  const firstBookingWithoutReaction = bookingsEligibleToReaction[0]

  if (!isReactionFeatureActive || !isCookieConsentChecked)
    return {
      shouldShowReactionModal: false,
      bookingsEligibleToReaction: [],
    }

  if (!firstBookingWithoutReaction)
    return {
      shouldShowReactionModal: false,
      bookingsEligibleToReaction,
    }

  return { shouldShowReactionModal: true, bookingsEligibleToReaction }
}
