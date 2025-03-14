import React, { FunctionComponent } from 'react'

import { WithdrawalTypeEnum } from 'api/gen'
import { NoTicket } from 'features/bookings/components/TicketBody/NoTicket/NoTicket'

type Props = {
  withdrawalType?: WithdrawalTypeEnum | null
}

export const TicketBody: FunctionComponent<Props> = ({ withdrawalType }) => {
  if (withdrawalType === WithdrawalTypeEnum.no_ticket) return <NoTicket />

  return null
}
