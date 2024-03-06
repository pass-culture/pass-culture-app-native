import { VenueResponse } from 'api/gen'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { TabParamList } from 'features/navigation/TabBar/types'
import { SearchView } from 'features/search/types'
import { useVenueSearchParameters } from 'features/venue/helpers/useVenueSearchParameters'

export const useNavigateToSearchWithVenueOffers = (venue: VenueResponse) => {
  const venueSearchParams: TabParamList['Search'] = useVenueSearchParameters(venue)
  const searchTabNavConfig = getTabNavConfig('Search', {
    ...venueSearchParams,
    view: SearchView.Results,
  })
  return {
    screen: searchTabNavConfig[0],
    params: searchTabNavConfig[1],
    withPush: true,
  }
}
