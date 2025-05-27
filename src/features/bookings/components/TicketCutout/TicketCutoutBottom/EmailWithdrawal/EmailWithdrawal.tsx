import { addDays, isSameDay } from 'date-fns'
import React from 'react'
import styled from 'styled-components/native'

import { UserProfileResponse } from 'api/gen'
import { EmailReceived } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/EmailWithdrawal/EmailReceived'
import { EmailWillBeSend } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/EmailWithdrawal/EmailWillBeSend'
import { TicketVisual } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/TicketVisual'
import { EmailSent } from 'ui/svg/icons/EmailSent'
import { getSpacing } from 'ui/theme'

type Props = {
  beginningDatetime?: string | null
  withdrawalDelay?: number | null
  isDuo: boolean
  userEmail: UserProfileResponse['email']
}

export const EmailWithdrawal = ({
  beginningDatetime,
  withdrawalDelay,
  isDuo,
  userEmail,
}: Props) => {
  if (beginningDatetime && withdrawalDelay) {
    // Calculation approximate date send e-mail
    const nbDays = withdrawalDelay / 60 / 60 / 24
    const dateSendEmail = addDays(new Date(beginningDatetime), -nbDays)
    const today = new Date()
    const startOfferDate = new Date(beginningDatetime)
    const isEventDay = isSameDay(startOfferDate, today)
    if (isEventDay || today > dateSendEmail)
      return (
        <EmailWithdrawalContainer>
          <EmailReceived isEventDay={isEventDay} isDuo={isDuo} userEmail={userEmail} />
        </EmailWithdrawalContainer>
      )
  }
  return (
    <EmailWithdrawalContainer>
      <EmailWillBeSend isDuo={isDuo} userEmail={userEmail} withdrawalDelay={withdrawalDelay} />
    </EmailWithdrawalContainer>
  )
}

const EmailWithdrawalContainer = ({ children }: { children: React.JSX.Element }) => {
  return (
    <TicketContainer>
      <TicketVisual>
        <StyledEmailSent />
      </TicketVisual>
      {children}
    </TicketContainer>
  )
}

const TicketContainer = styled.View({
  width: '100%',
  gap: getSpacing(4),
})

const StyledEmailSent = styled(EmailSent).attrs({
  size: getSpacing(24),
})``
