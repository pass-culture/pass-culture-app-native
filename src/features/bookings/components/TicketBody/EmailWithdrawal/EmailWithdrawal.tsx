import { addDays, isSameDay } from 'date-fns'
import React from 'react'
import styled from 'styled-components/native'

import { EmailReceived } from 'features/bookings/components/TicketBody/EmailWithdrawal/EmailReceived'
import { TicketVisual } from 'features/bookings/components/TicketBody/TicketVisual'
import { getDelayMessage } from 'features/bookings/helpers/getDelayMessage'
import { EmailSent } from 'ui/svg/icons/EmailSent'
import { Typo, getSpacing } from 'ui/theme'

type Props = {
  beginningDatetime?: string | null
  withdrawalDelay?: number | null
}

export const EmailWithdrawal = ({ beginningDatetime, withdrawalDelay }: Props) => {
  if (beginningDatetime && withdrawalDelay) {
    // Calculation approximate date send e-mail
    const nbDays = withdrawalDelay / 60 / 60 / 24
    const dateSendEmail = addDays(new Date(beginningDatetime), -nbDays)
    const today = new Date()
    const startOfferDate = new Date(beginningDatetime)
    const isEventDay = isSameDay(startOfferDate, today)
    if (isEventDay || today > dateSendEmail) return <EmailReceived isEventDay={isEventDay} />
  }

  return (
    <React.Fragment>
      <TicketVisual>
        <EmailSent />
      </TicketVisual>
      <WithDrawalContainer testID="withdrawal-info">
        {'Tu vas recevoir ton billet par e-mail '}
        {withdrawalDelay ? (
          <TicketWithdrawalDelay testID="withdrawal-info-delay">
            {getDelayMessage(withdrawalDelay)}
          </TicketWithdrawalDelay>
        ) : null}
        {'avant le début de l’évènement.'}
      </WithDrawalContainer>
    </React.Fragment>
  )
}

const WithDrawalContainer = styled(Typo.Body)({
  textAlign: 'center',
  maxWidth: '100%',
  paddingBottom: getSpacing(6),
})

const TicketWithdrawalDelay = styled(Typo.Body)(({ theme }) => ({
  fontFamily: theme.fontFamily.bold,
}))
