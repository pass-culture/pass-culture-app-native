import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { WithdrawalTypeEnum } from 'api/gen'
import {
  getDelayMessage,
  getStartMessage,
} from 'features/bookings/components/OldBookingDetails/TicketBody/ticketBodyMessages'
import { EmailSent as InitialEmailSent } from 'ui/svg/icons/EmailSent'
import { getSpacing, Typo } from 'ui/theme'

type Props = {
  withdrawalType: Exclude<WithdrawalTypeEnum, WithdrawalTypeEnum.no_ticket>
  withdrawalDelay: number
}

export const TicketWithdrawal: FunctionComponent<Props> = ({ withdrawalType, withdrawalDelay }) => {
  const startMessage = getStartMessage(withdrawalType)
  const delayMessage = getDelayMessage(withdrawalDelay)
  const endMessage = 'avant le début de l’évènement.'

  return (
    <React.Fragment>
      {withdrawalType === WithdrawalTypeEnum.by_email ? (
        <IconContainer>
          <StyledEmailSent testID="email-sent" />
        </IconContainer>
      ) : null}
      <WithDrawalContainer testID="withdrawal-info">
        {startMessage}
        {delayMessage ? (
          <TicketWithdrawalDelay testID="withdrawal-info-delay">
            {delayMessage}
          </TicketWithdrawalDelay>
        ) : null}
        {endMessage}
      </WithDrawalContainer>
    </React.Fragment>
  )
}

const IconContainer = styled.View({
  alignItems: 'center',
  width: '100%',
  marginTop: -getSpacing(4),
  marginBottom: getSpacing(3),
})

const StyledEmailSent = styled(InitialEmailSent).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
}))``

const WithDrawalContainer = styled(Typo.Body)({
  textAlign: 'center',
  maxWidth: '100%',
  paddingBottom: getSpacing(6),
})

const TicketWithdrawalDelay = styled(Typo.Body)(({ theme }) => ({
  fontFamily: theme.fontFamily.bold,
}))
