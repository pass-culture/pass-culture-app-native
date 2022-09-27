import { useBookings } from 'features/bookings/api'

export function useUserHasBookings() {
  const { data: bookings } = useBookings()
  const { ongoing_bookings: ongoingBookings = [], ended_bookings: endedBookings = [] } =
    bookings || {}
  return ongoingBookings.length > 0 || endedBookings.length > 0
}
