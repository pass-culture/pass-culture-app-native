import { BookingsResponse } from 'api/gen'
import { useIsCookiesListUpToDate } from 'features/cookies/helpers/useIsCookiesListUpToDate'
import { filterBookingsWithoutReaction } from 'features/home/components/helpers/filterBookingsWithoutReaction/filterBookingsWithoutReaction'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { useSubcategoriesMapping } from 'libs/subcategories'

export const useBookingsReactionHelpers = (
  bookings: BookingsResponse = {
    ended_bookings: [],
    ongoing_bookings: [],
    hasBookingsAfter18: false,
  }
) => {
  const isReactionFeatureActive = useFeatureFlag(RemoteStoreFeatureFlags.WIP_REACTION_FEATURE)
  const subcategoriesMapping = useSubcategoriesMapping()
  const { reactionCategories } = useRemoteConfigContext()
  const { isCookiesListUpToDate, cookiesLastUpdate } = useIsCookiesListUpToDate()
  const isCookieConsentChecked = cookiesLastUpdate && isCookiesListUpToDate

  const bookingsEligibleToReaction =
    bookings?.ended_bookings?.filter((booking) =>
      filterBookingsWithoutReaction(booking, subcategoriesMapping, reactionCategories)
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
