import { addDays, isSameDay } from 'date-fns'
import React from 'react'

import { UserProfileResponse } from 'api/gen'
import { EmailReceived } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/EmailWithdrawal/EmailReceived'
import { EmailWillBeSend } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/EmailWithdrawal/EmailWillBeSend'

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
      return <EmailReceived isEventDay={isEventDay} isDuo={isDuo} userEmail={userEmail} />
  }
  return <EmailWillBeSend isDuo={isDuo} userEmail={userEmail} withdrawalDelay={withdrawalDelay} />
}
