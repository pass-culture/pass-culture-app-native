import React from 'react'
import styled from 'styled-components/native'

import { BookingReponse, CategoryIdEnum } from 'api/gen'
import { TicketCode } from 'features/bookings/components/OldBookingDetails/TicketCode'
import { BookingComplementaryInfo } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/InAppWithdrawal/BookingComplementaryInfo'
import { QrCode } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/InAppWithdrawal/QrCode'
import {
  QrCodeWithSeat,
  QrCodeWithSeatProps,
} from 'features/bookings/components/TicketCutout/TicketCutoutBottom/InAppWithdrawal/QrCodeWithSeat/QrCodeWithSeat'
import { TicketText } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/TicketText'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing } from 'ui/theme'

export type SoloTicketProps = {
  booking: BookingReponse
  externalBookings?: QrCodeWithSeatProps
  categoryId: CategoryIdEnum
  subcategoryShouldHaveQrCode: boolean
  shouldQrCodeBeHidden: boolean
  qrCodeText?: string
  ean: React.JSX.Element | null
}

export const SoloTicket = ({
  externalBookings,
  booking,
  qrCodeText,
  categoryId,
  shouldQrCodeBeHidden,
  subcategoryShouldHaveQrCode,
  ean,
}: SoloTicketProps) => {
  const ref =
    externalBookings?.barcode && categoryId === CategoryIdEnum.MUSIQUE_LIVE ? (
      <BookingComplementaryInfo title="REF" value={externalBookings.barcode} />
    ) : null

  const externalBookingsQrCode = externalBookings?.barcode ? (
    <QrCodeWithSeat
      seatIndex={externalBookings?.seatIndex}
      seat={externalBookings?.seat}
      barcode={externalBookings?.barcode}
      shouldQrCodeBeHidden={shouldQrCodeBeHidden}
    />
  ) : booking.qrCodeData && subcategoryShouldHaveQrCode ? (
    <QrCode qrCode={booking.qrCodeData} />
  ) : null

  const token = booking.token ? <TicketCode code={booking.token} /> : null

  return (
    <StyledViewGap gap={6} testID="solo-ticket">
      <ViewGap gap={2}>
        {token}
        {externalBookingsQrCode}
        {ean || ref}
      </ViewGap>
      {qrCodeText ? <TicketText>{qrCodeText}</TicketText> : null}
    </StyledViewGap>
  )
}

const StyledViewGap = styled(ViewGap)({
  justifyContent: 'center',
  minHeight: getSpacing(25),
  width: '100%',
})
