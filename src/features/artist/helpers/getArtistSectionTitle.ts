import { SubcategoryIdEnum } from 'api/gen'
import { ARTIST_SECTION_TITLES, artistSectionTitleMapping } from 'features/artist/constants'
import { ArtistSectionTitle } from 'features/artist/types'

export function getArtistSectionTitle(subcategoryId: SubcategoryIdEnum): ArtistSectionTitle {
  return artistSectionTitleMapping[subcategoryId] ?? ARTIST_SECTION_TITLES.artist
}
