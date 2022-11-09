import { SubcategoryIdEnum } from 'api/gen'
import { useSubcategoriesMapping } from 'libs/subcategories/mappings'
import { Subcategory } from 'libs/subcategories/types'

export const useSubcategory = (subcategoryId: SubcategoryIdEnum): Subcategory => {
  const subcategoriesMapping = useSubcategoriesMapping()
  return subcategoriesMapping[subcategoryId] || {}
}
