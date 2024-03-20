import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2, SubcategoryIdEnum } from 'api/gen'
import { getSearchGroupAndNativeCategoryFromSubcategoryId } from 'features/offer/helpers/getSearchGroupAndNativeCategoryFromSubcategoryId/getSearchGroupAndNativeCategoryFromSubcategoryId'
import { eventMonitoring } from 'libs/monitoring'
import { placeholderData } from 'libs/subcategories/placeholderData'

describe('getSearchGrouAndNativeCategoryFromSubcategoryId', () => {
  it('should return the search group name and native category associated to the subcategory', () => {
    const value = getSearchGroupAndNativeCategoryFromSubcategoryId(
      placeholderData,
      SubcategoryIdEnum.ABO_JEU_VIDEO
    )

    expect(value).toEqual({
      searchGroupName: SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS,
      nativeCategory: NativeCategoryIdEnumv2.JEUX_EN_LIGNE,
    })
  })

  it('should capture and throw an error when subcategory id not found in subcategories list', () => {
    const value = () =>
      getSearchGroupAndNativeCategoryFromSubcategoryId(
        { ...placeholderData, subcategories: [] },
        SubcategoryIdEnum.ABO_JEU_VIDEO
      )

    expect(value).toThrow('Subcategory not found')

    expect(eventMonitoring.logError).toHaveBeenNthCalledWith(1, 'Subcategory not found', {
      extra: {
        subcategoryId: SubcategoryIdEnum.ABO_JEU_VIDEO,
        subcategories: [],
      },
    })
  })
})
