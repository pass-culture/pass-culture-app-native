import { SearchGroupNameEnumv2, SubcategoryIdEnum } from 'api/gen'
import { getSearchGroupIdFromSubcategoryId } from 'features/offer/helpers/getSearchGroupIdFromSubcategoryId/getSearchGroupIdFromSubcategoryId'
import { placeholderData } from 'libs/subcategories/placeholderData'

const mockData = placeholderData

jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

describe('getSearchGroupIdFromSubcategoryId', () => {
  describe('should return undefined', () => {
    it('when no data sent by backend and unspecified subcategory', () => {
      const value = getSearchGroupIdFromSubcategoryId()
      expect(value).toEqual(undefined)
    })

    it('when no data sent by backend', () => {
      const value = getSearchGroupIdFromSubcategoryId(undefined, SubcategoryIdEnum.ABO_JEU_VIDEO)
      expect(value).toEqual(undefined)
    })
  })
  describe('should return an empty array', () => {
    it('when unspecified subcategory', () => {
      const value = getSearchGroupIdFromSubcategoryId(mockData)
      expect(value).toEqual(undefined)
    })
  })

  it('should return an array with the category id associated to the subcategory', () => {
    const value = getSearchGroupIdFromSubcategoryId(mockData, SubcategoryIdEnum.ABO_JEU_VIDEO)
    expect(value).toEqual([SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS])
  })
})
