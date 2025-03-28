import React from 'react'

import { WithdrawalTypeEnum } from 'api/gen'
import { TicketCodeTitle } from 'features/bookings/components/OldBookingDetails/TicketCodeTitle'
import { useCopyToClipboard } from 'libs/useCopyToClipboard/useCopyToClipboard'

type TicketCodeProps = {
  code: string
  withdrawalType?: WithdrawalTypeEnum
}

export function TicketCode({ code, withdrawalType }: TicketCodeProps) {
  const copyToClipboard = useCopyToClipboard({
    textToCopy: code,
    snackBarMessage: 'Ton code a été copié dans le presse-papier\u00a0!',
  })

  if (withdrawalType === undefined || withdrawalType === WithdrawalTypeEnum.on_site) {
    return (
      <TicketCodeTitle accessibilityLabel="Copier le code" onPress={copyToClipboard}>
        {code}
      </TicketCodeTitle>
    )
  }

  return null
}
