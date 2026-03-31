import { flatten } from 'lodash'

import { SearchFilter } from 'features/search/queries/useSearchOffersQuery/types'
import { mapAlgoliaVenueToAlgoliaVenueOfferListItem } from 'features/search/queries/useSearchVenuesQuery/helpers.ts/mapAlgoliaVenueToAlgoliaVenueOfferListItem'
import { FetchSearchVenuesResponse } from 'features/search/queries/useSearchVenuesQuery/types'

export const selectSearchVenues = (
  venues: FetchSearchVenuesResponse,
  selectedFilter: SearchFilter | null
) => {
  const flattenVenues = flatten(venues.venuesResponse?.hits)
  const isVenuesFilterActive = selectedFilter === null || selectedFilter === 'Lieux'

  return {
    algoliaVenues: isVenuesFilterActive ? flattenVenues : [],
    venues: isVenuesFilterActive
      ? flattenVenues.map((venue) => mapAlgoliaVenueToAlgoliaVenueOfferListItem(venue))
      : [],
    venuesUserData: venues.venuesResponse?.userData,
    venueNotOpenToPublic: flatten(venues.venueNotOpenToPublic?.hits),
  }
}
