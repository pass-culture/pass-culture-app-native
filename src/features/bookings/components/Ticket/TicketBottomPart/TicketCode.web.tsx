import React from 'react'

import { TicketCodeTitle } from 'features/bookings/components/Ticket/TicketBottomPart/TicketCodeTitle'
import { TicketText } from 'features/bookings/components/Ticket/TicketBottomPart/TicketText'
import { TicketVisual } from 'features/bookings/components/Ticket/TicketBottomPart/TicketVisual'
import { copyToClipboard } from 'libs/copyToClipboard/copyToClipboard'

export function TicketCode({
  code,
  text,
  cta,
}: {
  code: string
  text: string
  cta?: React.JSX.Element
}) {
  const copy = () =>
    copyToClipboard({
      textToCopy: code,
      snackBarMessage: 'Ton code a été copié dans le presse-papier\u00a0!',
    })

  return (
    <React.Fragment>
      <TicketVisual>
        <TicketCodeTitle accessibilityLabel="Copier le code" onPress={copy}>
          {code}
        </TicketCodeTitle>
      </TicketVisual>
      <TicketText>{text}</TicketText>
      {cta}
    </React.Fragment>
  )
}
