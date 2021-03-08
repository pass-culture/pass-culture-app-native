import { t } from '@lingui/macro'
import React from 'react'

import { _ } from 'libs/i18n'
import { Typo, Spacer } from 'ui/theme'

export const BookHourChoice: React.FC = () => {
  return (
    <React.Fragment>
      <Typo.Title4>{_(t`Heure`)}</Typo.Title4>
      <Spacer.Column numberOfSpaces={2} />
      <Typo.ButtonText>{_(t`21:00`)}</Typo.ButtonText>
    </React.Fragment>
  )
}
