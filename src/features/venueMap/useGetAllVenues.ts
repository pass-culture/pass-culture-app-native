import { useEffect } from 'react'
import { useQuery } from 'react-query'

import { Venue } from 'features/venue/types'
import { useVenueMapState } from 'features/venueMap/context/VenueMapWrapper'
import { getVenueTypeLabel } from 'features/venueMap/helpers/getVenueTypeLabel/getVenueTypeLabel'
import { getVenueTypeFacetFilters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/getVenueTypeFacetFilters'
import { buildVenueTypesPredicate } from 'libs/algolia/fetchAlgolia/buildVenuesQueryOptions'
import { fetchVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/fetchVenues'
import { FiltersArray } from 'libs/algolia/types'
import { LocationMode } from 'libs/location/types'
import { Region } from 'libs/maps/maps'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

type Props = {
  region: Region
  radius: number
  initialVenues?: Venue[]
}

export const useGetAllVenues = ({ region, radius, initialVenues }: Props) => {
  const netInfo = useNetInfoContext()
  const { venueMapState, dispatch } = useVenueMapState()

  const shouldFetchVenues = !!netInfo.isConnected && !initialVenues?.length

  const facetFilters: FiltersArray = venueMapState.venueTypeCode
    ? [
        buildVenueTypesPredicate([
          getVenueTypeFacetFilters(getVenueTypeLabel(venueMapState.venueTypeCode)),
        ]),
      ]
    : []

  const { data: fetchedVenues } = useQuery<Venue[]>(
    [QueryKeys.VENUES, region, venueMapState.venueTypeCode],
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
          facetFilters,
        },
      }),
    {
      enabled: shouldFetchVenues,
    }
  )

  const venues = initialVenues?.length ? initialVenues : fetchedVenues

  useEffect(() => {
    if (venues) {
      dispatch({ type: 'SET_VENUES', payload: venues })
    }
  }, [venues, dispatch, initialVenues])

  return { venues }
}
