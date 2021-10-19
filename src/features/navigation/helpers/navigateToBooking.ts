import { navigationRef } from 'features/navigation/navigationRef'

export function navigateToBooking(bookingId: number) {
  navigationRef.current?.navigate('BookingDetails', { id: bookingId })
}
