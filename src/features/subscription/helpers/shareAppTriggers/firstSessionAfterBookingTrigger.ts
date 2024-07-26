import { BookingsResponse } from 'api/gen'

import { ShareAppModalTrigger } from '../useShareAppModaleTrigger'

type Params = {
  currentDate: Date
  ongoingBookings: BookingsResponse['ongoing_bookings']
}

export const firstSessionAfterBookingTrigger =
  ({ currentDate, ongoingBookings }: Params): ShareAppModalTrigger =>
  () => {
    const lastBooking = ongoingBookings[0]
    const hasNotUseBooking = !lastBooking?.dateUsed
    if (hasNotUseBooking) return false
    const isLastBookingUsed = new Date(lastBooking.dateUsed as string) >= currentDate
    return isLastBookingUsed
  }
