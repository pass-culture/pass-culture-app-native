import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'

export function RequiredLabel() {
  return <Label>{t`Obligatoire`}</Label>
}

const Label = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
