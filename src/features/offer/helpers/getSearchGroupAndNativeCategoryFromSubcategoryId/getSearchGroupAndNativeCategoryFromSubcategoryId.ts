import { SubcategoriesResponseModelv2, SubcategoryIdEnum, SubcategoryIdEnumv2 } from 'api/gen'
import { eventMonitoring } from 'libs/monitoring'

export const getSearchGroupAndNativeCategoryFromSubcategoryId = (
  data: SubcategoriesResponseModelv2,
  subcategoryId: SubcategoryIdEnum
) => {
  const subcategory = data.subcategories.find(
    (subcategory) => subcategory.id === (subcategoryId as unknown as SubcategoryIdEnumv2)
  )

  if (!subcategory) {
    eventMonitoring.logError('Subcategory not found', {
      extra: {
        subcategoryId,
        subcategories: data.subcategories,
      },
    })

    throw new Error('Subcategory not found')
  }

  return {
    searchGroupName: subcategory.searchGroupName,
    nativeCategory: subcategory.nativeCategoryId,
  }
}
