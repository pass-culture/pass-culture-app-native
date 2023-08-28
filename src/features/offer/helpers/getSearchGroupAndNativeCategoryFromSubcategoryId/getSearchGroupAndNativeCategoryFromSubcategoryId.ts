import { SubcategoriesResponseModelv2, SubcategoryIdEnum, SubcategoryIdEnumv2 } from 'api/gen'

export const getSearchGroupAndNativeCategoryFromSubcategoryId = (
  data?: SubcategoriesResponseModelv2,
  subcategoryId?: SubcategoryIdEnum
) => {
  if (!data || !subcategoryId) {
    return
  }

  const subcategory = data.subcategories.find(
    (subcategory) => subcategory.id === (subcategoryId as unknown as SubcategoryIdEnumv2)
  )

  if (!subcategory) return

  return {
    searchGroupName: subcategory.searchGroupName,
    nativeCategory: subcategory.nativeCategoryId,
  }
}
