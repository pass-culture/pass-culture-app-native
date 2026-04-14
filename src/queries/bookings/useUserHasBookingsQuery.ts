import { BookingsResponseV2 } from 'api/gen'
import { useBookingsV2Query } from 'queries/bookings'

const hasUserBookings = (bookings: BookingsResponseV2 | undefined) => {
  const { ongoingBookings = [], endedBookings = [] } = bookings ?? {}
  return ongoingBookings.length > 0 || endedBookings.length > 0
}

export const useUserHasBookingsQueryV2 = (enabledQuery: boolean) =>
  useBookingsV2Query(enabledQuery, (data) => hasUserBookings(data))
