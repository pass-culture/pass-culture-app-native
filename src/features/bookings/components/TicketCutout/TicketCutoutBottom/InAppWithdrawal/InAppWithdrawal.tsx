import React from 'react'

import { SubcategoryIdEnum } from 'api/gen'
import {
  getQrCodeText,
  getQrCodeVisibility,
} from 'features/bookings/components/TicketCutout/TicketCutoutBottom/InAppWithdrawal/helpersQrCode'
import { SoloTicket } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/InAppWithdrawal/SoloTicket'
import { TicketsCarousel } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/InAppWithdrawal/TicketsCarousel'
import { TicketCutoutBottomProps } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/TicketCutoutBottom'

export type InAppWithdrawalProps = Omit<TicketCutoutBottomProps, 'offer' | 'userEmail'> & {
  ean: React.JSX.Element | null
}

const CATEGORIES_TO_HIDE = [SubcategoryIdEnum.CONCERT, SubcategoryIdEnum.FESTIVAL_MUSIQUE]

export const InAppWithdrawal = ({
  booking,
  categoryId,
  enableHideTicket,
  subcategoryShouldHaveQrCode,
  ean,
}: InAppWithdrawalProps) => {
  const { offer, beginningDatetime } = booking.stock
  const { subcategoryId: offerSubcategory, venue } = offer
  const numberOfExternalBookings = booking?.externalBookings?.length

  const shouldQrCodeBeHidden = getQrCodeVisibility({
    beginningDatetime: beginningDatetime ?? undefined,
    qrCodeVisibilityHoursBeforeEvent: 48,
    isAmongCategoriesToHide: CATEGORIES_TO_HIDE.includes(offerSubcategory),
    enableHideTicket,
  })

  const qrCodeText = getQrCodeText({
    beginningDatetime: beginningDatetime ?? undefined,
    qrCodeVisibilityHoursBeforeEvent: 48,
    venue,
    numberOfExternalBookings,
    shouldQrCodeBeHidden,
  })

  if (!booking.externalBookings || !numberOfExternalBookings || numberOfExternalBookings === 0)
    return (
      <SoloTicket
        key={booking.id}
        booking={booking}
        categoryId={categoryId}
        subcategoryShouldHaveQrCode={subcategoryShouldHaveQrCode}
        shouldQrCodeBeHidden={shouldQrCodeBeHidden}
        qrCodeText={qrCodeText}
        ean={ean}
      />
    )
  else if (numberOfExternalBookings === 1 && booking.externalBookings[0]) {
    return (
      <SoloTicket
        key={booking.externalBookings[0].barcode}
        booking={booking}
        categoryId={categoryId}
        externalBookings={{
          seat: booking.externalBookings[0].seat ?? undefined,
          barcode: booking.externalBookings[0].barcode,
        }}
        subcategoryShouldHaveQrCode={subcategoryShouldHaveQrCode}
        shouldQrCodeBeHidden={shouldQrCodeBeHidden}
        qrCodeText={qrCodeText}
        ean={ean}
      />
    )
  } else {
    const tickets = booking.externalBookings.map(({ seat, barcode }, index) => {
      const seatNumber = seat ?? undefined
      const seatWithNumberOfSeats =
        numberOfExternalBookings > 1 ? `${index + 1}/${numberOfExternalBookings}` : undefined
      return (
        <SoloTicket
          key={barcode}
          booking={booking}
          categoryId={categoryId}
          externalBookings={{ seat: seatNumber, seatIndex: seatWithNumberOfSeats, barcode }}
          subcategoryShouldHaveQrCode={subcategoryShouldHaveQrCode}
          shouldQrCodeBeHidden={shouldQrCodeBeHidden}
          ean={ean}
        />
      )
    })
    return (
      <TicketsCarousel
        tickets={tickets}
        qrCodeText={qrCodeText}
        displaySeat={!!booking.externalBookings[0]?.seat}
      />
    )
  }
}
