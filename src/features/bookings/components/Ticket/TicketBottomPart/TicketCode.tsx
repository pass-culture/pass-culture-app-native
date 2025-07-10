import React from 'react'

import { TicketCodeTitle } from 'features/bookings/components/Ticket/TicketBottomPart/TicketCodeTitle'
import { TicketText } from 'features/bookings/components/Ticket/TicketBottomPart/TicketText'
import { TicketVisual } from 'features/bookings/components/Ticket/TicketBottomPart/TicketVisual'

export const TicketCode = ({ code, text }: { code: string; text: string }) => {
  return (
    <React.Fragment>
      <TicketVisual>
        <TicketCodeTitle>{code}</TicketCodeTitle>
      </TicketVisual>
      <TicketText>{text}</TicketText>
    </React.Fragment>
  )
}
