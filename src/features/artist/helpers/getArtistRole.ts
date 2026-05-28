import { ArtistType, CategoryIdEnum } from 'api/gen'
import { artistRoleLabelMapping } from 'features/artist/constants'

export function getArtistRole(role: ArtistType, category?: CategoryIdEnum) {
  const config = artistRoleLabelMapping[role]

  if (typeof config === 'string') {
    return config
  }

  if (category && config[category]) {
    return config[category] ?? 'Artiste'
  }

  return 'Artiste'
}
