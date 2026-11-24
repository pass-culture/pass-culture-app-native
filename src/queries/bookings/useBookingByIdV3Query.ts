import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { BookingResponseV3 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { QueryKeys } from 'libs/queryKeys'
import { queryClient } from 'libs/react-query/queryClient'
import { CustomQueryOptions } from 'libs/react-query/types'

const GC_TIME_TWENTY_FOUR_DAYS = 1000 * 60 * 60 * 24 * 24

const bookingByIdV3QueryOptions = (id: number, isLoggedIn: boolean) => ({
  queryKey: [QueryKeys.BOOKINGV3, id],
  queryFn: () => api.getNativeV3BookingsbookingId(id),
  meta: { persist: true, private: true },
  enabled: isLoggedIn,
  gcTime: GC_TIME_TWENTY_FOUR_DAYS,
})

export const useBookingByIdV3Query = <TSelect = BookingResponseV3>(
  id: number,
  options?: CustomQueryOptions<BookingResponseV3, TSelect>
) => {
  const { isLoggedIn } = useAuthContext()
  return useQuery({ ...bookingByIdV3QueryOptions(id, isLoggedIn), ...options })
}

export const prefetchBookingByIdV3Query = (id: number, isLoggedIn: boolean) =>
  queryClient.prefetchQuery(bookingByIdV3QueryOptions(id, isLoggedIn))
