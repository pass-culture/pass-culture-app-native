import { t } from '@lingui/macro'
import React from 'react'

import { Separator } from 'ui/components/Separator'
import { Spacer, Typo } from 'ui/theme'

export function ChangeEmailDisclaimer() {
  const message = t`Saisis ta nouvelle adresse e-mail et ton mot de passe. Tu vas recevoir un e-mail sur ta nouvelle adresse avec un lien de confirmation valable 24h. Tu ne peux modifier ton adresse e-mail qu'une fois par jour.`
  return (
    <React.Fragment>
      <Typo.CaptionNeutralInfo>{message}</Typo.CaptionNeutralInfo>
      <Spacer.Column numberOfSpaces={4} />
      <Separator />
    </React.Fragment>
  )
}
