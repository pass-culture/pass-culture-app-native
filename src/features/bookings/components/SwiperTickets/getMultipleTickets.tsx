import React from 'react'

import { BookingReponseBis } from 'features/bookings/api/bookingsSnapWithExternalBookingInformations'
import { TicketWithContent } from 'features/bookings/components/SwiperTickets/TicketWithContent'

export type TicketsProps = {
  booking: BookingReponseBis
  activationCodeFeatureEnabled?: boolean
}

export function getMultipleTickets({ booking, activationCodeFeatureEnabled }: TicketsProps) {
  return {
    tickets: [booking].map((ticket) => {
      if (ticket.externalBookingsInfos) {
        const totalSeatsIndex = ticket.externalBookingsInfos
          .map((item) => item.seat)
          .filter((seat) => seat).length
        let currentSeatIndex = 0
        return ticket.externalBookingsInfos.map((infos, index) => {
          const seatIndex = infos.seat ? `${(currentSeatIndex += 1)}/${totalSeatsIndex}` : null
          const externalBookingInfosWithCurrentSeatIndex = { ...infos, seatIndex }
          return (
            <TicketWithContent
              key={index}
              booking={ticket}
              activationCodeFeatureEnabled={activationCodeFeatureEnabled}
              externalBookingsInfos={externalBookingInfosWithCurrentSeatIndex}
            />
          )
        })
      }
      return []
    }),
  }
}
