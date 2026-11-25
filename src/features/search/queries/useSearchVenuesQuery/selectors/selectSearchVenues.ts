import {
  FetchSearchVenuesResponse,
  SelectedSearchVenues,
} from 'features/search/queries/useSearchVenuesQuery/types'

export const selectSearchVenues = (
  venuesResponse: FetchSearchVenuesResponse | null
): SelectedSearchVenues => {
  const flattenVenues = (venuesResponse?.venuesResponse?.hits ?? []).flat()

  return {
    venues: flattenVenues,
    venuesUserData: venuesResponse?.venuesResponse?.userData,
    venueNotOpenToPublic: (venuesResponse?.venueNotOpenToPublic?.hits ?? []).flat(),
  }
}
