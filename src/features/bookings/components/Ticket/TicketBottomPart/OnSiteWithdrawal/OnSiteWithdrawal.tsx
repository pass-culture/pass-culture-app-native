import React from 'react'

import { TicketCode } from 'features/bookings/components/Ticket/TicketBottomPart/OnSiteWithdrawal/TicketCode'
import { TicketText } from 'features/bookings/components/Ticket/TicketBottomPart/TicketText'
import { TicketVisual } from 'features/bookings/components/Ticket/TicketBottomPart/TicketVisual'
import { getDelayMessage } from 'features/bookings/helpers/getDelayMessage'

export const OnSiteWithdrawal = ({
  token,
  isDuo,
  withdrawalDelay,
}: {
  token: string
  isDuo: boolean
  withdrawalDelay?: number | null
}) => {
  const delay = withdrawalDelay ? getDelayMessage(withdrawalDelay) : null
  const displayedDelay = delay ?? ' '
  const text = `Présente le code ci-dessus à l’accueil du lieu indiqué ${displayedDelay}avant le début de l’événement pour récupérer ${isDuo ? 'tes billets' : 'ton billet'}.`

  return (
    <React.Fragment>
      <TicketVisual>
        <TicketCode code={token} />
      </TicketVisual>
      <TicketText>{text}</TicketText>
    </React.Fragment>
  )
}
