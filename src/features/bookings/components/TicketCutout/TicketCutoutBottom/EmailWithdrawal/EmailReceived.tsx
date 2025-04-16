import React from 'react'
import { openInbox } from 'react-native-email-link'
import styled from 'styled-components/native'

import { useIsMailAppAvailable } from 'features/auth/helpers/useIsMailAppAvailable'
import { TicketText } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/TicketText'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Email } from 'ui/svg/icons/Email'
import { LINE_BREAK } from 'ui/theme/constants'

export const EmailReceived = ({ isEventDay }: { isEventDay: boolean }) => {
  const emailMessage = isEventDay
    ? 'C’est aujourd’hui\u00a0!' +
      LINE_BREAK +
      'Tu as dû recevoir ton billet par e-mail. Pense à vérifier tes spams.'
    : 'Ton billet t’a été envoyé par e-mail. Pense à vérifier tes spams.'

  const isMailAppAvailable = useIsMailAppAvailable()

  return (
    <TicketContainer testID="withdrawal-info-email">
      <TicketText testID="withdrawal-info-email-msg">{emailMessage}</TicketText>
      {isMailAppAvailable ? (
        <ButtonTertiaryBlack
          wording="Consulter mes e-mails"
          onPress={() => {
            openInbox()
          }}
          icon={Email}
        />
      ) : null}
    </TicketContainer>
  )
}

const TicketContainer = styled.View({
  width: '100%',
})
