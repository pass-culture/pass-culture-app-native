import { useQuery } from '@tanstack/react-query'

import { Activity } from 'api/gen'
import { DEFAULT_RADIUS } from 'features/search/constants'
import { Venue } from 'features/venue/types'
import { buildActivitiesPredicate } from 'libs/algolia/fetchAlgolia/buildVenuesQueryOptions'
import { fetchVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/fetchVenues'
import { LocationMode } from 'libs/location/types'
import { Region } from 'libs/maps/maps'
import { QueryKeys } from 'libs/queryKeys'

type Props = {
  region: Region
  radius?: number
}

export function useVenuesInRegionQuery<TData = Awaited<ReturnType<typeof fetchVenues>>>({
  region,
  radius = DEFAULT_RADIUS,
  select,
}: Props & { select?: (data: Venue[]) => TData }) {
  const allActivities = Object.values(Activity)
  const activityFilters = buildActivitiesPredicate(allActivities)

  return useQuery({
    queryKey: [QueryKeys.VENUES, JSON.stringify(region), radius],
    queryFn: () =>
      fetchVenues({
        query: '',
        buildLocationParameterParams: {
          userLocation: { latitude: region.latitude, longitude: region.longitude },
          selectedLocationMode: LocationMode.AROUND_PLACE,
          aroundMeRadius: 'all',
          aroundPlaceRadius: radius,
        },
        options: {
          hitsPerPage: 1000, // the maximum, cf.: https://www.algolia.com/doc/api-reference/api-parameters/hitsPerPage/#usage-notes
          facetFilters: [activityFilters],
        },
      }),
    enabled: Object.keys(region).length > 0,
    select,
  })
}
