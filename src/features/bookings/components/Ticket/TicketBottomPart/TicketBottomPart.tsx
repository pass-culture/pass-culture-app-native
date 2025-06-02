import React from 'react'
import { View } from 'react-native'

import {
  BookingOfferResponse,
  BookingReponse,
  UserProfileResponse,
  WithdrawalTypeEnum,
} from 'api/gen'
import { EmailWithdrawal } from 'features/bookings/components/Ticket/TicketBottomPart/EmailWithdrawal/EmailWithdrawal'
import { NoTicket } from 'features/bookings/components/Ticket/TicketBottomPart/NoTicket/NoTicket'
import { OnSiteWithdrawal } from 'features/bookings/components/Ticket/TicketBottomPart/OnSiteWithdrawal/OnSiteWithdrawal'
import { TicketCodeTitle } from 'features/bookings/components/Ticket/TicketBottomPart/TicketCodeTitle'

export const TicketBottomPart = ({
  offer,
  booking,
  userEmail,
}: {
  offer: BookingOfferResponse
  booking: BookingReponse
  userEmail: UserProfileResponse['email']
}) => {
  switch (offer.withdrawalType) {
    case WithdrawalTypeEnum.no_ticket:
      return <NoTicket />
    case WithdrawalTypeEnum.by_email:
      return (
        <EmailWithdrawal
          isDuo={booking.quantity === 2}
          beginningDatetime={booking.stock.beginningDatetime}
          withdrawalDelay={offer.withdrawalDelay}
          userEmail={userEmail}
        />
      )
    case WithdrawalTypeEnum.in_app:
      return <View />
    case WithdrawalTypeEnum.on_site:
      return booking.token ? (
        <OnSiteWithdrawal token={booking.token} isDuo={booking.quantity === 2} />
      ) : null
    default:
      return booking.activationCode ? (
        <TicketCodeTitle>{booking.activationCode.code}</TicketCodeTitle>
      ) : null
  }
}
