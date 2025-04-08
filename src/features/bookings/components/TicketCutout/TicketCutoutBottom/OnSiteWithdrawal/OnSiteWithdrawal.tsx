import React from 'react'
import styled from 'styled-components/native'

import { BookingReponse } from 'api/gen'
import { TicketCodeTitle } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/TicketCodeTitle'
import { TicketText } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/TicketText'
import { TicketVisual } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/TicketVisual'
import { getSpacing } from 'ui/theme'

export const OnSiteWithdrawal = ({ booking }: { booking: BookingReponse }) => {
  return (
    <React.Fragment>
      {booking.token ? (
        <React.Fragment>
          <TicketVisual>
            <TicketCodeTitleContainer>
              <TicketCodeTitle>{booking.token}</TicketCodeTitle>
            </TicketCodeTitleContainer>
          </TicketVisual>
          <TicketText>
            Présente le code ci-dessus à l’accueil du lieu indiqué avant le début de l’événement
            pour récupérer ton billet.
          </TicketText>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  )
}

const TicketCodeTitleContainer = styled.View(({ theme }) => ({
  borderRadius: getSpacing(1),
  border: '1px dashed',
  borderColor: theme.colors.primary,
  width: getSpacing(24),
  height: getSpacing(10),
}))
