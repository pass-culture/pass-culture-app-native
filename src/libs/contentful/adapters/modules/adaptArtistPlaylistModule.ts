import { ArtistPlaylistModule, HomepageModuleType } from 'features/home/types'
import { buildOffersParams } from 'libs/contentful/adapters/helpers/buildOffersParams'
import { ArtistPlaylistContentModel } from 'libs/contentful/types'

export const adaptArtistPlaylistModule = (
  module: ArtistPlaylistContentModel
): ArtistPlaylistModule | null => {
  // if a mandatory module is unpublished/deleted, we can't handle the module, so we return null
  if (module.fields === undefined) return null
  if (module.fields.displayParameters.fields === undefined) return null

  const offersList = buildOffersParams(module.fields.algoliaParameters, [])

  if (offersList.length === 0) return null

  return {
    type: HomepageModuleType.ArtistPlaylistModule,
    id: module.sys.id,
    title: module.fields.title,
    artistId: module.fields.artistId,
    displayParameters: module.fields.displayParameters.fields,
    offersModuleParameters: offersList,
  }
}
