import { BookingsResponseV2 } from 'api/gen'
import { useBookingsQuery, useBookingsQueryV2 } from 'queries/bookings'

export const useUserHasBookingsQueryV1 = () => {
  const { data: bookings } = useBookingsQuery()
  const { ongoing_bookings: ongoingBookings = [], ended_bookings: endedBookings = [] } =
    bookings ?? {}
  return ongoingBookings.length > 0 || endedBookings.length > 0
}

const hasUserBookings = (bookings: BookingsResponseV2 | undefined) => {
  const { ongoingBookings = [], endedBookings = [] } = bookings ?? {}
  return ongoingBookings.length > 0 || endedBookings.length > 0
}

export const useUserHasBookingsQuery = (enabledQuery: boolean) =>
  useBookingsQueryV2(enabledQuery, (data) => hasUserBookings(data))
