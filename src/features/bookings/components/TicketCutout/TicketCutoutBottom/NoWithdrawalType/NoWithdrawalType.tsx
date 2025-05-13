import React from 'react'

import { InAppWithdrawalProps } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/InAppWithdrawal/InAppWithdrawal'
import { SoloTicket } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/InAppWithdrawal/SoloTicket'
import { NoTicket } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/NoTicket/NoTicket'
import { OnSiteWithdrawal } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/OnSiteWithdrawal/OnSiteWithdrawal'
import { TicketCodeTitle } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/TicketCodeTitle'

export const NoWithdrawalType = ({
  booking,
  categoryId,
  subcategoryShouldHaveQrCode,
  ean,
}: InAppWithdrawalProps) => {
  if (booking.qrCodeData && subcategoryShouldHaveQrCode)
    return (
      <SoloTicket
        key={booking.id}
        booking={booking}
        categoryId={categoryId}
        subcategoryShouldHaveQrCode={subcategoryShouldHaveQrCode}
        shouldQrCodeBeHidden={false}
        ean={ean}
      />
    )
  else if (booking.token)
    return <OnSiteWithdrawal token={booking.token} isDuo={booking.quantity === 2} />
  else if (booking.activationCode)
    return <TicketCodeTitle>{booking.activationCode.code}</TicketCodeTitle>
  else return <NoTicket />
}
