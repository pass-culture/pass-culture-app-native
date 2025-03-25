import { SubcategoryIdEnum } from 'api/gen'
import { ARTIST_PAGE_SUBCATEGORIES } from 'features/artist/constants'

export function isArtistPageCompatible(subcategoryId: SubcategoryIdEnum) {
  return ARTIST_PAGE_SUBCATEGORIES.includes(subcategoryId)
}
