import { SubcategoryIdEnum } from 'api/gen'
import { CINE_CLUB_SUBCATEGORIES } from 'features/clubAdvices/constants'
import { CineClubSubcategoryId } from 'features/clubAdvices/types'

export const isCineClubSubcategory = (
  subcategoryId: SubcategoryIdEnum
): subcategoryId is CineClubSubcategoryId =>
  CINE_CLUB_SUBCATEGORIES.includes(subcategoryId as CineClubSubcategoryId)
