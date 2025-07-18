import React from 'react'
import styled from 'styled-components/native'

import { QrCode } from 'features/bookings/components/Ticket/TicketBottomPart/QrCode'
import { TicketCode } from 'features/bookings/components/Ticket/TicketBottomPart/TicketCode'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing } from 'ui/theme'

export type PhysicalGoodBookingTicketProps = {
  voucherData: string
  tokenData: string
  expirationDate?: string
}
export const PhysicalGoodBookingTicket = ({
  voucherData,
  tokenData,
  expirationDate,
}: PhysicalGoodBookingTicketProps) => {
  const text = `Présente le code ci-dessus à la caisse du lieu indiqué ${expirationDate ?? ''} pour récupérer ton offre.`

  return (
    <StyledViewGap gap={4} testID="physical-good-booking-ticket-container">
      <QrCode qrCode={voucherData} />
      <TicketCode code={tokenData} text={text} />
    </StyledViewGap>
  )
}

const StyledViewGap = styled(ViewGap)({
  justifyContent: 'center',
  minHeight: getSpacing(25),
  width: '100%',
})
