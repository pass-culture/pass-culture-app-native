import { SubcategoryIdEnum } from 'api/gen'
import { isBookClubSubcategory } from 'features/chronicle/helpers/isBookClubSubcategory'

describe('isBookClubSubcategory', () => {
  it('should return true when subcategory includes in BOOK_CLUB_SUBCATEGORIES', () => {
    expect(isBookClubSubcategory(SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE)).toEqual(true)
  })

  it('should return false when subcategory not includes in BOOK_CLUB_SUBCATEGORIES', () => {
    expect(isBookClubSubcategory(SubcategoryIdEnum.SEANCE_CINE)).toEqual(false)
  })
})
