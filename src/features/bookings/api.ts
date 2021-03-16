import { useQuery } from 'react-query'

import { api } from 'api/api'
import { BookingsResponse } from 'api/gen'

export function useBookings() {
  return useQuery<BookingsResponse>('bookings', () => api.getnativev1bookings())
}
