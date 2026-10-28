import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { VenueMovieCalendarResponseV2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

type props = {
  venueId: number
  from: Date
  to: Date
}

export const useVenueMoviesCalendarQuery = <TData = VenueMovieCalendarResponseV2>(
  { venueId, from, to }: props,
  options?: {
    enabled: boolean
    select?: (data: VenueMovieCalendarResponseV2) => TData
  }
) => {
  const { user, isLoggedIn } = useAuthContext()

  return useQuery<VenueMovieCalendarResponseV2, Error, TData>({
    queryFn: async () => {
      return isLoggedIn
        ? api.getNativeV2VenuevenueIdMovieCalendarMe(venueId, from.toISOString(), to.toISOString()) // auto convert dates to utc timezone
        : api.getNativeV2VenuevenueIdMovieCalendar(venueId, from.toISOString(), to.toISOString()) // auto convert date to utc timezone
    },
    queryKey: [QueryKeys.VENUE_MOVIES_CALENDAR, user?.id, venueId, from, to],
    select: options?.select,
    enabled: options?.enabled,
  })
}
