import { t } from '@lingui/macro'
import React from 'react'

import { GreyDarkCaption } from 'ui/components/GreyDarkCaption'

export function RequiredLabel() {
  return <GreyDarkCaption>{t`Obligatoire`}</GreyDarkCaption>
}
