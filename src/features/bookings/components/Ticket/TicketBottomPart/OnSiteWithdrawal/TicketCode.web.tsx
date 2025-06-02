import React from 'react'

import { TicketCodeTitle } from 'features/bookings/components/Ticket/TicketBottomPart/TicketCodeTitle'
import { useCopyToClipboard } from 'libs/useCopyToClipboard/useCopyToClipboard'

export function TicketCode({ code }: { code: string }) {
  const copyToClipboard = useCopyToClipboard({
    textToCopy: code,
    snackBarMessage: 'Ton code a été copié dans le presse-papier\u00a0!',
  })
  return (
    <TicketCodeTitle accessibilityLabel="Copier le code" onPress={copyToClipboard}>
      {code}
    </TicketCodeTitle>
  )
}
