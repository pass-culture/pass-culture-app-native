import React from 'react'
import { openInbox } from 'react-native-email-link'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Email } from 'ui/svg/icons/Email'

export const OpenInboxButton = ({ onAdditionalPress }: { onAdditionalPress?: () => void }) => {
  const onPress = async () => {
    await openInbox()
    onAdditionalPress?.()
  }

  return <ButtonPrimary wording="Consulter mes e-mails" onPress={onPress} icon={Email} />
}
