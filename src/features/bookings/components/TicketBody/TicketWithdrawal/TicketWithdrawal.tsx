import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { WithdrawalTypeEnum } from 'api/gen'
import {
  getDelayMessage,
  getStartMessage,
} from 'features/bookings/components/TicketBody/ticketBodyMessages'
import { BicolorEmailSent as InitialBicolorEmailSent } from 'ui/svg/icons/BicolorEmailSent'
import { getSpacing, Typo } from 'ui/theme'

type Props = {
  withdrawalType: WithdrawalTypeEnum.by_email | WithdrawalTypeEnum.on_site
  withdrawalDelay: number
}

export const TicketWithdrawal: FunctionComponent<Props> = ({ withdrawalType, withdrawalDelay }) => {
  const startMessage = getStartMessage(withdrawalType)
  const delayMessage = getDelayMessage(withdrawalDelay)
  const endMessage = 'avant le début de l’évènement.'

  return (
    <React.Fragment>
      {withdrawalType === WithdrawalTypeEnum.by_email && (
        <IconContainer>
          <BicolorEmailSent testID="bicolor-email-sent" />
        </IconContainer>
      )}
      <WithDrawalContainer testID="withdrawal-info">
        {startMessage}
        {!!delayMessage && (
          <TicketWithdrawalDelay testID="withdrawal-info-delay">
            {delayMessage}
          </TicketWithdrawalDelay>
        )}
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

const BicolorEmailSent = styled(InitialBicolorEmailSent).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.medium,
  color: theme.colors.primary,
  color2: theme.colors.secondary,
}))``

const WithDrawalContainer = styled(Typo.Body)({
  textAlign: 'center',
  maxWidth: '100%',
  paddingBottom: getSpacing(6),
})

const TicketWithdrawalDelay = styled(Typo.Body)(({ theme }) => ({
  fontFamily: theme.fontFamily.bold,
}))
