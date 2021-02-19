import { t } from '@lingui/macro'
import React from 'react'

import { _ } from 'libs/i18n'
import { Typo } from 'ui/theme'

export const BookDuoChoice: React.FC = () => {
  return (
    <React.Fragment>
      <Typo.Title4>{_(t`Nombre de place`)}</Typo.Title4>
      <Typo.ButtonText>{_(t`Duo`)}</Typo.ButtonText>
    </React.Fragment>
  )
}
