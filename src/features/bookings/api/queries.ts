import { useQuery, UseQueryResult } from 'react-query'

import { api } from 'api/api'
import { BookingReponse, BookingsResponse } from 'api/gen'
import { useNetwork } from 'libs/network/useNetwork'
import { QueryKeys } from 'libs/queryKeys'

export function useBookings(options = {}) {
  const { isConnected } = useNetwork()

  return useQuery<BookingsResponse>(QueryKeys.BOOKINGS, () => api.getnativev1bookings(), {
    enabled: isConnected,
    ...options,
  })
}

export function useOngoingOrEndedBooking(id: number): UseQueryResult<BookingReponse | null> {
  return useBookings({
    select(bookings: BookingsResponse | null) {
      if (!bookings) {
        return null
      }
      const onGoingBooking = bookings.ongoing_bookings?.find(
        (item: BookingReponse) => item.id === id
      )
      const endedBooking = bookings.ended_bookings?.find((item: BookingReponse) => item.id === id)

      const selected = onGoingBooking || endedBooking
      if (!selected) {
        return null
      }
      return selected
    },
  }) as UseQueryResult<BookingReponse | null>
}
