import React from 'react'

import { Separator } from 'ui/components/Separator'
import { Spacer, Typo } from 'ui/theme'

export function ChangeEmailDisclaimer() {
  return (
    <React.Fragment>
      <Typo.CaptionNeutralInfo>
        Pour modifier ton adress e-mail, tu dois d’abord faire une demande de modification.
      </Typo.CaptionNeutralInfo>
      <Spacer.Column numberOfSpaces={4} />
      <Typo.CaptionNeutralInfo>
        Tu ne peux modifier ton adresse e-mail qu’une fois par jour.
      </Typo.CaptionNeutralInfo>
      <Spacer.Column numberOfSpaces={4} />
      <Separator.Horizontal />
    </React.Fragment>
  )
}
