import { VenuesUserData } from 'features/search/types'
import { AlgoliaVenue } from 'libs/algolia/types'

export type FetchSearchVenuesResponse = {
  venuesResponse:
    { hits: AlgoliaVenue[]; userData?: Exclude<VenuesUserData, undefined> | null } | undefined
  venueNotOpenToPublic: { hits: AlgoliaVenue[] } | undefined
}

export type SelectedSearchVenues = {
  venues: AlgoliaVenue[]
  venuesUserData: VenuesUserData | null | undefined
  venueNotOpenToPublic: AlgoliaVenue[]
}
