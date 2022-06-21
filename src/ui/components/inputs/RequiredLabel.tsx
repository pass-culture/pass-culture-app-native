import { t } from '@lingui/macro'
import React from 'react'

import { InputCaption } from 'ui/components/inputs/InputCaption'

export function RequiredLabel() {
  return <InputCaption>{t`Obligatoire`}</InputCaption>
}
