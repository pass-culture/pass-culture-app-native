import { useBookingsQuery } from 'queries/bookings/useBookingsQuery'

export function useUserHasBookingsQuery() {
  const { data: bookings } = useBookingsQuery()
  const { ongoing_bookings: ongoingBookings = [], ended_bookings: endedBookings = [] } =
    bookings ?? {}
  return ongoingBookings.length > 0 || endedBookings.length > 0
}
