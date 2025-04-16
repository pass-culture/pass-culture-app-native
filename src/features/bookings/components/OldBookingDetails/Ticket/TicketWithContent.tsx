import React from 'react'

import { BookingReponse } from 'api/gen'
import { BookingDetailsTicketContent } from 'features/bookings/components/OldBookingDetails/BookingDetailsTicketContent'
import { ThreeShapesTicket } from 'features/bookings/components/OldBookingDetails/ThreeShapesTicket'
import { QrCodeWithSeatProps } from 'features/bookings/components/OldBookingDetails/TicketBody/QrCodeWithSeat/QrCodeWithSeat'

type Props = {
  booking: BookingReponse
  externalBookings?: QrCodeWithSeatProps
  testID?: string
}

export function TicketWithContent({ booking, externalBookings, testID }: Readonly<Props>) {
  return (
    <ThreeShapesTicket testID={testID}>
      <BookingDetailsTicketContent booking={booking} externalBookings={externalBookings} />
    </ThreeShapesTicket>
  )
}
