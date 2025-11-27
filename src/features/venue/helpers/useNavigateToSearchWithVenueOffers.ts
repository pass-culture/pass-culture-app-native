import { useMemo } from 'react'

import { VenueResponse } from 'api/gen'
import { getSearchPropConfig } from 'features/navigation/SearchStackNavigator/getSearchPropConfig'
import { SearchStackParamList } from 'features/navigation/SearchStackNavigator/SearchStackTypes'
import { useVenueSearchParameters } from 'features/venue/helpers/useVenueSearchParameters'

export const useNavigateToSearchWithVenueOffers = (venue: Omit<VenueResponse, 'isVirtual'>) => {
  const venueSearchParams: SearchStackParamList['SearchResults'] = useVenueSearchParameters(venue)
  return useMemo(
    () => ({
      ...getSearchPropConfig('SearchResults', {
        ...venueSearchParams,
      }),
      withPush: true,
    }),
    [venueSearchParams]
  )
}
