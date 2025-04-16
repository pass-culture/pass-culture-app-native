import React from 'react'
import { View } from 'react-native'

import {
  BookingOfferResponse,
  BookingReponse,
  UserProfileResponse,
  WithdrawalTypeEnum,
} from 'api/gen'
import { EmailWithdrawal } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/EmailWithdrawal/EmailWithdrawal'
import { NoTicket } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/NoTicket/NoTicket'
import { OnSiteWithdrawal } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/OnSiteWithdrawal/OnSiteWithdrawal'
import { TicketCodeTitle } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/TicketCodeTitle'

export const TicketCutoutBottom = ({
  offer,
  booking,
  userEmail,
}: {
  offer: BookingOfferResponse
  booking: BookingReponse
  userEmail?: UserProfileResponse['email']
}) => {
  switch (offer.withdrawalType) {
    case WithdrawalTypeEnum.no_ticket:
      return <NoTicket />
    case WithdrawalTypeEnum.by_email:
      return userEmail ? (
        <EmailWithdrawal
          isDuo={booking.quantity === 2}
          beginningDatetime={booking.stock.beginningDatetime}
          withdrawalDelay={offer.withdrawalDelay}
          userEmail={userEmail}
        />
      ) : null
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
