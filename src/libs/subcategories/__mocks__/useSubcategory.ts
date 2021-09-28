import { SubcategoryIdEnum } from 'api/gen'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { Subcategory } from 'libs/subcategories/types'

export const useSubcategory = (subcategoryId: SubcategoryIdEnum): Subcategory => {
  const subcategory = placeholderData.subcategories.find(({ id }) => id === subcategoryId)
  return subcategory || placeholderData.subcategories[0]
}
