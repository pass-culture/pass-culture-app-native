import { flatten } from 'lodash'

import { mapAlgoliaVenueToAlgoliaVenueOfferListItem } from 'features/search/queries/useSearchVenuesQuery/helpers.ts/mapAlgoliaVenueToAlgoliaVenueOfferListItem'
import { FetchSearchVenuesResponse } from 'features/search/queries/useSearchVenuesQuery/types'

export const selectSearchVenues = (venues: FetchSearchVenuesResponse) => {
  const flattenVenues = flatten(venues.venuesResponse?.hits)
  return {
    algoliaVenues: flattenVenues,
    venues: flattenVenues.map((venue) => mapAlgoliaVenueToAlgoliaVenueOfferListItem(venue)),
    venuesUserData: venues.venuesResponse?.userData,
    venueNotOpenToPublic: flatten(venues.venueNotOpenToPublic?.hits),
  }
}
