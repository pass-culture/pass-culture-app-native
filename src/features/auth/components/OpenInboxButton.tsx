import { t } from '@lingui/macro'
import React from 'react'
import { openInbox } from 'react-native-email-link'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'

export const OpenInboxButton = () => (
  <ButtonPrimary
    title={t`Consulter mes e-mails`}
    onPress={openInbox}
    icon={ExternalSite}
    iconSize={20}
  />
)
