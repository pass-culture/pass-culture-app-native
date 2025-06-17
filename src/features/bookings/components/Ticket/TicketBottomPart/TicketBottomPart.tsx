import React from 'react'
import { View } from 'react-native'

import { TicketResponse, UserProfileResponse, WithdrawalTypeEnum } from 'api/gen'
import { EmailWithdrawal } from 'features/bookings/components/Ticket/TicketBottomPart/EmailWithdrawal/EmailWithdrawal'
import { NoTicket } from 'features/bookings/components/Ticket/TicketBottomPart/NoTicket/NoTicket'
import { OnSiteWithdrawal } from 'features/bookings/components/Ticket/TicketBottomPart/OnSiteWithdrawal/OnSiteWithdrawal'
import { TicketCodeTitle } from 'features/bookings/components/Ticket/TicketBottomPart/TicketCodeTitle'

export const TicketBottomPart = ({
  isDuo,
  beginningDatetime,
  userEmail,
  ticket,
}: {
  isDuo: boolean
  beginningDatetime: string | null | undefined
  userEmail: UserProfileResponse['email']
  ticket: TicketResponse | null | undefined
}) => {
  switch (ticket?.withdrawal.type) {
    case WithdrawalTypeEnum.no_ticket:
      return <NoTicket />
    case WithdrawalTypeEnum.by_email:
      return (
        <EmailWithdrawal
          isDuo={isDuo}
          beginningDatetime={beginningDatetime}
          withdrawalDelay={ticket.withdrawal.delay}
          userEmail={userEmail}
        />
      )
    case WithdrawalTypeEnum.in_app:
      return <View />
    case WithdrawalTypeEnum.on_site:
      return ticket.token?.data ? (
        <OnSiteWithdrawal token={ticket.token.data} isDuo={isDuo} />
      ) : null
    default:
      return ticket?.activationCode ? (
        <TicketCodeTitle>{ticket.activationCode.code}</TicketCodeTitle>
      ) : null
  }
}
