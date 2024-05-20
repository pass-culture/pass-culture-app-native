import { CategoryIdEnum, SubcategoryIdEnumv2 } from 'api/gen'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'

export const useCategoryId = (subcategoryId: SubcategoryIdEnumv2): CategoryIdEnum => {
  const subcategory = PLACEHOLDER_DATA.subcategories.find(({ id }) => id === subcategoryId)
  // @ts-expect-error: because of noUncheckedIndexedAccess
  return subcategory?.categoryId || PLACEHOLDER_DATA.subcategories[0].categoryId
}
