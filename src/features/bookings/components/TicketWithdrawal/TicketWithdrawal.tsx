import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { WithdrawalTypeEnum } from 'api/gen'
import {
  getDelayMessage,
  getStartMessage,
} from 'features/bookings/components/TicketBody/ticketBodyMessages'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { EmailSent } from 'ui/svg/icons/EmailSent'
import { Typo } from 'ui/theme'

type Props = {
  withdrawalType: Exclude<WithdrawalTypeEnum, WithdrawalTypeEnum.no_ticket>
  withdrawalDelay: number
}

export const TicketWithdrawal: FunctionComponent<Props> = ({ withdrawalType, withdrawalDelay }) => {
  const startMessage = getStartMessage(withdrawalType)
  const delayMessage = getDelayMessage(withdrawalDelay)
  const endMessage = 'avant le début de l’évènement pour récupérer ton billet.'

  return (
    <StyledViewGap gap={4}>
      {withdrawalType === WithdrawalTypeEnum.by_email ? (
        <IconContainer>
          <EmailSent testID="email-sent" size={71.88} />
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
    </StyledViewGap>
  )
}

const IconContainer = styled.View({
  alignItems: 'center',
  width: '100%',
})

const WithDrawalContainer = styled(Typo.Body)({
  textAlign: 'center',
})

const TicketWithdrawalDelay = styled(Typo.Body)(({ theme }) => ({
  fontFamily: theme.fontFamily.bold,
}))

const StyledViewGap = styled(ViewGap)({
  flexWrap: 'wrap',
})
