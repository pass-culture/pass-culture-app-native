import { t } from '@lingui/macro'
import { isSameDay } from 'date-fns'
import React, { FunctionComponent } from 'react'
import { Platform } from 'react-native'
import { openInbox } from 'react-native-email-link'
import styled from 'styled-components/native'

import { ButtonWithLinearGradient } from 'ui/components/buttons/ButtonWithLinearGradient'
import { Email } from 'ui/svg/icons/Email'
import { getSpacing, Typo } from 'ui/theme'

type Props = {
  offerDate: Date
}

export const EmailSent: FunctionComponent<Props> = ({ offerDate }) => {
  const emailMessage = isSameDay(offerDate, new Date())
    ? t`C'est aujourd'hui\u00a0!` +
      '\n' +
      t`Tu as dû recevoir ton billet par e-mail. Pense à vérifier tes spams.`
    : t`Ton billet t'a été envoyé par e-mail. Pense à vérifier tes spams.`

  return (
    <TicketContainer testID="withdrawal-info-email">
      <WithDrawalContainer testID="withdrawal-info-email-msg">{emailMessage}</WithDrawalContainer>
      {Platform.OS !== 'web' && (
        <ButtonWithLinearGradient
          wording="Consulter mes e-mails"
          onPress={openInbox}
          testID="withdrawal-info-email-btn"
          icon={Email}
        />
      )}
    </TicketContainer>
  )
}

const TicketContainer = styled.View({
  width: '100%',
})

const WithDrawalContainer = styled(Typo.Body)({
  textAlign: 'center',
  maxWidth: '100%',
  paddingBottom: getSpacing(6),
})
