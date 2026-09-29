import { ArtistEditorialModule, HomepageModuleType } from 'features/home/types'
import { buildOffersParams } from 'libs/contentful/adapters/helpers/buildOffersParams'
import { ArtistEditorialContentModel } from 'libs/contentful/types'

export const adaptArtistEditorialModule = (
  module: ArtistEditorialContentModel
): ArtistEditorialModule | null => {
  // if a mandatory module is unpublished/deleted, we can't handle the module, so we return null
  if (module.fields === undefined) return null

  const offersList = buildOffersParams(module.fields.algoliaParameters, [])

  if (offersList.length === 0) return null

  return {
    type: HomepageModuleType.ArtistEditorialModule,
    id: module.sys.id,
    title: module.fields.title,
    artistId: module.fields.artistId,
    color: module.fields.color,
    illustration: module.fields.illustration,
    offersModuleParameters: offersList,
  }
}
