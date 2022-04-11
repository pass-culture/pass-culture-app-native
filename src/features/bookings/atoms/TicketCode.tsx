import React from 'react'

import { WithdrawalTypeEnum } from 'api/gen'
import { TicketCodeTitle } from 'features/bookings/atoms/TicketCodeTitle'

type TicketCodeProps = {
  code: string
  collectType?: WithdrawalTypeEnum
}

export function TicketCode({ code, collectType }: TicketCodeProps) {
  if (collectType === undefined || collectType === WithdrawalTypeEnum.on_site) {
    return <TicketCodeTitle>{code}</TicketCodeTitle>
  }

  return null
}
