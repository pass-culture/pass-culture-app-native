import React from 'react'
import styled from 'styled-components/native'

import { BookingReponse } from 'api/gen'
import { TicketCodeTitle } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/TicketCodeTitle'
import { TicketText } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/TicketText'
import { TicketVisual } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/TicketVisual'
import { getDelayMessage } from 'features/bookings/helpers/getDelayMessage'
import { getSpacing } from 'ui/theme'

export const OnSiteWithdrawal = ({
  token,
  isDuo,
  withdrawalDelay,
}: {
  token: BookingReponse['token']
  isDuo: boolean
  withdrawalDelay?: number | null
}) => {
  const delay = withdrawalDelay ? getDelayMessage(withdrawalDelay) : null

  const text = `Présente le code ci-dessus à l’accueil du lieu indiqué ${delay ? `${delay}` : ''}avant le début de l’événement pour récupérer ${isDuo ? 'tes billets' : 'ton billet'}.`

  return (
    <React.Fragment>
      <TicketVisual>
        <TicketCodeTitleContainer testID="withdrawal-on-site">
          <TicketCodeTitle>{token}</TicketCodeTitle>
        </TicketCodeTitleContainer>
      </TicketVisual>
      <TicketText>{text}</TicketText>
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
