import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { TicketText } from 'features/bookings/components/TicketBody/TicketText'
import { BicolorCircledCheck as InitialBicolorCircledCheck } from 'ui/svg/icons/BicolorCircledCheck'
import { getSpacing } from 'ui/theme'

export const NoTicket: FunctionComponent = () => (
  <TicketContainer testID="withdrawal-info-no-ticket">
    <IconContainer>
      <BicolorCircledCheck />
    </IconContainer>
    <TicketText>Tu n’as pas besoin de billet pour profiter de cette offre&nbsp;!</TicketText>
  </TicketContainer>
)

const IconContainer = styled.View({
  alignItems: 'center',
  width: '100%',
})

const BicolorCircledCheck = styled(InitialBicolorCircledCheck).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.small,
  color: theme.colors.black,
  color2: theme.colors.black,
}))``

const TicketContainer = styled.View({
  width: '100%',
  gap: getSpacing(4),
  flexDirection: 'column',
})
