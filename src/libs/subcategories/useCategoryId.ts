import { CategoryIdEnum, SubcategoryIdEnum } from 'api/gen'
import { useCategoryIdMapping } from 'libs/subcategories/mappings'

export const useCategoryId = (subcategoryId: SubcategoryIdEnum): CategoryIdEnum => {
  const subcategoriesMapping = useCategoryIdMapping()
  return subcategoriesMapping[subcategoryId]
}
