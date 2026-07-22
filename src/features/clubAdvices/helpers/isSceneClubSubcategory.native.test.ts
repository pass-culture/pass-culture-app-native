import { SubcategoryIdEnum } from 'api/gen'
import { SCENE_CLUB_SUBCATEGORIES } from 'features/clubAdvices/constants'
import { isSceneClubSubcategory } from 'features/clubAdvices/helpers/isSceneClubSubcategory'

describe('isSceneClubSubcategory', () => {
  it.each([...SCENE_CLUB_SUBCATEGORIES])(
    'should return true when subcategory is %s',
    (subcategoryId) => {
      expect(isSceneClubSubcategory(subcategoryId)).toEqual(true)
    }
  )

  it('should return false when subcategory not includes in SCENE_CLUB_SUBCATEGORIES', () => {
    expect(isSceneClubSubcategory(SubcategoryIdEnum.LIVRE_PAPIER)).toEqual(false)
    expect(isSceneClubSubcategory(SubcategoryIdEnum.SEANCE_CINE)).toEqual(false)
  })
})
