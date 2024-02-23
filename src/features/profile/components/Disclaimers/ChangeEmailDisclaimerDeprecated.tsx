import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { Separator } from 'ui/components/Separator'
import { Spacer, Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'

export function ChangeEmailDisclaimerDeprecated() {
  const { user } = useAuthContext()
  const currentUserEmail = user?.email ?? 'ton adresse actuelle'

  return (
    <React.Fragment>
      <Typo.CaptionNeutralInfo>
        Saisis ta nouvelle adresse e-mail et ton mot de passe. Tu vas recevoir un e-mail sur{SPACE}
        {currentUserEmail} avec un lien de confirmation valable 24h. Tu ne peux modifier ton adresse
        e-mail qu’une fois par jour.
      </Typo.CaptionNeutralInfo>
      <Spacer.Column numberOfSpaces={4} />
      <Separator.Horizontal />
    </React.Fragment>
  )
}
