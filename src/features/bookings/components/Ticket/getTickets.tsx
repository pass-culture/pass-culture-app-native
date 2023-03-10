import React from 'react'

import { BookingReponse } from 'api/gen'
import { TicketWithContent } from 'features/bookings/components/Ticket/TicketWithContent'

export type TicketsProps = {
  booking: BookingReponse
  maxNumberOfTicketsToDisplay?: number
}

export function getTickets({ booking, maxNumberOfTicketsToDisplay = 2 }: TicketsProps) {
  if (!booking.externalBookings) return { tickets: [] }

  const externalBookings = booking.externalBookings.slice(0, maxNumberOfTicketsToDisplay)
  const numberOfExternalBookings = externalBookings.length
  if (numberOfExternalBookings === 0)
    return {
      tickets: [
        <TicketWithContent
          key={booking.id}
          booking={booking}
          testID="ticket-without-external-bookings-information"
        />,
      ],
    }

  return {
    tickets: externalBookings.map(({ seat, barcode }, index) => {
      const seatNumber = seat ?? undefined
      const seatWithNumberOfSeats =
        numberOfExternalBookings > 1 ? `${index + 1}/${numberOfExternalBookings}` : undefined
      return (
        <TicketWithContent
          key={seatNumber}
          booking={booking}
          externalBookings={{ seat: seatNumber, seatIndex: seatWithNumberOfSeats, barcode }}
          testID="ticket-with-external-bookings-information"
        />
      )
    }),
  }
}
