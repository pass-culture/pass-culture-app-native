import { t } from '@lingui/macro'
import React from 'react'

import { GreyDarkCaption } from 'ui/components/GreyDarkCaption'
import { Separator } from 'ui/components/Separator'
import { Spacer } from 'ui/theme'

export function ChangeEmailDisclaimer() {
  const message = t`Saisis ta nouvelle adresse e-mail et ton mot de passe. Tu vas recevoir un e-mail sur ta nouvelle adresse avec un lien de confirmation valable 24h. Tu ne peux modifier ton adresse e-mail qu'une fois par jour.`
  return (
    <React.Fragment>
      <GreyDarkCaption>{message}</GreyDarkCaption>
      <Spacer.Column numberOfSpaces={4} />
      <Separator />
    </React.Fragment>
  )
}
