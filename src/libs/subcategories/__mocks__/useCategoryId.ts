import { CategoryIdEnum, SubcategoryIdEnum } from 'api/gen'
import { placeholderData } from 'libs/subcategories/placeholderData'

export const useCategoryId = (subcategoryId: SubcategoryIdEnum): CategoryIdEnum => {
  const subcategory = placeholderData.subcategories.find(({ id }) => id === subcategoryId)
  return subcategory?.categoryId || placeholderData.subcategories[0].categoryId
}
