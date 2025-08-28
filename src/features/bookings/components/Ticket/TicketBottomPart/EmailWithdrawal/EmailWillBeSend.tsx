import React from 'react'
import styled from 'styled-components/native'

import { getDelayMessage } from 'features/bookings/helpers/getDelayMessage'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { Typo } from 'ui/theme'

export const EmailWillBeSend = ({
  isDuo,
  userEmail,
  withdrawalDelay,
}: {
  withdrawalDelay?: number | null
  isDuo: boolean
  userEmail: UserProfileResponseWithoutSurvey['email']
}) => {
  const startText = `Tu vas recevoir ${isDuo ? 'tes billets' : 'ton billet'} par e-mail, à l’adresse ${userEmail}, `
  const endText = `avant le début de l’évènement.`

  return (
    <WithDrawalContainer testID="withdrawal-email-will-be-send">
      {startText}
      {withdrawalDelay ? (
        <TicketWithdrawalDelay>{getDelayMessage(withdrawalDelay)}</TicketWithdrawalDelay>
      ) : (
        ' '
      )}
      {endText}
    </WithDrawalContainer>
  )
}

const WithDrawalContainer = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  maxWidth: '100%',
  paddingBottom: theme.designSystem.size.spacing.xl,
}))

const TicketWithdrawalDelay = styled(Typo.Body)(({ theme }) => ({
  fontFamily: theme.fontFamily.bold,
}))
