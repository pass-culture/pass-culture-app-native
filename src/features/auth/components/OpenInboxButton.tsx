import { t } from '@lingui/macro'
import React from 'react'
import { openInbox } from 'react-native-email-link'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Spacer } from 'ui/components/spacer/Spacer'
import { ExternalSiteDeprecated } from 'ui/svg/icons/ExternalSite_deprecated'

export const OpenInboxButton = () => (
  <React.Fragment>
    <Spacer.Column numberOfSpaces={3} />
    <ButtonPrimary
      title={t`Consulter mes e-mails`}
      onPress={openInbox}
      icon={ExternalSiteDeprecated}
    />
  </React.Fragment>
)
