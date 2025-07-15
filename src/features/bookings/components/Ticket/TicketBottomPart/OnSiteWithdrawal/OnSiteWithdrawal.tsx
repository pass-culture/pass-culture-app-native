import React from 'react'

import { TicketCode } from 'features/bookings/components/Ticket/TicketBottomPart/TicketCode'
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

  return <TicketCode code={token} text={text} />
}
