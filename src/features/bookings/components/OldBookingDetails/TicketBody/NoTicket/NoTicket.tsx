import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { CircledCheck as InitialBicolorCircledCheck } from 'ui/svg/icons/CircledCheck'
import { Typo } from 'ui/theme'

export const NoTicket: FunctionComponent = () => (
  <TicketContainer testID="withdrawal-info-no-ticket">
    <IconContainer>
      <BicolorCircledCheck />
    </IconContainer>
    <StyledBody>
      Tu n’as pas besoin de billet&nbsp;! Rends toi directement sur place le jour de l’évènement.
    </StyledBody>
  </TicketContainer>
)

const TicketContainer = styled.View({
  width: '100%',
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
  maxWidth: '100%',
})

const IconContainer = styled.View(({ theme }) => ({
  alignItems: 'center',
  width: '100%',
  marginTop: -theme.designSystem.size.spacing.l,
  marginBottom: theme.designSystem.size.spacing.m,
}))

const BicolorCircledCheck = styled(InitialBicolorCircledCheck).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.medium,
  color: theme.designSystem.color.icon.brandPrimary,
}))``
