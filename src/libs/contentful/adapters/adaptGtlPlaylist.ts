import { GtlPlaylistRequest } from 'features/gtlPlaylist/types'
import { adaptOffersModuleParameters } from 'libs/contentful/adapters/modules/helpers/adaptOffersModuleParameters'
import { GtlPlaylist as ContentfulGtlPlaylist } from 'libs/contentful/types'

export const adaptGtlPlaylist = (gtlPlaylist: ContentfulGtlPlaylist): GtlPlaylistRequest | null => {
  // if a mandatory module is unpublished/deleted, we can't handle the module, so we return null
  if (gtlPlaylist.fields === undefined) return null
  if (gtlPlaylist.fields.displayParameters.fields === undefined) return null

  const offerParams = adaptOffersModuleParameters(gtlPlaylist.fields.algoliaParameters)

  if (!offerParams) return null

  return {
    id: gtlPlaylist.sys.id,
    displayParameters: gtlPlaylist.fields.displayParameters.fields,
    offersModuleParameters: offerParams,
  }
}
