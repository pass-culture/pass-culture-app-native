import { CategoryIdEnum, OfferArtist } from 'api/gen'
import { getArtistRole } from 'features/artist/helpers/getArtistRole'
import { Artist } from 'features/venue/types'

export function formatArtists(artists: OfferArtist[], offerCategoryId: CategoryIdEnum): Artist[] {
  return artists.flatMap((artist) => {
    if (!artist.id) return []

    return {
      id: artist.id,
      name: artist.name,
      image: artist.image ?? undefined,
      role: artist.role ? getArtistRole(artist.role, offerCategoryId) : 'Artiste',
      accessibilityLabel: `Accéder à la page artiste de ${artist.name}`,
    }
  })
}
