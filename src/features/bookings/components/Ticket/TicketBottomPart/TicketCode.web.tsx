import React from 'react'

import { TicketCodeTitle } from 'features/bookings/components/Ticket/TicketBottomPart/TicketCodeTitle'
import { TicketText } from 'features/bookings/components/Ticket/TicketBottomPart/TicketText'
import { TicketVisual } from 'features/bookings/components/Ticket/TicketBottomPart/TicketVisual'
import { useCopyToClipboard } from 'libs/useCopyToClipboard/useCopyToClipboard'

export function TicketCode({ code, text }: { code: string; text: string }) {
  const copyToClipboard = useCopyToClipboard({
    textToCopy: code,
    snackBarMessage: 'Ton code a été copié dans le presse-papier\u00a0!',
  })
  return (
    <React.Fragment>
      <TicketVisual>
        <TicketCodeTitle accessibilityLabel="Copier le code" onPress={copyToClipboard}>
          {code}
        </TicketCodeTitle>
      </TicketVisual>
      <TicketText>{text}</TicketText>
    </React.Fragment>
  )
}
