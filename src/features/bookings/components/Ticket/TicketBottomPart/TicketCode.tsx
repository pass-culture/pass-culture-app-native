import React from 'react'

import { TicketCodeTitle } from 'features/bookings/components/Ticket/TicketBottomPart/TicketCodeTitle'
import { TicketText } from 'features/bookings/components/Ticket/TicketBottomPart/TicketText'
import { TicketVisual } from 'features/bookings/components/Ticket/TicketBottomPart/TicketVisual'

export const TicketCode = ({
  code,
  text,
  cta,
}: {
  code: string
  text: string
  cta?: React.JSX.Element
}) => {
  return (
    <React.Fragment>
      <TicketVisual>
        <TicketCodeTitle>{code}</TicketCodeTitle>
      </TicketVisual>
      <TicketText>{text}</TicketText>
      {cta}
    </React.Fragment>
  )
}
