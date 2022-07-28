import { CategoryIdEnum, SubcategoryIdEnumv2 } from 'api/gen'
import { placeholderData } from 'libs/subcategories/placeholderData'

export const useCategoryId = (subcategoryId: SubcategoryIdEnumv2): CategoryIdEnum => {
  const subcategory = placeholderData.subcategories.find(({ id }) => id === subcategoryId)
  return subcategory?.categoryId || placeholderData.subcategories[0].categoryId
}
