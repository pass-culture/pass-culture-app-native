import { t } from '@lingui/macro'
import React from 'react'

import { Typo } from 'ui/theme'

export function RequiredLabel() {
  return <Typo.CaptionNeutralInfo>{t`Obligatoire`}</Typo.CaptionNeutralInfo>
}
