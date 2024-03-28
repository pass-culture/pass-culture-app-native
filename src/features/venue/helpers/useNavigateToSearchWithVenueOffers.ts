import { VenueResponse } from 'api/gen'
import { getSearchStackConfig } from 'features/navigation/SearchStackNavigator/helpers'
import { SearchStackParamList } from 'features/navigation/SearchStackNavigator/types'
import { useVenueSearchParameters } from 'features/venue/helpers/useVenueSearchParameters'

export const useNavigateToSearchWithVenueOffers = (venue: VenueResponse) => {
  const venueSearchParams: SearchStackParamList['SearchResults'] = useVenueSearchParameters(venue)
  const searchTabNavConfig = getSearchStackConfig('SearchResults', {
    ...venueSearchParams,
  })
  return {
    screen: searchTabNavConfig[0],
    params: searchTabNavConfig[1],
    withPush: true,
  }
}
