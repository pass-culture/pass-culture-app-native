import { navigateFromRef } from 'features/navigation/navigationRef'

export function navigateToBooking(bookingId: number) {
  navigateFromRef('BookingDetails', { id: bookingId })
}
