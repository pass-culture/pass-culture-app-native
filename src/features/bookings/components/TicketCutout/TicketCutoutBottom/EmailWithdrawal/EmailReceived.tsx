import React from 'react'
import { openInbox } from 'react-native-email-link'

import { UserProfileResponse } from 'api/gen'
import { useIsMailAppAvailable } from 'features/auth/helpers/useIsMailAppAvailable'
import { getEmailReceivedWithdrawalMessage } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/EmailWithdrawal/getEmailReceivedWithdrawalMessage'
import { TicketText } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/TicketText'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Email } from 'ui/svg/icons/Email'

export const EmailReceived = ({
  isEventDay,
  isDuo,
  userEmail,
}: {
  isEventDay: boolean
  isDuo: boolean
  userEmail: UserProfileResponse['email']
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
