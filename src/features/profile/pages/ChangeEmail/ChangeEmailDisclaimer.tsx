import { t } from '@lingui/macro'
import React from 'react'

import { Separator } from 'ui/components/Separator'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

export function ChangeEmailDisclaimer() {
  const message = t`Pour plus de sécurité, saisis ton mot de passe ! Tu recevras un e-mail sur ta nouvelle adresse avec un lien à activer pour confirmer la modification.`
  return (
    <React.Fragment>
      <Typo.Caption color={ColorsEnum.GREY_DARK}>{message}</Typo.Caption>
      <Spacer.Column numberOfSpaces={4} />
      <Separator />
    </React.Fragment>
  )
}
