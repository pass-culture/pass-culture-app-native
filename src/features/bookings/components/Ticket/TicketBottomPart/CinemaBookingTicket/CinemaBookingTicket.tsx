import React from 'react'
import styled from 'styled-components/native'

import { QrCode } from 'features/bookings/components/Ticket/TicketBottomPart/QrCode'
import { TicketCode } from 'features/bookings/components/Ticket/TicketBottomPart/TicketCode'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing } from 'ui/theme'

type props = {
  voucher: string
  token: string | null | undefined
}
export const CinemaBookingTicket = ({ voucher, token }: props) => {
  if (voucher && token) {
    return (
      <StyledViewGap gap={4} testID="cinema-booking-ticket-container">
        <QrCode qrCode={voucher} />
        <TicketCode code={token} text="Présente ce billet pour accéder à l’évènement." />
      </StyledViewGap>
    )
  }

  return null
}

const StyledViewGap = styled(ViewGap)({
  justifyContent: 'center',
  minHeight: getSpacing(25),
  width: '100%',
})
