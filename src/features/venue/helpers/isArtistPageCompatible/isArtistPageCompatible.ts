import { SubcategoryIdEnum } from 'api/gen'
import { ARTIST_PAGE_SUBCATEGORIES } from 'features/artist/constants'
import { COMMA_OR_SEMICOLON_REGEX, EXCLUDED_ARTISTS } from 'features/offer/helpers/constants'

export function isArtistPageCompatible(artistName: string, subcategoryId: SubcategoryIdEnum) {
  return (
    !COMMA_OR_SEMICOLON_REGEX.test(artistName) &&
    !EXCLUDED_ARTISTS.includes(artistName.toLowerCase()) &&
    ARTIST_PAGE_SUBCATEGORIES.includes(subcategoryId)
  )
}
