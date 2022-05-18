import React from 'react'

import { BookingReponse } from 'api/gen'
import { TicketWithContent } from 'features/bookings/components/SwiperTickets/TicketWithContent'

export type TicketsProps = {
  booking: BookingReponse
  activationCodeFeatureEnabled?: boolean
}

export function getMultipleTickets({ booking, activationCodeFeatureEnabled }: TicketsProps) {
  if (!booking.externalBookings) return { tickets: [] }

  if (booking.externalBookings.length === 0)
    return {
      tickets: [
        <TicketWithContent
          key={booking.id}
          booking={booking}
          activationCodeFeatureEnabled={activationCodeFeatureEnabled}
          testID="ticket-without-external-bookings-information"
        />,
      ],
    }

  const totalSeatsIndex = booking.externalBookings.length
  return {
    tickets: booking.externalBookings.map(({ seat, barcode }, index) => {
      const seatIndex = totalSeatsIndex > 1 ? `${index + 1}/${totalSeatsIndex}` : undefined
      return (
        <TicketWithContent
          key={index}
          booking={booking}
          activationCodeFeatureEnabled={activationCodeFeatureEnabled}
          externalBookings={{ seat: seat === null ? undefined : seat, seatIndex, barcode }}
          testID="ticket-with-external-bookings-information"
        />
      )
    }),
  }
}
