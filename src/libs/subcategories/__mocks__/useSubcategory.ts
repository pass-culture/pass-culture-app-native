import { SubcategoryIdEnumv2 } from 'api/gen'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { Subcategory } from 'libs/subcategories/types'

export const useSubcategory = (subcategoryId: SubcategoryIdEnumv2): Subcategory => {
  const subcategory = placeholderData.subcategories.find(({ id }) => id === subcategoryId)
  // @ts-expect-error: because of noUncheckedIndexedAccess
  return subcategory || placeholderData.subcategories[0]
}
