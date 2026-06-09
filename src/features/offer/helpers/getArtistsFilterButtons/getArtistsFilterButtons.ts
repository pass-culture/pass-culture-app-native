import { ArtistType, CategoryIdEnum, OfferArtist } from 'api/gen'
import { getArtistRole } from 'features/artist/helpers/getArtistRole'

export function getArtistsFilterButtons(artists: OfferArtist[], categoryId: CategoryIdEnum) {
  const roleGroups = new Map<string, { count: number; role: ArtistType }>()

  artists.forEach((artist) => {
    if (!artist.role) return
    const singular = getArtistRole(artist.role, categoryId, false)

    const current = roleGroups.get(singular) ?? { count: 0, role: artist.role }

    roleGroups.set(singular, {
      ...current,
      count: current.count + 1,
    })
  })

  return Array.from(roleGroups.entries()).map(([singular, { count, role }]) => {
    const roleLabel = count > 1 ? getArtistRole(role, categoryId, true) : singular

    return {
      role: singular,
      label: `${roleLabel}`,
    }
  })
}
