import React, { FunctionComponent } from 'react'
import { openInbox } from 'react-native-email-link'
import styled from 'styled-components/native'

import { useIsMailAppAvailable } from 'features/auth/helpers/useIsMailAppAvailable'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { Typo } from 'ui/theme'

type Props = {
  offerDate: Date
}

export const EmailSent: FunctionComponent<Props> = () => {
  const emailMessage = 'Ton billet t’a été envoyé par e-mail. Pense à vérifier tes spams.'
  const isMailAppAvailable = useIsMailAppAvailable()

  return (
    <TicketContainer testID="withdrawal-info-email">
      <TextContainer>
        <Typo.Body testID="withdrawal-info-email-msg">{emailMessage}</Typo.Body>
      </TextContainer>
      {isMailAppAvailable ? (
        <ButtonTertiaryBlack
          wording="Consulter mes e-mails"
          onPress={() => {
            openInbox()
          }}
          icon={EmailFilled}
        />
      ) : null}
    </TicketContainer>
  )
}

const TicketContainer = styled.View({
  flexDirection: 'column',
  flexWrap: 'wrap',
  width: '100%',
  backgroundColor: 'royalblue',
})
const TextContainer = styled.View({ wordWrap: 'break-word' })
