import { t } from '@lingui/macro'
import React from 'react'

import { _ } from 'libs/i18n'
import { Typo } from 'ui/theme'

export const CancellationDetails: React.FC = () => {
  return <Typo.Title4>{_(t`Conditions d'annulation`)}</Typo.Title4>
}
