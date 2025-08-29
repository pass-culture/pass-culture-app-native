import React from 'react'
import styled from 'styled-components/native'

import { EmailReceived } from 'features/bookings/components/Ticket/TicketBottomPart/EmailWithdrawal/EmailReceived'
import { EmailWillBeSend } from 'features/bookings/components/Ticket/TicketBottomPart/EmailWithdrawal/EmailWillBeSend'
import { TicketVisual } from 'features/bookings/components/Ticket/TicketBottomPart/TicketVisual'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { EmailSent } from 'ui/svg/icons/EmailSent'
import { getSpacing } from 'ui/theme'

type Props = {
  hasEmailBeenSent: boolean
  withdrawalDelay?: number | null
  isDuo: boolean
  userEmail: UserProfileResponseWithoutSurvey['email']
}

export const EmailWithdrawal = ({ hasEmailBeenSent, withdrawalDelay, isDuo, userEmail }: Props) => {
  return (
    <TicketContainer>
      <TicketVisual>
        <StyledEmailSent />
      </TicketVisual>
      {hasEmailBeenSent ? (
        <EmailReceived isEventDay={false} isDuo={isDuo} userEmail={userEmail} />
      ) : (
        <EmailWillBeSend isDuo={isDuo} userEmail={userEmail} withdrawalDelay={withdrawalDelay} />
      )}
    </TicketContainer>
  )
}

const TicketContainer = styled.View(({ theme }) => ({
  width: '100%',
  gap: theme.designSystem.size.spacing.l,
}))

const StyledEmailSent = styled(EmailSent).attrs({
  size: getSpacing(24),
})``
