import { useMemo } from 'react'

import { VenueResponse } from 'api/gen'
import { getSearchNavConfig } from 'features/navigation/SearchStackNavigator/getSearchNavConfig'
import { SearchStackParamList } from 'features/navigation/SearchStackNavigator/SearchStackTypes'
import { useVenueSearchParameters } from 'features/venue/helpers/useVenueSearchParameters'

export const useNavigateToSearchWithVenueOffers = (venue: VenueResponse) => {
  const venueSearchParams: SearchStackParamList['SearchResults'] = useVenueSearchParameters(venue)
  return useMemo(
    () => ({
      ...getSearchNavConfig('SearchResults', {
        ...venueSearchParams,
      }),
      withPush: true,
    }),
    [venueSearchParams]
  )
}
