import React from 'react'

import { BookingReponse } from 'api/gen'
import { BookingDetailsTicketContent } from 'features/bookings/components/BookingDetailsTicketContent'
import { QrCodeWithSeatProps } from 'features/bookings/components/TicketBody/QrCodeWithSeat/QrCodeWithSeat'

type Props = {
  booking: BookingReponse
  externalBookings?: QrCodeWithSeatProps
  testID?: string
}

export function TicketWithContent({ booking, externalBookings }: Readonly<Props>) {
  return <BookingDetailsTicketContent booking={booking} externalBookings={externalBookings} />
}
