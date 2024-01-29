import { GtlPlaylistRequest } from 'features/gtlPlaylist/types'
import { buildOffersParams } from 'libs/contentful/adapters/helpers/buildOffersParams'
import { GtlPlaylist as ContentfulGtlPlaylist } from 'libs/contentful/types'

export const adaptGtlPlaylist = (gtlPlaylist: ContentfulGtlPlaylist): GtlPlaylistRequest | null => {
  // if a mandatory module is unpublished/deleted, we can't handle the module, so we return null
  if (gtlPlaylist.fields === undefined) return null
  if (gtlPlaylist.fields.displayParameters.fields === undefined) return null

  const additionalAlgoliaParameters = gtlPlaylist.fields.additionalAlgoliaParameters ?? []

  const offersList = buildOffersParams(
    gtlPlaylist.fields.algoliaParameters,
    additionalAlgoliaParameters
  )

  if (offersList.length === 0) return null

  return {
    displayParameters: gtlPlaylist.fields.displayParameters.fields,
    offersModuleParameters: offersList,
  }
}
