import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { VenueMovieCalendarResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

type props = {
  venueId: number
  from: Date
  to: Date
}

export const useVenueMoviesCalendarQuery = <TData = VenueMovieCalendarResponse>(
  { venueId, from, to }: props,
  options?: {
    enabled: boolean
    select?: (data: VenueMovieCalendarResponse) => TData
  }
) => {
  const { user, isLoggedIn } = useAuthContext()

  return useQuery<VenueMovieCalendarResponse, Error, TData>({
    queryFn: async () => {
      return isLoggedIn
        ? api.getNativeV1VenuevenueIdMovieCalendarMe(venueId, from.toISOString(), to.toISOString()) // auto convert dates to utc timezone
        : api.getNativeV1VenuevenueIdMovieCalendar(venueId, from.toISOString(), to.toISOString()) // auto convert date to utc timezone
    },
    queryKey: [QueryKeys.VENUE_MOVIES_CALENDAR, user?.id, venueId, from, to],
    select: options?.select,
    enabled: options?.enabled,
  })
}
