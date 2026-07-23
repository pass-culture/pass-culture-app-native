import { SubcategoryIdEnum } from 'api/gen'
import { BOOK_CLUB_SUBCATEGORIES } from 'features/clubAdvices/constants'
import { BookClubSubcategoryId } from 'features/clubAdvices/types'

export const isBookClubSubcategory = (
  subcategoryId: SubcategoryIdEnum
): subcategoryId is BookClubSubcategoryId =>
  BOOK_CLUB_SUBCATEGORIES.includes(subcategoryId as BookClubSubcategoryId)
