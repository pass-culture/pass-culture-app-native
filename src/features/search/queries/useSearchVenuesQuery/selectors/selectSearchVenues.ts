import { flatten } from 'lodash'

import {
  FetchSearchVenuesResponse,
  SelectedSearchVenues,
} from 'features/search/queries/useSearchVenuesQuery/types'

export const selectSearchVenues = (
  venuesResponse: FetchSearchVenuesResponse | null
): SelectedSearchVenues => {
  const flattenVenues = flatten(venuesResponse?.venuesResponse?.hits)

  return {
    venues: flattenVenues,
    venuesUserData: venuesResponse?.venuesResponse?.userData,
    venueNotOpenToPublic: flatten(venuesResponse?.venueNotOpenToPublic?.hits),
  }
}
