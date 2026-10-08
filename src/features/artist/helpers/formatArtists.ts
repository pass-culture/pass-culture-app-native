import { CategoryIdEnum, OfferArtist } from 'api/gen'
import { getArtistRole } from 'features/artist/helpers/getArtistRole'
import { Artist } from 'features/venue/types'
import { getComputedAccessibilityLabel } from 'shared/accessibility/helpers/getComputedAccessibilityLabel'

export function formatArtists(artists: OfferArtist[], offerCategoryId?: CategoryIdEnum): Artist[] {
  return artists.flatMap((artist) => {
    const role = artist.role ? getArtistRole(artist.role, offerCategoryId) : 'Artiste'
    return {
      id: artist.id ?? '',
      name: artist.name,
      image: artist.image ?? undefined,
      role,
      accessibilityLabel: getComputedAccessibilityLabel(artist.name, role),
    }
  })
}
