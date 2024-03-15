import { VenueResponse } from 'api/gen'
import { SearchStackParamList } from 'features/navigation/SearchNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SearchView } from 'features/search/types'
import { useVenueSearchParameters } from 'features/venue/helpers/useVenueSearchParameters'

export const useNavigateToSearchWithVenueOffers = (venue: VenueResponse) => {
  const venueSearchParams: SearchStackParamList['Search'] = useVenueSearchParameters(venue)
  const searchTabNavConfig = getTabNavConfig('SearchStackNavigator', {
    screen: 'Search',
    params: {
      ...venueSearchParams,
      view: SearchView.Results,
    },
  })
  return {
    screen: searchTabNavConfig[0],
    params: searchTabNavConfig[1],
    withPush: true,
  }
}
