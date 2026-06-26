import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { BookingResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { QueryKeys } from 'libs/queryKeys'
import { queryClient } from 'libs/react-query/queryClient'
import { CustomQueryOptions } from 'libs/react-query/types'

const GC_TIME_TWENTY_FOUR_DAYS = 1000 * 60 * 60 * 24 * 24

const bookingByIdQueryOptions = (id: number, isLoggedIn: boolean) => ({
  queryKey: [QueryKeys.BOOKINGSV2, id],
  queryFn: () => api.getNativeV2BookingsbookingId(id),
  meta: { persist: true, private: true },
  enabled: isLoggedIn,
  gcTime: GC_TIME_TWENTY_FOUR_DAYS,
})

export const useBookingByIdQuery = <TSelect = BookingResponse>(
  id: number,
  options?: CustomQueryOptions<BookingResponse, TSelect>
) => {
  const { isLoggedIn } = useAuthContext()
  return useQuery({ ...bookingByIdQueryOptions(id, isLoggedIn), ...options })
}
export const prefetchBookingByIdQuery = (id: number, isLoggedIn: boolean) =>
  queryClient.prefetchQuery(bookingByIdQueryOptions(id, isLoggedIn))
