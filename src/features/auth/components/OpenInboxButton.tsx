import React from 'react'
import { openInbox } from 'react-native-email-link'

import { Button } from 'ui/designSystem/Button/Button'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'

export const OpenInboxButton = ({ onAdditionalPress }: { onAdditionalPress?: () => void }) => {
  const onPress = async () => {
    await openInbox()
    onAdditionalPress?.()
  }

  return <Button fullWidth wording="Consulter mes e-mails" onPress={onPress} icon={EmailFilled} />
}
