import { useMemo, useRef } from 'react'
import { useQuery, useQueryClient } from 'react-query'

import { api } from 'api/api'
import { BookingsResponse } from 'api/gen'

export function useBookings(enabled: boolean) {
  return useQuery<BookingsResponse>('bookings', () => api.getnativev1bookings(), {
    enabled,
  })
}

export function useOngoingBooking(id: number, shouldRefetchAll: boolean) {
  const { data: bookings, refetch } = useBookings(false)
  const shouldRefetchRef = useRef(shouldRefetchAll)
  const client = useQueryClient()

  return useMemo(() => {
    const state = client.getQueryState<BookingsResponse>('bookings')
    const cachedBookings = state?.data

    if (shouldRefetchRef.current) {
      refetch()
      shouldRefetchRef.current = false
      return undefined
    }

    return cachedBookings?.ongoing_bookings?.find((item) => item.id === id)
  }, [id, bookings])
}
