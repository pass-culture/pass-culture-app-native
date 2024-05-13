import { OffersModuleParameters } from 'features/home/types'
import { Layout, DisplayParametersFields } from 'libs/contentful/types'
import { Offer } from 'shared/offer/types'

export type GtlPlaylistRequest = {
  id: string
  offersModuleParameters: OffersModuleParameters
  displayParameters: DisplayParametersFields
}

export type GtlPlaylistData = {
  title: string
  offers: { hits: Offer[] }
  layout: Layout
  minNumberOfOffers: number
  entryId: string
}
