import { useBookings } from 'features/bookings/api'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { useSubcategoriesMapping } from 'libs/subcategories'

export function useBookingsAwaitingReaction() {
  const { data: bookings } = useBookings()
  const subcategoriesMapping = useSubcategoriesMapping()

  const { reactionCategories } = useRemoteConfigContext()

  const { ended_bookings: endedBookings = [] } = bookings ?? {}

  return endedBookings.filter((data) => {
    const subCategory = subcategoriesMapping[data.stock.offer.subcategoryId]
    return (
      reactionCategories.categories.includes(subCategory.nativeCategoryId) &&
      data.userReaction === null &&
      !data.cancellationDate
    )
  }).length
}
