import { OffersModuleParameters } from 'features/home/types'
import { AlgoliaOffer } from 'libs/algolia/types'
import { Layout, DisplayParametersFields } from 'libs/contentful/types'

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
