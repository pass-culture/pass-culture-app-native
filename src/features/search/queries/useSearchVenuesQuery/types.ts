import { VenuesUserData } from 'features/search/types'
import { AlgoliaVenue, AlgoliaVenueOfferListItem } from 'libs/algolia/types'

export type FetchSearchVenuesResponse = {
  venuesResponse: { hits: AlgoliaVenue[]; userData?: VenuesUserData | null } | undefined
  venueNotOpenToPublic: { hits: AlgoliaVenue[] } | undefined
}

export type SelectedSearchVenues = {
  algoliaVenues: AlgoliaVenue[]
  venues: AlgoliaVenueOfferListItem[]
  venuesUserData: VenuesUserData | null | undefined
  venueNotOpenToPublic: AlgoliaVenue[]
}
