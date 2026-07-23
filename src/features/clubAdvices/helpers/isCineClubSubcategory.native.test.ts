import { SubcategoryIdEnum } from 'api/gen'
import { CINE_CLUB_SUBCATEGORIES } from 'features/clubAdvices/constants'
import { isCineClubSubcategory } from 'features/clubAdvices/helpers/isCineClubSubcategory'

describe('isCineClubSubcategory', () => {
  it.each([...CINE_CLUB_SUBCATEGORIES])(
    'should return true when subcategory is %s',
    (subcategoryId) => {
      expect(isCineClubSubcategory(subcategoryId)).toEqual(true)
    }
  )

  it('should return false when subcategory not includes in CINE_CLUB_SUBCATEGORIES', () => {
    expect(isCineClubSubcategory(SubcategoryIdEnum.LIVRE_PAPIER)).toEqual(false)
    expect(isCineClubSubcategory(SubcategoryIdEnum.SPECTACLE_REPRESENTATION)).toEqual(false)
  })
})
