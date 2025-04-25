import React from 'react'

import { BookingReponse, CategoryIdEnum, UserProfileResponse, WithdrawalTypeEnum } from 'api/gen'
import { DigitalOfferWithdrawal } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/DigitalOfferWithdrawal'
import { EmailWithdrawal } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/EmailWithdrawal/EmailWithdrawal'
import { BookingComplementaryInfo } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/InAppWithdrawal/BookingComplementaryInfo'
import { InAppWithdrawal } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/InAppWithdrawal/InAppWithdrawal'
import { NoTicket } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/NoTicket/NoTicket'
import { NoWithdrawalType } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/NoWithdrawalType/NoWithdrawalType'
import { OnSiteWithdrawal } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/OnSiteWithdrawal/OnSiteWithdrawal'
import { getBookingProperties } from 'features/bookings/helpers'

export type TicketCutoutBottomProps = {
  booking: BookingReponse
  enableHideTicket: boolean
  isEvent: boolean
  categoryId: CategoryIdEnum
  subcategoryShouldHaveQrCode: boolean
  userEmail?: UserProfileResponse['email']
}

export const TicketCutoutBottom = ({
  booking,
  enableHideTicket,
  isEvent,
  categoryId,
  subcategoryShouldHaveQrCode,
  userEmail,
}: TicketCutoutBottomProps) => {
  const properties = getBookingProperties(booking, isEvent)

  const ean =
    booking.stock.offer.extraData?.ean && categoryId === CategoryIdEnum.LIVRE ? (
      <BookingComplementaryInfo title="EAN" value={booking.stock.offer.extraData?.ean} />
    ) : null

  if (properties.isDigital)
    return (
      <DigitalOfferWithdrawal
        booking={booking}
        ean={ean}
        hasActivationCode={properties.hasActivationCode}
      />
    )

  switch (booking.stock.offer.withdrawalType) {
    case WithdrawalTypeEnum.no_ticket:
      return <NoTicket />
    case WithdrawalTypeEnum.by_email:
      return userEmail ? (
        <EmailWithdrawal
          isDuo={booking.quantity === 2}
          beginningDatetime={booking.stock.beginningDatetime}
          withdrawalDelay={booking.stock.offer.withdrawalDelay}
          userEmail={userEmail}
        />
      ) : null
    case WithdrawalTypeEnum.on_site:
      return booking.token ? (
        <OnSiteWithdrawal
          token={booking.token}
          isDuo={booking.quantity === 2}
          withdrawalDelay={booking.stock.offer.withdrawalDelay}
        />
      ) : null
    case WithdrawalTypeEnum.in_app:
      return (
        <InAppWithdrawal
          booking={booking}
          categoryId={categoryId}
          enableHideTicket={enableHideTicket}
          isEvent={isEvent}
          subcategoryShouldHaveQrCode={subcategoryShouldHaveQrCode}
          ean={ean}
        />
      )
    default:
      return (
        <NoWithdrawalType
          booking={booking}
          categoryId={categoryId}
          enableHideTicket={enableHideTicket}
          isEvent={isEvent}
          subcategoryShouldHaveQrCode={subcategoryShouldHaveQrCode}
          ean={ean}
        />
      )
  }
}
