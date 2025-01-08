import { useEffect } from 'react'
import { useQuery } from 'react-query'

import { Venue } from 'features/venue/types'
import { venuesActions } from 'features/venueMap/store/venuesStore'
import { fetchVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/fetchVenues'
import { LocationMode } from 'libs/location/types'
import { Region } from 'libs/maps/maps'
import { QueryKeys } from 'libs/queryKeys'

type Props = {
  region: Region
  radius: number
  initialVenues?: Venue[]
}

export const useGetAllVenues = ({ region, radius, initialVenues }: Props) => {
  const { setVenues } = venuesActions

  const { data: fetchedVenues } = useQuery<Venue[]>(
    [QueryKeys.VENUES, region],
    () =>
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
        },
      }),
    {
      enabled: !initialVenues?.length,
    }
  )

  const venues = initialVenues?.length ? initialVenues : fetchedVenues

  useEffect(() => {
    if (venues) {
      // TODO(PC-33101) maybe store venues by venue type codes ?
      setVenues(venues)
    }
  }, [venues, setVenues, initialVenues])

  return { venues }
}
