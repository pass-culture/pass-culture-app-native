import React from 'react'
import { openInbox } from 'react-native-email-link'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Email } from 'ui/svg/icons/Email'

export const OpenInboxButton = () => (
  <ButtonPrimary wording="Consulter mes e-mails" onPress={openInbox} icon={Email} />
)
