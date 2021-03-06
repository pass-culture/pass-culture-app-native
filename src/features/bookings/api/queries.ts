import { useQuery, useQueryClient } from 'react-query'

import { api } from 'api/api'
import { BookingReponse, BookingsResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

export function useBookings() {
  return useQuery<BookingsResponse>(QueryKeys.BOOKINGS, () => api.getnativev1bookings())
}

export function useOngoingOrEndedBooking(id: number): BookingReponse | undefined {
  const client = useQueryClient()
  const state = client.getQueryState<BookingsResponse>(QueryKeys.BOOKINGS)
  const onGoingBooking = state?.data?.ongoing_bookings?.find((item) => item.id === id)
  const endedBooking = state?.data?.ended_bookings?.find((item) => item.id === id)
  return onGoingBooking || endedBooking
}
