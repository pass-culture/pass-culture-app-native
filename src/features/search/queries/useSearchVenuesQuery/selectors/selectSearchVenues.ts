import { flatten } from 'lodash'

import { SelectSearchOffersParams } from 'features/search/queries/useSearchOffersQuery/types'
import { mapAlgoliaVenueToAlgoliaVenueOfferListItem } from 'features/search/queries/useSearchVenuesQuery/helpers.ts/mapAlgoliaVenueToAlgoliaVenueOfferListItem'
import { FetchSearchVenuesResponse } from 'features/search/queries/useSearchVenuesQuery/types'

export const selectSearchVenues = (
  venues: FetchSearchVenuesResponse,
  selectedFilter: SelectSearchOffersParams['selectedFilter']
) => {
  const isVenuesFilterActive = selectedFilter === null || selectedFilter === 'Lieux'
  const flattenVenues = flatten(venues.venuesResponse?.hits)

  return {
    algoliaVenues: isVenuesFilterActive ? flattenVenues : [],
    venues: isVenuesFilterActive
      ? flattenVenues.map((venue) => mapAlgoliaVenueToAlgoliaVenueOfferListItem(venue))
      : [],
    venuesUserData: venues.venuesResponse?.userData,
    venueNotOpenToPublic: isVenuesFilterActive ? flatten(venues.venueNotOpenToPublic?.hits) : [],
  }
}
