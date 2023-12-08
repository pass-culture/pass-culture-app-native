import React from 'react'
import { openInbox } from 'react-native-email-link'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'

export const OpenInboxButton = ({ onAdditionalPress }: { onAdditionalPress?: () => void }) => {
  const onPress = async () => {
    await openInbox()
    onAdditionalPress?.()
  }

  return <ButtonPrimary wording="Consulter mes e-mails" onPress={onPress} icon={EmailFilled} />
}
