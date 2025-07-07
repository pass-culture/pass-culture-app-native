import React from 'react'
import styled from 'styled-components/native'

import { TicketCode } from 'features/bookings/components/Ticket/TicketBottomPart/OnSiteWithdrawal/TicketCode'
import { QrCode } from 'features/bookings/components/Ticket/TicketBottomPart/QrCode'
import { TicketText } from 'features/bookings/components/Ticket/TicketBottomPart/TicketText'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing } from 'ui/theme'

type props = {
  voucher: string
  token: string | null | undefined
}
export const CinemaBookingTicket = ({ voucher, token }: props) => {
  const text = 'Présente ce billet pour acéder à l’évènement.'

  if (voucher && token) {
    return (
      <StyledViewGap gap={4} testID="cinema-booking-ticket-container">
        <QrCode qrCode={voucher} />
        <TicketCode code={token} />
        <TicketText>{text}</TicketText>
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
