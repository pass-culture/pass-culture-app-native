import { useEffect, useState } from 'react'

import { fetchVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/fetchVenues'
import { useLocation } from 'libs/location'

const fakeVenueId = 283

export const useSomeVenueId = () => {
  // We don't use react-query as this is a query only used on the cheatcodes to debug
  const [venueId, setVenueId] = useState<number>(fakeVenueId)
  const { userLocation, selectedLocationMode, aroundMeRadius, aroundPlaceRadius } = useLocation()

  useEffect(() => {
    fetchVenues({
      query: '',
      buildLocationParameterParams: {
        userLocation,
        selectedLocationMode,
        aroundMeRadius,
        aroundPlaceRadius,
      },
    })
      .then(([venue]) => venue.venueId && setVenueId(venue.venueId))
      .catch(() => {
        // The cheatcodes are only in testing
        // eslint-disable-next-line no-console
        console.log('Cannot fetch venue ids')
      })
  }, [aroundMeRadius, aroundPlaceRadius, selectedLocationMode, userLocation])

  return venueId
}
