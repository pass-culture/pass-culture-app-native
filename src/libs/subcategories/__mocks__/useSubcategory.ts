import { SubcategoryIdEnumv2 } from 'api/gen'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { Subcategory } from 'libs/subcategories/types'

export const useSubcategory = (subcategoryId: SubcategoryIdEnumv2): Subcategory => {
  const subcategory = PLACEHOLDER_DATA.subcategories.find(({ id }) => id === subcategoryId)
  // @ts-expect-error: because of noUncheckedIndexedAccess
  return subcategory || PLACEHOLDER_DATA.subcategories[0]
}
