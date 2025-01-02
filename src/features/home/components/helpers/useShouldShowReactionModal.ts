import { useBookings } from 'features/bookings/api'
import { filterBookingsWithoutReaction } from 'features/home/components/helpers/filterBookingsWithoutReaction/filterBookingsWithoutReaction'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { useSubcategoriesMapping } from 'libs/subcategories'

export const useShouldShowReactionModal = () => {
  const isReactionFeatureActive = useFeatureFlag(RemoteStoreFeatureFlags.WIP_REACTION_FEATURE)
  const { data: bookings } = useBookings()
  const subcategoriesMapping = useSubcategoriesMapping()
  const { reactionCategories } = useRemoteConfigContext()

  let shouldShowReactionModal = false

  if (!isReactionFeatureActive) return { shouldShowReactionModal }

  const eligibleBookingsWithoutReaction =
    bookings?.ended_bookings?.filter((booking) =>
      filterBookingsWithoutReaction(booking, subcategoriesMapping, reactionCategories)
    ) ?? []

  const firstBookingWithoutReaction = eligibleBookingsWithoutReaction[0]

  if (!firstBookingWithoutReaction) return { shouldShowReactionModal }

  shouldShowReactionModal = true

  return { shouldShowReactionModal }
}
