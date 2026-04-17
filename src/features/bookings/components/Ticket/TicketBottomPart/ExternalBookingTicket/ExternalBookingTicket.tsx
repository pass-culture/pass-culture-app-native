import React from 'react'
import styled from 'styled-components/native'

import { ExternalBookingDataResponseV2 } from 'api/gen'
import { TicketSwiper } from 'features/bookings/components/Ticket/TicketBottomPart/ExternalBookingTicket/TicketSwiper'
import { TicketText } from 'features/bookings/components/Ticket/TicketBottomPart/TicketText'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing } from 'ui/theme'

type props = {
  data?: ExternalBookingDataResponseV2[]

  isDuo: boolean
}

export const ExternalBookingTicket = ({ data, isDuo }: props) => {
  const visibleTicketText = `Présente ${isDuo ? 'ces billets' : 'ce billet'} pour accéder à l’évènement.`

  return (
    <StyledViewGap gap={4} testID="external-booking-ticket-container">
      <React.Fragment>
        <TicketSwiper data={data} />
        <TicketText>{visibleTicketText}</TicketText>
      </React.Fragment>
    </StyledViewGap>
  )
}

const StyledViewGap = styled(ViewGap)({
  justifyContent: 'center',
  minHeight: getSpacing(25),
  width: '100%',
})
