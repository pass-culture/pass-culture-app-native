import { BookingResponse, BookingsResponseV2 } from 'api/gen'

export const findOngoingOrEndedBooking = (bookings: BookingsResponseV2 | null, id: number) => {
  const onGoingBooking = bookings?.ongoingBookings?.find((item: BookingResponse) => item.id === id)
  const endedBooking = bookings?.endedBookings?.find((item: BookingResponse) => item.id === id)

  return onGoingBooking ?? (endedBooking || null)
}
