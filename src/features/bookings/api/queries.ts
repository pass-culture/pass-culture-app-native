import { useMemo } from 'react'
import { useQuery, useQueryClient } from 'react-query'

import { api } from 'api/api'
import { BookingsResponse } from 'api/gen'

export function useBookings() {
  return useQuery<BookingsResponse>('bookings', () => api.getnativev1bookings())
}

export function useOngoingBooking(id: number) {
  const client = useQueryClient()

  return useMemo(() => {
    const bookings = client.getQueryState<BookingsResponse>('bookings')?.data

    if (!bookings?.ongoing_bookings) {
      return undefined
    }

    return bookings?.ongoing_bookings.find((item) => item.id === id)
  }, [id])
}
