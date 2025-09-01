import React from 'react'
import { openInbox } from 'react-native-email-link'

import { useIsMailAppAvailable } from 'features/auth/helpers/useIsMailAppAvailable'
import { getEmailReceivedWithdrawalMessage } from 'features/bookings/components/Ticket/TicketBottomPart/EmailWithdrawal/getEmailReceivedWithdrawalMessage'
import { TicketText } from 'features/bookings/components/Ticket/TicketBottomPart/TicketText'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Email } from 'ui/svg/icons/Email'

export const EmailReceived = ({
  isEventDay,
  isDuo,
  userEmail,
}: {
  isEventDay: boolean
  isDuo: boolean
  userEmail: UserProfileResponseWithoutSurvey['email']
}) => {
  const emailMessage = getEmailReceivedWithdrawalMessage({ isEventDay, isDuo, userEmail })
  const isMailAppAvailable = useIsMailAppAvailable()

  return (
    <React.Fragment>
      <TicketText testID="withdrawal-email-received">{emailMessage}</TicketText>
      {isMailAppAvailable ? (
        <ButtonTertiaryBlack
          wording="Consulter mes e-mails"
          onPress={() => {
            openInbox()
          }}
          icon={Email}
        />
      ) : null}
    </React.Fragment>
  )
}
