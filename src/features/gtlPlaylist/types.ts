import { OffersModuleParameters } from 'features/home/types'
import { AlgoliaHit } from 'libs/algolia/types'
import { Layout, DisplayParametersFields } from 'libs/contentful/types'

export type GtlPlaylistRequest = {
  id: string
  offersModuleParameters: OffersModuleParameters
  displayParameters: DisplayParametersFields
}

export type GtlPlaylistData = {
  title: string
  offers: { hits: AlgoliaHit[] }
  layout: Layout
  minNumberOfOffers: number
  entryId: string
}
