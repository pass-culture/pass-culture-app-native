import React, { FunctionComponent } from 'react'
import { openInbox } from 'react-native-email-link'
import styled from 'styled-components/native'

import { useIsMailAppAvailable } from 'features/auth/helpers/useIsMailAppAvailable'
import { getEmailMessage } from 'features/bookings/components/TicketBody/ticketBodyMessages'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { Email } from 'ui/svg/icons/Email'
import { getSpacing, Typo } from 'ui/theme'

type Props = {
  offerDate: Date
}

export const EmailSent: FunctionComponent<Props> = ({ offerDate }) => {
  const emailMessage = getEmailMessage(offerDate)
  const isMailAppAvailable = useIsMailAppAvailable()

  return (
    <TicketContainer testID="withdrawal-info-email">
      <WithDrawalContainer testID="withdrawal-info-email-msg">{emailMessage}</WithDrawalContainer>
      {!!isMailAppAvailable && (
        <ButtonWithLinearGradient
          wording="Consulter mes e-mails"
          onPress={(_event) => {
            openInbox()
          }}
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
