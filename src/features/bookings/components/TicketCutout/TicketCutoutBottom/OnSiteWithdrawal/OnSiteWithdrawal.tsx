import React from 'react'
import styled from 'styled-components/native'

import { TicketCodeTitle } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/TicketCodeTitle'
import { TicketText } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/TicketText'
import { TicketVisual } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/TicketVisual'
import { getSpacing } from 'ui/theme'

export const OnSiteWithdrawal = ({ token }: { token: string }) => {
  return (
    <React.Fragment>
      <TicketVisual>
        <TicketCodeTitleContainer>
          <TicketCodeTitle>{token}</TicketCodeTitle>
        </TicketCodeTitleContainer>
      </TicketVisual>
      <TicketText>
        Présente le code ci-dessus à l’accueil du lieu indiqué avant le début de l’événement pour
        récupérer ton billet.
      </TicketText>
    </React.Fragment>
  )
}

const TicketCodeTitleContainer = styled.View(({ theme }) => ({
  display: 'flex',
  border: '1px dashed',
  borderColor: theme.colors.primary,
  flexDirection: 'row',
  height: getSpacing(10),
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: getSpacing(1),
}))
