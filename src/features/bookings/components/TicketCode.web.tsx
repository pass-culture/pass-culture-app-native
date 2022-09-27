import React, { useCallback } from 'react'

import { WithdrawalTypeEnum } from 'api/gen'
import { TicketCodeTitle } from 'features/bookings/components/TicketCodeTitle'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

type TicketCodeProps = {
  code: string
  withdrawalType?: WithdrawalTypeEnum
}

export function TicketCode({ code, withdrawalType }: TicketCodeProps) {
  const { showSuccessSnackBar } = useSnackBarContext()

  const copyToClipboard = useCallback(() => {
    globalThis.navigator.clipboard.writeText(code)
    showSuccessSnackBar({
      message: 'Ton code a été copié dans le presse-papier\u00a0!',
      timeout: SNACK_BAR_TIME_OUT,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  if (withdrawalType === undefined || withdrawalType === WithdrawalTypeEnum.on_site) {
    return (
      <TicketCodeTitle accessibilityLabel="Copier le code" onPress={copyToClipboard}>
        {code}
      </TicketCodeTitle>
    )
  }

  return null
}
