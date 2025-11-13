import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { BookingResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'
import { CustomQueryOptions } from 'libs/react-query/types'

export const useBookingsByIdQuery = <TSelect = BookingResponse>(
  id: number,
  options?: CustomQueryOptions<BookingResponse, TSelect>
) =>
  useQuery({
    queryKey: [QueryKeys.BOOKINGSV2, id],
    queryFn: () => api.getNativeV2BookingsbookingId(id),
    ...options,
  })
