import { BookingReponse, NativeCategoryIdEnumv2 } from 'api/gen'
import { THIRTY_ONE_DAYS, TWENTY_FOUR_HOURS } from 'features/home/constants'
import { SubcategoriesMapping } from 'libs/subcategories/types'

export function filterBookingsWithoutReaction(
  booking: BookingReponse,
  subcategoriesMapping: SubcategoriesMapping,
  reactionCategories: Record<'categories', NativeCategoryIdEnumv2[]>
): boolean {
  const now = new Date()
  const { stock, dateUsed, userReaction } = booking

  const subcategory = subcategoriesMapping[stock.offer.subcategoryId]
  const isEligibleCategory = reactionCategories.categories.includes(subcategory.nativeCategoryId)

  if (!dateUsed || !isEligibleCategory || userReaction !== null) {
    return false
  }

  const isCinemaCategory = subcategory.nativeCategoryId === NativeCategoryIdEnumv2.SEANCES_DE_CINEMA

  const elapsedTime = now.getTime() - new Date(dateUsed).getTime()
  const timeThreshold = isCinemaCategory ? TWENTY_FOUR_HOURS : THIRTY_ONE_DAYS

  return elapsedTime > timeThreshold
}
