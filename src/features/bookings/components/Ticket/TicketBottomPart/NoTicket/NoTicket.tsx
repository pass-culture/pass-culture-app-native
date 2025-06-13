import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { TicketText } from 'features/bookings/components/Ticket/TicketBottomPart/TicketText'
import { TicketVisual } from 'features/bookings/components/Ticket/TicketBottomPart/TicketVisual'
import { CircledCheck as InitialBicolorCircledCheck } from 'ui/svg/icons/CircledCheck'
import { getSpacing } from 'ui/theme'

export const NoTicket: FunctionComponent = () => (
  <TicketContainer testID="withdrawal-info-no-ticket">
    <TicketVisual>
      <BicolorCircledCheck />
    </TicketVisual>
    <TicketText>Tu n’as pas besoin de billet pour profiter de cette offre&nbsp;!</TicketText>
  </TicketContainer>
)

const BicolorCircledCheck = styled(InitialBicolorCircledCheck).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.small,
}))``

const TicketContainer = styled.View({
  width: '100%',
  gap: getSpacing(4),
  flexDirection: 'column',
})
