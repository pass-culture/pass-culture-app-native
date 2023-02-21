import { useEffect } from 'react'
import { useQuery } from 'react-query'

import { VenuesModule } from 'features/home/types'
import { VenueHit } from 'libs/algolia'
import { fetchMultipleVenues } from 'libs/algolia/fetchAlgolia/fetchMultipleVenues'
import { useGeolocation } from 'libs/geolocation'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

export const useVenueModule = ({
  venuesParameters,
  id,
}: Pick<VenuesModule, 'venuesParameters' | 'id'>): VenueHit[] | undefined => {
  const { position } = useGeolocation()
  const netInfo = useNetInfoContext()

  const { data, refetch } = useQuery(
    [QueryKeys.HOME_VENUES_MODULE, id],
    async () => fetchMultipleVenues(venuesParameters, position),
    { enabled: !!netInfo.isConnected }
  )

  useEffect(() => {
    // When we enable or disable the geolocation, we want to refetch the home modules
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!position])

  return data
}
