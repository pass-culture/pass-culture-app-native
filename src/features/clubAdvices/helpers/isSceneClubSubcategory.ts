import { SubcategoryIdEnum } from 'api/gen'
import { SCENE_CLUB_SUBCATEGORIES } from 'features/clubAdvices/constants'
import { SceneClubSubcategoryId } from 'features/clubAdvices/types'

export const isSceneClubSubcategory = (
  subcategoryId: SubcategoryIdEnum
): subcategoryId is SceneClubSubcategoryId =>
  SCENE_CLUB_SUBCATEGORIES.includes(subcategoryId as SceneClubSubcategoryId)
