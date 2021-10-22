import { t } from '@lingui/macro'
import React from 'react'

import { Typo } from 'ui/theme'

export function ChangeEmail() {
  return (
    <React.Fragment>
      <Typo.Body>{t`Page de changement d'e-mail`}</Typo.Body>
    </React.Fragment>
  )
}
