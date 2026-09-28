import { ArtistHighlightingModule, HomepageModuleType } from 'features/home/types'
import { ArtistHighlightingContentModel } from 'libs/contentful/types'

export const adaptArtistHighlightingModule = (
  module: ArtistHighlightingContentModel
): ArtistHighlightingModule | null => {
  // if a mandatory module is unpublished/deleted, we can't handle the module, so we return null
  if (module.fields === undefined) return null

  return {
    type: HomepageModuleType.ArtistHighlightingModule,
    id: module.sys.id,
    artistId: module.fields.artistId,
    subtitle: module.fields.subtitle,
    description: module.fields.description,
    color: module.fields.color,
  }
}
