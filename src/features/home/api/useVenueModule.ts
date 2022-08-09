import { useEffect } from 'react'
import { useQuery } from 'react-query'

import { VenuesModule } from 'features/home/contentful'
import { fetchMultipleVenues } from 'libs/algolia/fetchAlgolia/fetchMultipleVenues'
import { useGeolocation } from 'libs/geolocation'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { VenueHit } from 'libs/search'

export const useVenueModule = ({
  search,
  moduleId,
}: Pick<VenuesModule, 'search' | 'moduleId'>): VenueHit[] | undefined => {
  const { position } = useGeolocation()
  const netInfo = useNetInfoContext()

  const { data, refetch } = useQuery(
    [QueryKeys.HOME_VENUES_MODULE, moduleId],
    async () => fetchMultipleVenues(search, position),
    { enabled: !!netInfo.isConnected }
  )

  useEffect(() => {
    // When we enable or disable the geolocation, we want to refetch the home modules
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!position])

  return data
}
