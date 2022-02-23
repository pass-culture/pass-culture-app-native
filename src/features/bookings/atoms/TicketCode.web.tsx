import { t } from '@lingui/macro'
import React, { useCallback } from 'react'

import { TicketCodeTitle } from 'features/bookings/atoms/TicketCodeTitle'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export function TicketCode({ code }: { code: string }) {
  const { showSuccessSnackBar } = useSnackBarContext()

  const copyToClipboard = useCallback(() => {
    globalThis.navigator.clipboard.writeText(code)
    showSuccessSnackBar({
      message: t`Ton code a été copié dans le presse-papier\u00a0!`,
      timeout: SNACK_BAR_TIME_OUT,
    })
  }, [code])

  return <TicketCodeTitle onPress={copyToClipboard}>{code}</TicketCodeTitle>
}
