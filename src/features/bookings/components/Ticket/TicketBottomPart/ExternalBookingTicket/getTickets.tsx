import React from 'react'

import { ExternalBookingDataResponseV2 } from 'api/gen'
import { QrCodeWithSeat } from 'features/bookings/components/OldBookingDetails/TicketBody/QrCodeWithSeat/QrCodeWithSeat'
import { TicketText } from 'features/bookings/components/Ticket/TicketBottomPart/TicketText'

export type TicketsProps = {
  data?: ExternalBookingDataResponseV2[]
  maxNumberOfTicketsToDisplay?: number
}

export const getTickets = ({ data, maxNumberOfTicketsToDisplay = 2 }: TicketsProps) => {
  if (!data) return { tickets: [] }

  const externalBookings = data.slice(0, maxNumberOfTicketsToDisplay)

  return {
    tickets: externalBookings.map(({ seat, barcode }) => {
      const seatNumber = seat ?? undefined
      return (
        <React.Fragment key={barcode}>
          <QrCodeWithSeat seat={seatNumber} barcode={barcode} />
          <TicketText>{`RÉF ${barcode}`}</TicketText>
        </React.Fragment>
      )
    }),
  }
}
