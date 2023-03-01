import { SubcategoriesResponseModelv2, SubcategoryIdEnum, SubcategoryIdEnumv2 } from 'api/gen'

export const getSearchGroupIdFromSubcategoryId = (
  data?: SubcategoriesResponseModelv2,
  subcategoryId?: SubcategoryIdEnum
) => {
  if (!data || !subcategoryId) {
    return
  }

  return data.subcategories.find(
    (subcategory) => subcategory.id === (subcategoryId as unknown as SubcategoryIdEnumv2)
  )?.searchGroupName
}
