import { VenueResponse } from 'api/gen'
import { getNavigateToConfig } from 'features/navigation/SearchStackNavigator/helpers'
import { SearchStackParamList } from 'features/navigation/SearchStackNavigator/types'
import { useVenueSearchParameters } from 'features/venue/helpers/useVenueSearchParameters'

export const useNavigateToSearchWithVenueOffers = (venue: VenueResponse) => {
  const venueSearchParams: SearchStackParamList['SearchResults'] = useVenueSearchParameters(venue)
  return {
    ...getNavigateToConfig('SearchResults', {
      ...venueSearchParams,
    }),
    withPush: true,
  }
}
