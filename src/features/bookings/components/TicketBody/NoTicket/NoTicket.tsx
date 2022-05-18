import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { BicolorCircledCheck as InitialBicolorCircledCheck } from 'ui/svg/icons/BicolorCircledCheck'
import { getSpacing, Typo } from 'ui/theme'

export const NoTicket: FunctionComponent = () => {
  const message = t`Tu n’as pas besoin de billet\u00a0! Rends toi directement sur place le jour de l’événement.`
  return (
    <TicketContainer testID="withdrawal-info-no-ticket">
      <IconContainer>
        <BicolorCircledCheck />
      </IconContainer>
      <NoTicketInfo>{message}</NoTicketInfo>
    </TicketContainer>
  )
}

const TicketContainer = styled.View({
  width: '100%',
})

const NoTicketInfo = styled(Typo.Body)({
  textAlign: 'center',
  maxWidth: '100%',
})

const IconContainer = styled.View({
  alignItems: 'center',
  width: '100%',
  marginTop: -getSpacing(4),
  marginBottom: getSpacing(3),
})

const BicolorCircledCheck = styled(InitialBicolorCircledCheck).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.medium,
  color: theme.colors.primary,
  color2: theme.colors.secondary,
}))``
