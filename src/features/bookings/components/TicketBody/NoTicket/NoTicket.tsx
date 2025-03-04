import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { BicolorCircledCheck as InitialBicolorCircledCheck } from 'ui/svg/icons/BicolorCircledCheck'
import { TypoDS, getSpacing } from 'ui/theme'

export const NoTicket: FunctionComponent = () => (
  <TicketContainer testID="withdrawal-info-no-ticket">
    <IconContainer>
      <BicolorCircledCheck />
    </IconContainer>
    <StyledBody>Tu n’as pas besoin de billet pour profiter de cette offre&nbsp;!</StyledBody>
  </TicketContainer>
)

const TicketContainer = styled.View({
  width: '100%',
  gap: getSpacing(4),
  flexDirection: 'column',
})

const StyledBody = styled(TypoDS.Body)({
  textAlign: 'center',
  maxWidth: '100%',
})

const IconContainer = styled.View({
  alignItems: 'center',
  width: '100%',
})

const BicolorCircledCheck = styled(InitialBicolorCircledCheck).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.small,
  color: theme.colors.black,
  color2: theme.colors.black,
}))``
