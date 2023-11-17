import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { TabParamList } from 'features/navigation/TabBar/types'
import { SearchView } from 'features/search/types'
import { useVenueSearchParameters } from 'features/venue/helpers/useVenueSearchParameters/useVenueSearchParameters'

export const useVenueOffersSearchNavigateTo = (venueId: number) => {
  const venueSearchParams: TabParamList['Search'] = useVenueSearchParameters(venueId)
  const searchTabNavConfig = getTabNavConfig('Search', {
    ...venueSearchParams,
    previousView: SearchView.Results,
    view: SearchView.Results,
  })

  return {
    screen: searchTabNavConfig[0],
    params: searchTabNavConfig[1],
    withPush: true,
  }
}
