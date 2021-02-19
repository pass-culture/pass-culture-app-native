import { t } from '@lingui/macro'
import React from 'react'

import { _ } from 'libs/i18n'
import { Typo } from 'ui/theme'

export const BookDateChoice: React.FC = () => {
  return (
    <React.Fragment>
      <Typo.Title4>{_(t`Date`)}</Typo.Title4>
      <Typo.ButtonText>{_(t`Samedi 12 mai 2021`)}</Typo.ButtonText>
    </React.Fragment>
  )
}
