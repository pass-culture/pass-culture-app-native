import { BookingReponse, NativeCategoryIdEnumv2 } from 'api/gen'
import { TWENTY_FOUR_HOURS } from 'features/home/constants'
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

  const elapsedTime = now.getTime() - new Date(dateUsed).getTime()
  return elapsedTime > TWENTY_FOUR_HOURS
}
