import React, { FunctionComponent } from 'react'
import { openInbox } from 'react-native-email-link'
import styled from 'styled-components/native'

import { useIsMailAppAvailable } from 'features/auth/helpers/useIsMailAppAvailable'
import { getEmailMessage } from 'features/bookings/components/OldBookingDetails/TicketBody/ticketBodyMessages'
import { Button } from 'ui/designSystem/Button/Button'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
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
        <Button
          wording="Consulter mes e-mails"
          onPress={(_event) => {
            void openInbox()
          }}
          icon={EmailFilled}
          variant="tertiary"
          color="neutral"
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
