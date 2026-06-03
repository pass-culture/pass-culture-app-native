import { ArtistType, CategoryIdEnum } from 'api/gen'
import { artistRoleLabelMapping } from 'features/artist/constants'

export function getArtistRole(role: ArtistType, category?: CategoryIdEnum, isPlural = false) {
  const config = artistRoleLabelMapping[role]
  const defaultConfig = { singular: 'Artiste', plural: 'Artistes' }

  let target = defaultConfig

  if (config) {
    if ('singular' in config) {
      target = config
    } else if (category) {
      const categoryConfig = config[category]

      if (categoryConfig) {
        target = categoryConfig
      }
    }
  }

  return isPlural ? target.plural : target.singular
}
