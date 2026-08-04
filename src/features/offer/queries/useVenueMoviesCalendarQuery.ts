import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { VenueMovieCalendarResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

type props = {
  venueId: number
}

export const useVenueMoviesCalendarQuery = <TData = VenueMovieCalendarResponse>(
  { venueId }: props,
  options?: {
    enabled: boolean
    select?: (data: VenueMovieCalendarResponse) => TData
  }
) => {
  const { user, isLoggedIn } = useAuthContext()

  return useQuery<VenueMovieCalendarResponse, Error, TData>({
    queryFn: async () => {
      return isLoggedIn
        ? api.getNativeV1VenuevenueIdMovieCalendarMe(venueId)
        : api.getNativeV1VenuevenueIdMovieCalendar(venueId)
    },
    queryKey: [QueryKeys.VENUE_MOVIES_CALENDAR, user?.id, venueId],
    select: options?.select,
    enabled: options?.enabled,
  })
}
