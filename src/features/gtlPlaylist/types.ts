import { VenueResponse } from 'api/gen'
import { OffersModuleParameters } from 'features/home/types'
import { AlgoliaOffer, LocationMode, PlaylistOffersParams } from 'libs/algolia/types'
import { DisplayParametersFields, Layout } from 'libs/contentful/types'
import { Position } from 'libs/location/types'
import { QueryKeys } from 'libs/queryKeys'

export type GtlPlaylistRequest = {
  id: string
  offersModuleParameters: OffersModuleParameters
  displayParameters: DisplayParametersFields
}

export type GtlPlaylistData = {
  title: string
  offers: { hits: AlgoliaOffer[] }
  layout: Layout
  minNumberOfOffers: number
  entryId: string
}

export type UseGetOffersByGtlQueryArgs = {
  filteredGtlPlaylistsConfig: GtlPlaylistRequest[]
  venue?: Omit<VenueResponse, 'isVirtual'>
  searchIndex?: string
  userLocation: Position
  selectedLocationMode: LocationMode
  isUserUnderage: boolean
  adaptPlaylistParameters: (parameters: OffersModuleParameters) => PlaylistOffersParams
  queryKey: keyof typeof QueryKeys
}
