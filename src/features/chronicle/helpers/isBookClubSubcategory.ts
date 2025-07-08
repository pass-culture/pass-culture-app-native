import { SubcategoryIdEnum } from 'api/gen'
import { BookClubSubcategoryId } from 'features/offer/components/OfferContent/ChronicleSection/types'
import { BOOK_CLUB_SUBCATEGORIES } from 'features/offer/constant'

export const isBookClubSubcategory = (
  subcategoryId: SubcategoryIdEnum
): subcategoryId is BookClubSubcategoryId =>
  BOOK_CLUB_SUBCATEGORIES.includes(subcategoryId as BookClubSubcategoryId)
