import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { MovieCalendarResponse } from 'api/gen'
import { OfferNotFound } from 'features/offer/pages/OfferNotFound/OfferNotFound'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { locationStore } from 'libs/locationV2/location.store'
import { OfferNotFoundError } from 'libs/monitoring/errors'
import { QueryKeys } from 'libs/queryKeys'

const DEFAULT_RADIUS_KM = 50 // in kilometer

type props = {
  offerId: number
  allocineId?: string | null
  visa?: string | null
  offerVenueLatitude?: number | null
  offerVenueLongitude?: number | null
}

export const useOfferMovieCalendarQuery = <TData = MovieCalendarResponse>(
  { offerId, allocineId, visa, offerVenueLatitude, offerVenueLongitude }: props,
  options?: {
    enabled: boolean
    select?: (data: MovieCalendarResponse) => TData
  }
) => {
  const userLocation = locationStore.hooks.useUserLocation()
  const longitude = userLocation?.longitude ?? offerVenueLongitude ?? 0
  const latitude = userLocation?.latitude ?? offerVenueLatitude ?? 0
  const radius = DEFAULT_RADIUS_KM * 1000
  const { logType } = useLogTypeFromRemoteConfig()

  return useQuery<MovieCalendarResponse, Error, TData>({
    queryFn: async () => {
      if (!allocineId && !visa) {
        throw new OfferNotFoundError(offerId, {
          Screen: OfferNotFound,
          logType,
        })
      }
      return api.getNativeV1MovieCalendar(
        latitude,
        longitude,
        allocineId ?? undefined,
        allocineId ? undefined : (visa ?? undefined),
        radius
      )
    },
    queryKey: [QueryKeys.OFFER_MOVIE_CALENDAR, latitude, longitude, allocineId, visa, radius],
    select: options?.select,
    enabled: options?.enabled,
  })
}
