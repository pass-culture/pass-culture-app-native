import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { BookingResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'
import { queryClient } from 'libs/react-query/queryClient'
import { CustomQueryOptions } from 'libs/react-query/types'

const bookingByIdQueryOptions = (id: number) => ({
  queryKey: [QueryKeys.BOOKINGSV2, id],
  queryFn: () => api.getNativeV2BookingsbookingId(id),
  meta: { persist: true },
  gcTime: Infinity,
})

export const useBookingByIdQuery = <TSelect = BookingResponse>(
  id: number,
  options?: CustomQueryOptions<BookingResponse, TSelect>
) => useQuery({ ...bookingByIdQueryOptions(id), ...options })

export const prefetchBookingByIdQuery = (id: number) =>
  queryClient.prefetchQuery(bookingByIdQueryOptions(id))
