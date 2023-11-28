import React from 'react'

import { BookingReponse } from 'api/gen'
import { BookingDetailsTicketContent } from 'features/bookings/components/BookingDetailsTicketContent'
import { ThreeShapesTicket } from 'features/bookings/components/ThreeShapesTicket'
import { SeatWithQrCodeProps } from 'features/bookings/components/TicketBody/SeatWithQrCode/SeatWithQrCode'

type Props = {
  booking: BookingReponse
  externalBookings?: SeatWithQrCodeProps
  testID?: string
}

export function TicketWithContent({ booking, externalBookings, testID }: Readonly<Props>) {
  return (
    <ThreeShapesTicket testID={testID}>
      <BookingDetailsTicketContent booking={booking} externalBookings={externalBookings} />
    </ThreeShapesTicket>
  )
}
