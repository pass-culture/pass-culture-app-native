import { VenueResponse } from 'api/gen'
import { getSearchNavConfig } from 'features/navigation/SearchStackNavigator/getSearchNavConfig'
import { SearchStackParamList } from 'features/navigation/SearchStackNavigator/SearchStackTypes'
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
