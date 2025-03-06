import { VenueResponse } from 'api/gen'
import { getSearchNavConfig } from 'features/navigation/SearchStackNavigator/searchStackHelpers'
import { SearchStackParamList } from 'features/navigation/SearchStackNavigator/types'
import { useVenueSearchParameters } from 'features/venue/helpers/useVenueSearchParameters'

export const useNavigateToSearchWithVenueOffers = (venue: VenueResponse) => {
  const venueSearchParams: SearchStackParamList['SearchResults'] = useVenueSearchParameters(venue)
  return {
    ...getSearchNavConfig('SearchResults', {
      ...venueSearchParams,
    }),
    withPush: true,
  }
}
