import { SubcategoriesResponseModelv2, SubcategoryIdEnum, SubcategoryIdEnumv2 } from 'api/gen'

export const getSearchGroupIdFromSubcategoryId = (
  data?: SubcategoriesResponseModelv2,
  subcategoryId?: SubcategoryIdEnum
) => {
  if (!data) {
    return undefined
  }

  if (!subcategoryId) {
    return undefined
  }

  return data.subcategories
    .filter((subcategory) => subcategory.id === (subcategoryId as unknown as SubcategoryIdEnumv2))
    .map((subcategory) => subcategory.searchGroupName)
}
