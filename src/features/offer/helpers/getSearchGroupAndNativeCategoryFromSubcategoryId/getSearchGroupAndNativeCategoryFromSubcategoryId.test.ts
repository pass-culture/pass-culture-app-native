import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2, SubcategoryIdEnum } from 'api/gen'
import { getSearchGroupAndNativeCategoryFromSubcategoryId } from 'features/offer/helpers/getSearchGroupAndNativeCategoryFromSubcategoryId/getSearchGroupAndNativeCategoryFromSubcategoryId'
import { placeholderData } from 'libs/subcategories/placeholderData'

const mockData = placeholderData

jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

describe('getSearchGrouAndNativeCategoryFromSubcategoryId', () => {
  describe('should return undefined', () => {
    it('when no data sent by backend and unspecified subcategory', () => {
      const value = getSearchGroupAndNativeCategoryFromSubcategoryId()

      expect(value).toBeUndefined()
    })

    it('when no data sent by backend', () => {
      const value = getSearchGroupAndNativeCategoryFromSubcategoryId(
        undefined,
        SubcategoryIdEnum.ABO_JEU_VIDEO
      )

      expect(value).toBeUndefined()
    })

    it('when unspecified subcategory', () => {
      const value = getSearchGroupAndNativeCategoryFromSubcategoryId(mockData)

      expect(value).toBeUndefined()
    })
  })

  it('should return the search group name and native category associated to the subcategory', () => {
    const value = getSearchGroupAndNativeCategoryFromSubcategoryId(
      mockData,
      SubcategoryIdEnum.ABO_JEU_VIDEO
    )

    expect(value).toEqual({
      searchGroupName: SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS,
      nativeCategory: NativeCategoryIdEnumv2.JEUX_EN_LIGNE,
    })
  })
})
