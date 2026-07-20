import { useMemo } from 'react'

import { OfferResponse } from 'api/gen'
import { useUserLocation as useStoreUserLocation } from 'libs/locationV2/location.store'

export const useUserLocation = (offer?: OfferResponse) => {
  const userLocation = useStoreUserLocation()

  const location = useMemo(
    () =>
      userLocation ?? {
        latitude: offer?.venue.coordinates.latitude ?? 0,
        longitude: offer?.venue.coordinates.longitude ?? 0,
      },
    [offer?.venue.coordinates.latitude, offer?.venue.coordinates.longitude, userLocation]
  )

  return location
}
