import React, { FunctionComponent } from 'react'
import { openInbox } from 'react-native-email-link'
import styled from 'styled-components/native'

import { useIsMailAppAvailable } from 'features/auth/helpers/useIsMailAppAvailable'
import { getEmailMessage } from 'features/bookings/components/OldBookingDetails/TicketBody/ticketBodyMessages'
import { ButtonWithLinearGradientDeprecated } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradientDeprecated'
import { Email } from 'ui/svg/icons/Email'
import { Typo } from 'ui/theme'

type Props = {
  offerDate: Date
}

export const EmailSent: FunctionComponent<Props> = ({ offerDate }) => {
  const emailMessage = getEmailMessage(offerDate)
  const isMailAppAvailable = useIsMailAppAvailable()

  return (
    <TicketContainer testID="withdrawal-info-email">
      <WithDrawalContainer testID="withdrawal-info-email-msg">{emailMessage}</WithDrawalContainer>
      {isMailAppAvailable ? (
        <ButtonWithLinearGradientDeprecated
          wording="Consulter mes e-mails"
          onPress={(_event) => {
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

const WithDrawalContainer = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  maxWidth: '100%',
  paddingBottom: theme.designSystem.size.spacing.xl,
}))
