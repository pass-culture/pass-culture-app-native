import React from 'react'

import { WithdrawalTypeEnum } from 'api/gen'
import { TicketCodeTitle } from 'features/bookings/components/TicketCodeTitle'

type TicketCodeProps = {
  code: string
  withdrawalType?: WithdrawalTypeEnum
}

export function TicketCode({ code, withdrawalType }: TicketCodeProps) {
  if (withdrawalType === undefined || withdrawalType === WithdrawalTypeEnum.on_site) {
    return <TicketCodeTitle>{code}</TicketCodeTitle>
  }

  return null
}
