import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { MovieCalendarResponse, MovieScreeningsRequest } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'
import { CustomQueryOptions } from 'libs/react-query/types'

export const useMovieCalendarQuery = <TSelect = MovieCalendarResponse>(
  params: MovieScreeningsRequest,
  options?: CustomQueryOptions<MovieCalendarResponse, TSelect>
) =>
  useQuery({
    queryKey: [QueryKeys.MOVIE_CALENDAR, params],
    queryFn: () =>
      api.getNativeV1MovieCalendar(
        params.latitude,
        params.longitude,
        params.allocineId ?? undefined,
        params.visa ?? undefined,
        params.aroundRadius,
        params.from,
        params.to
      ),
    ...options,
  })
