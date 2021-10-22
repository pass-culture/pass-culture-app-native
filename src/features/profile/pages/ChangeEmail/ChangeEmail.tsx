import { t } from '@lingui/macro'
import React from 'react'

import { ProfileContainer } from 'features/profile/components/reusables'
import { ChangeEmailDisclaimer } from 'features/profile/pages/ChangeEmail/ChangeEmailDisclaimer'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { Spacer } from 'ui/theme'

export function ChangeEmail() {
  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <ProfileContainer>
        <Spacer.Column numberOfSpaces={18} />
        <ChangeEmailDisclaimer />
      </ProfileContainer>
      <PageHeader title={t`Modifier mon e-mail`} />
    </React.Fragment>
  )
}
